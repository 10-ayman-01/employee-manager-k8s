const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');
const employeesRouter = require('./routes/employees');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/employees', employeesRouter);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

initDB().then(() => {
  app.listen(3000, () => console.log('Backend corriendo en puerto 3000'));
}).catch(err => {
  console.error('Error iniciando la app:', err);
  process.exit(1);
});