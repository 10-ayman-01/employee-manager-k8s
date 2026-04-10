const API = '/api/employees';

const DEPT_COLORS = {
  Engineering: { bg: '#e8eaf6', text: '#3949ab' },
  Marketing:   { bg: '#fce4ec', text: '#c2185b' },
  HR:          { bg: '#e8f5e9', text: '#2e7d32' },
  Finance:     { bg: '#fff8e1', text: '#f57f17' },
  Sales:       { bg: '#e0f2f1', text: '#00695c' },
};

async function loadEmployees() {
  const res = await fetch(API);
  const employees = await res.json();

  document.getElementById('total-count').textContent = employees.length;
  const depts = new Set(employees.map(e => e.department)).size;
  document.getElementById('dept-count').textContent = depts;
  const avg = employees.length
    ? Math.round(employees.reduce((s, e) => s + parseFloat(e.salary), 0) / employees.length)
    : 0;
  document.getElementById('avg-salary').textContent = avg.toLocaleString('es-ES');

  const tbody = document.getElementById('employees-table');
  if (employees.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#999;padding:30px">No hay empleados registrados</td></tr>`;
    return;
  }
  tbody.innerHTML = employees.map(e => {
    const c = DEPT_COLORS[e.department] || { bg: '#eee', text: '#333' };
    return `
      <tr>
        <td><strong>${e.name}</strong></td>
        <td style="color:#666">${e.email}</td>
        <td><span class="dept-badge" style="background:${c.bg};color:${c.text}">${e.department}</span></td>
        <td>${e.position}</td>
        <td>${parseFloat(e.salary).toLocaleString('es-ES')} €</td>
        <td class="td-actions">
          <button class="btn btn-edit"   onclick="openEdit(${e.id})">Editar</button>
          <button class="btn btn-danger" onclick="deleteEmployee(${e.id})">Eliminar</button>
        </td>
      </tr>`;
  }).join('');
}

async function createEmployee() {
  const fields = ['name', 'email', 'department', 'position', 'salary'];
  const data = Object.fromEntries(fields.map(f => [f, document.getElementById(f).value.trim()]));
  if (Object.values(data).some(v => !v)) { alert('Por favor, rellena todos los campos'); return; }
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const err = await res.json(); alert('Error: ' + (err.error || 'No se pudo crear')); return; }
  fields.forEach(f => document.getElementById(f).value = '');
  loadEmployees();
}

async function openEdit(id) {
  const res = await fetch(`${API}/${id}`);
  const e = await res.json();
  document.getElementById('edit-id').value = e.id;
  document.getElementById('edit-name').value = e.name;
  document.getElementById('edit-email').value = e.email;
  document.getElementById('edit-department').value = e.department;
  document.getElementById('edit-position').value = e.position;
  document.getElementById('edit-salary').value = e.salary;
  document.getElementById('edit-modal').classList.add('active');
}

async function saveEdit() {
  const id = document.getElementById('edit-id').value;
  const data = {
    name:       document.getElementById('edit-name').value.trim(),
    email:      document.getElementById('edit-email').value.trim(),
    department: document.getElementById('edit-department').value,
    position:   document.getElementById('edit-position').value.trim(),
    salary:     document.getElementById('edit-salary').value,
  };
  await fetch(`${API}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  closeModal();
  loadEmployees();
}

async function deleteEmployee(id) {
  if (!confirm('¿Seguro que quieres eliminar este empleado?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadEmployees();
}

function closeModal() {
  document.getElementById('edit-modal').classList.remove('active');
}

loadEmployees();