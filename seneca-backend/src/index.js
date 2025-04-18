require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de SENECA funcionando');
});

const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);

// Conexión y arranque
sequelize.authenticate()
  .then(() => {
    console.log('Conectado a PostgreSQL');
    return sequelize.sync({ alter: true });// Crea las tablas si no existen
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('Error al conectar a la base de datos:', err));
