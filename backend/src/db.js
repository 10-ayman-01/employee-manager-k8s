const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: 5432,
  database: process.env.DB_NAME || 'employeedb',
  user: process.env.DB_USER || 'empuser',
  password: process.env.DB_PASSWORD || 'emppass',
});

async function initDB() {
  let retries = 5;
  while (retries > 0) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS employees (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          department VARCHAR(100) NOT NULL,
          position VARCHAR(100) NOT NULL,
          salary NUMERIC(10,2) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('Base de datos lista');
      return;
    } catch (err) {
      console.log(`Esperando DB... intentos restantes: ${retries}`);
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  throw new Error('No se pudo conectar a la base de datos');
}

module.exports = { pool, initDB };