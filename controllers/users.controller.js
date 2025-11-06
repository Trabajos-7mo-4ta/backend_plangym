import  pool  from '../db.js';

export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, email, rol FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;
    const result = await pool.query(
      'UPDATE users SET rol = $1 WHERE id = $2 RETURNING id, nombre, email, rol',
      [rol, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar rol del usuario' });
  }
};
