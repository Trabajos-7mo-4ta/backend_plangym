import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import routinesRoutes from './routes/routines.routes.js';
import daysRoutes from './routes/days.routes.js';
import exercisesRoutes from './routes/exercises.routes.js';
import progressRoutes from './routes/progress.routes.js';
import exerciseProgressRoutes from './routes/exercise_progress.routes.js';
import exerciseCatalogRoutes from './routes/exercise_catalog.routes.js';
import userRoutes from './routes/users.routes.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/routines', routinesRoutes);
app.use('/api/days', daysRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/exercise-progress', exerciseProgressRoutes);
app.use('/api/exercise-catalog', exerciseCatalogRoutes);
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 4000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);

});
