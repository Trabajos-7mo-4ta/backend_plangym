import  pool  from '../db.js';

export const getDaysByRoutine = async (req, res) => {
  try {
    const { rutina_id } = req.params;
    const result = await pool.query('SELECT * FROM days WHERE rutina_id=$1 ORDER BY orden', [rutina_id]);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener días' });
  }
};

export const createDay = async (req, res) => {
  try {
    const { rutina_id, nombre_dia, orden } = req.body;
    const result = await pool.query(
      'INSERT INTO days (rutina_id, nombre_dia, orden) VALUES ($1, $2, $3) RETURNING *',
      [rutina_id, nombre_dia, orden]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Error al crear día' });
  }
};

export const updateDay = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_dia, orden } = req.body;
    const result = await pool.query(
      'UPDATE days SET nombre_dia=$1, orden=$2 WHERE id=$3 RETURNING *',
      [nombre_dia, orden, id]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Error al actualizar día' });
  }
};

export const deleteDay = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM days WHERE id=$1', [id]);
    res.json({ message: 'Día eliminado correctamente' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar día' });
  }
};