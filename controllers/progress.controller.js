import pool from '../db.js';

export const getProgressByUser = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const result = await pool.query(
      `SELECT p.*, r.titulo AS rutina_titulo
       FROM progress p
       JOIN routines r ON p.rutina_id = r.id
       WHERE p.usuario_id = $1
       ORDER BY p.created_at DESC`,
      [usuario_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error en getProgressByUser:', error);
    res.status(500).json({ error: 'Error al obtener progreso' });
  }
};

export const createProgress = async (req, res) => {
  try {
    const { usuario_id, rutina_id, semana, descripcion } = req.body;

    const result = await pool.query(
      'INSERT INTO progress (usuario_id, rutina_id, semana, comentario) VALUES ($1, $2, $3, $4) RETURNING *',
      [usuario_id, rutina_id, semana, descripcion] 
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error en createProgress:', error);
    res.status(500).json({ error: 'Error al crear progreso' });
  }
};

export const deleteProgress = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM progress WHERE id=$1', [id]);
    res.json({ message: 'Progreso eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteProgress:', error);
    res.status(500).json({ error: 'Error al eliminar progreso' });
  }
};