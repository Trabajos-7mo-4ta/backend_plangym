// controllers/routines.controller.js
import pool from '../db.js';

// Obtener todas las rutinas públicas
export const getPublicRoutines = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM routines WHERE publica = true ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener rutinas públicas' });
  }
};

// Obtener rutinas del usuario (propias y públicas)
export const getRoutinesByUser = async (req, res) => {
  try {
    const { id } = req.params; // id del usuario
    const result = await pool.query(
      'SELECT * FROM routines WHERE usuario_id = $1 ORDER BY id DESC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener rutinas del usuario' });
  }
};

// 🔹 Crear una nueva rutina
export const createRoutine = async (req, res) => {
  try {
    const { titulo, descripcion, usuario_id, actual } = req.body;

    // 🔹 Consultar rol del usuario
    const userRes = await pool.query('SELECT rol FROM users WHERE id=$1', [usuario_id]);
    const rol = userRes.rows[0]?.rol || 'usuario';

    // 🔹 Determinar si la rutina será pública según el rol
    const publica = rol === 'entrenador' || rol === 'admin';

    // Si esta rutina se marca como actual, desactivamos las demás del usuario
    if (actual) {
      await pool.query('UPDATE routines SET actual = false WHERE usuario_id = $1', [usuario_id]);
    }

    const result = await pool.query(
      `INSERT INTO routines (titulo, descripcion, usuario_id, publica, actual)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [titulo, descripcion, usuario_id, publica, actual || false]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear rutina' });
  }
};

// Marcar una rutina como actual
export const setRoutineAsCurrent = async (req, res) => {
  try {
    const { id } = req.params; // rutina_id
    const { usuario_id } = req.body;

    await pool.query('UPDATE routines SET actual = false WHERE usuario_id = $1', [usuario_id]);
    const result = await pool.query(
      'UPDATE routines SET actual = true WHERE id = $1 RETURNING *',
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al marcar rutina como actual' });
  }
};

// Obtener la rutina actual del usuario
export const getCurrentRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM routines WHERE usuario_id = $1 AND actual = true LIMIT 1',
      [id]
    );
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la rutina actual' });
  }
};

// Obtener detalles de una rutina
export const getRoutineDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const routineRes = await pool.query('SELECT * FROM routines WHERE id=$1', [id]);
    if (routineRes.rows.length === 0) return res.status(404).json({ error: 'Rutina no encontrada' });
    const routine = routineRes.rows[0];

    const rows = await pool.query(
      `SELECT 
         d.id AS day_id, d.nombre_dia, d.orden,
         e.id AS exercise_id, e.series, e.repeticiones, e.catalogo_id,
         c.nombre_ejercicio, c.grupo_muscular, c.descripcion AS catalogo_descripcion
       FROM days d
       LEFT JOIN exercises e ON e.dia_id = d.id
       LEFT JOIN exercise_catalog c ON c.id = e.catalogo_id
       WHERE d.rutina_id = $1
       ORDER BY d.orden ASC, e.id ASC`,
      [id]
    );

    const daysMap = new Map();
    for (const r of rows.rows) {
      if (!daysMap.has(r.day_id)) {
        daysMap.set(r.day_id, {
          id: r.day_id,
          nombre_dia: r.nombre_dia,
          orden: r.orden,
          exercises: [],
        });
      }
      if (r.exercise_id) {
        daysMap.get(r.day_id).exercises.push({
          id: r.exercise_id,
          catalogo_id: r.catalogo_id,
          nombre_ejercicio: r.nombre_ejercicio,
          grupo_muscular: r.grupo_muscular,
          catalogo_descripcion: r.catalogo_descripcion,
          series: r.series,
          repeticiones: r.repeticiones,
        });
      }
    }

    const days = Array.from(daysMap.values());
    res.json({ routine, days });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener detalles de la rutina' });
  }
};

// Editar rutina
export const updateRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, actual, usuario_id } = req.body;

    const userRes = await pool.query('SELECT rol FROM users WHERE id=$1', [usuario_id]);
    const rol = userRes.rows[0]?.rol || 'usuario';
    const publica = rol === 'entrenador';

    if (actual) {
      await pool.query('UPDATE routines SET actual = false WHERE usuario_id = $1', [usuario_id]);
    }

    const result = await pool.query(
      'UPDATE routines SET titulo=$1, descripcion=$2, publica=$3, actual=$4 WHERE id=$5 RETURNING *',
      [titulo, descripcion, publica, actual || false, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar rutina' });
  }
};

// Eliminar rutina
export const deleteRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM routines WHERE id=$1', [id]);
    res.json({ message: 'Rutina eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar rutina' });
  }
};

export const copyRoutine = async (req, res) => {
  try {
    const { id } = req.params; // rutina original
    const { usuario_id } = req.body;

    // 1. Obtener rutina original
    const originalRes = await pool.query('SELECT * FROM routines WHERE id=$1', [id]);
    if (originalRes.rows.length === 0) return res.status(404).json({ error: 'Rutina no encontrada' });
    const original = originalRes.rows[0];

    // 2. Crear nueva rutina con valores copiados
    const nuevaRes = await pool.query(
      `INSERT INTO routines (titulo, descripcion, usuario_id, publica, actual)
       VALUES ($1, $2, $3, false, false) RETURNING *`,
      [original.titulo, original.descripcion, usuario_id]
    );
    const nuevaRutina = nuevaRes.rows[0];

    // 3. Obtener días de la rutina original
    const diasRes = await pool.query('SELECT * FROM days WHERE rutina_id=$1', [id]);
    const diasOriginales = diasRes.rows;

    for (const dia of diasOriginales) {
      // 4. Crear día en la nueva rutina
      const nuevoDiaRes = await pool.query(
        `INSERT INTO days (rutina_id, nombre_dia, orden) VALUES ($1, $2, $3) RETURNING *`,
        [nuevaRutina.id, dia.nombre_dia, dia.orden]
      );
      const nuevoDia = nuevoDiaRes.rows[0];

      // 5. Obtener ejercicios del día original
      const ejerciciosRes = await pool.query('SELECT * FROM exercises WHERE dia_id=$1', [dia.id]);
      const ejercicios = ejerciciosRes.rows;

      for (const ej of ejercicios) {
        // 6. Crear ejercicio en el nuevo día
        await pool.query(
          `INSERT INTO exercises (dia_id, catalogo_id, series, repeticiones)
           VALUES ($1, $2, $3, $4)`,
          [nuevoDia.id, ej.catalogo_id, ej.series, ej.repeticiones]
        );
      }
    }

    res.json({ message: 'Rutina copiada correctamente', rutina: nuevaRutina });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al copiar rutina' });
  }
};
