import pool from '../db.js';

// Obtener progreso por usuario
export const getExerciseProgressByUser = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const result = await pool.query(
      `SELECT ep.*, ec.nombre_ejercicio, p.semana, p.rutina_id, d.nombre_dia
      FROM exercise_progress ep
      JOIN progress p ON ep.progress_id = p.id
      JOIN exercises e ON ep.ejercicio_id = e.id
      JOIN exercise_catalog ec ON e.catalogo_id = ec.id
      JOIN days d ON e.dia_id = d.id
      WHERE p.usuario_id = $1
      ORDER BY ep.fecha DESC`,
      [usuario_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error en getExerciseProgressByUser:', error);
    res.status(500).json({ error: 'Error al obtener progreso de ejercicios' });
  }
};

// Crear un nuevo progreso de ejercicio
export const createExerciseProgress = async (req, res) => {
  try {
    const { progress_id, ejercicio_id, peso, repeticiones, series, fecha } = req.body;

    const result = await pool.query(
      `INSERT INTO exercise_progress (progress_id, ejercicio_id, peso, repeticiones, series, fecha)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [progress_id, ejercicio_id, peso, repeticiones, series, fecha]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar progreso de ejercicio' });
  }
};

// Eliminar un registro de progreso de ejercicio
export const deleteExerciseProgress = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM exercise_progress WHERE id = $1', [id]);
    res.json({ message: 'Registro de progreso eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar registro de ejercicio' });
  }
};
