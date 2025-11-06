import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  pool  from '../db.js';

export const registerUser = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, hashedPassword, rol || 'user']
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Usuario no encontrado' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Error en el login' });
  }
};

export const loginWithGoogle = async (req, res) => {
  try {
    const { nombre, email, googleId } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);

    let user;
    if (result.rows.length === 0) {
      const insert = await pool.query(
        'INSERT INTO users (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, email, googleId, 'user']
      );
      user = insert.rows[0];
    } else {
      user = result.rows[0];
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en login con Google' });
  }
};


