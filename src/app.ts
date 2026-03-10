import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import veteRoutes from './routes/routes'
dotenv.config();

const app = express();


app.use(express.json());
app.use(cors());


app.use('/auth', authRoutes); 
app.use('/api', veteRoutes);

app.listen(3000, () => {
    console.log("Servidor Backend corriendo en el puerto 3000 con Arquitectura MVC");
});