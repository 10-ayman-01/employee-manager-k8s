const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, department, position, salary, email } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO employees (name, department, position, salary, email)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, department, position, salary, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { name, department, position, salary, email } = req.body;
  try {
    const result = await pool.query(
      `UPDATE employees
       SET name=$1, department=$2, position=$3, salary=$4, email=$5
       WHERE id=$6 RETURNING *`,
      [name, department, position, salary, email, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM employees WHERE id=$1', [req.params.id]);
    res.json({ message: 'Empleado eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;