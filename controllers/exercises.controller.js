import pool from '../db.js';

// 🔹 Obtener los ejercicios de un día, incluyendo datos del catálogo
export const getExercisesByDay = async (req, res) => {
  try {
    const { dia_id } = req.params;
    const result = await pool.query(
      `SELECT e.id, e.series, e.repeticiones, e.catalogo_id,
              c.nombre_ejercicio, c.grupo_muscular, c.descripcion AS descripcion_catalogo
       FROM exercises e
       LEFT JOIN exercise_catalog c ON e.catalogo_id = c.id
       WHERE e.dia_id = $1
       ORDER BY e.id ASC`,
      [dia_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener ejercicios del día' });
  }
};

// 🔹 Crear un nuevo ejercicio para un día
export const createExercise = async (req, res) => {
  try {
    const { dia_id, catalogo_id, series, repeticiones } = req.body;

    if (!dia_id || !catalogo_id || !series || !repeticiones) {
      return res.status(400).json({ error: 'Datos incompletos para crear el ejercicio' });
    }

    const result = await pool.query(
      `INSERT INTO exercises (dia_id, catalogo_id, series, repeticiones)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [dia_id, catalogo_id, series, repeticiones]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el ejercicio' });
  }
};

// 🔹 Actualizar un ejercicio existente
export const updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { catalogo_id, series, repeticiones } = req.body;

    const result = await pool.query(
      `UPDATE exercises
       SET catalogo_id = $1, series = $2, repeticiones = $3
       WHERE id = $4
       RETURNING *`,
      [catalogo_id, series, repeticiones, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Ejercicio no encontrado' });

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar ejercicio' });
  }
};

// 🔹 Eliminar un ejercicio
export const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM exercises WHERE id=$1', [id]);
    res.json({ message: 'Ejercicio eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar ejercicio' });
  }
};