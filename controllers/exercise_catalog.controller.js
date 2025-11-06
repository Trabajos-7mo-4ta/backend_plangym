import pool from '../db.js';

// 🔹 Obtener todos los ejercicios del catálogo
export const getAllExercises = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM exercise_catalog ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener ejercicios del catálogo' });
  }
};

// 🔹 Crear un ejercicio nuevo
export const createExercise = async (req, res) => {
  try {
    const { nombre_ejercicio, grupo_muscular, descripcion } = req.body;
    const result = await pool.query(
      'INSERT INTO exercise_catalog (nombre_ejercicio, grupo_muscular, descripcion) VALUES ($1, $2, $3) RETURNING *',
      [nombre_ejercicio, grupo_muscular, descripcion]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear ejercicio' });
  }
};

// 🔹 Eliminar ejercicio
export const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM exercise_catalog WHERE id=$1', [id]);
    res.json({ message: 'Ejercicio eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar ejercicio' });
  }
};

export const updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_ejercicio, grupo_muscular, descripcion } = req.body;

    const result = await pool.query(
      `UPDATE exercise_catalog
       SET nombre_ejercicio = $1,
           grupo_muscular = $2,
           descripcion = $3
       WHERE id = $4
       RETURNING *`,
      [nombre_ejercicio, grupo_muscular, descripcion, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar ejercicio' });
  }
};