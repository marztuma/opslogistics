const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  if (!authToken) {
    redirectToLogin();
    return;
  }

  updateUserInfo();
  loadDashboard();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      navigateToSection(section);
    });
  });

  document.getElementById('logoutBtn').addEventListener('click', logout);
}

// Navigation
function navigateToSection(section) {
  document.querySelectorAll('.section-content').forEach(el => el.classList.add('hide'));
  document.getElementById(section).classList.remove('hide');

  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  document.querySelector(`[data-section="${section}"]`).classList.add('active');

  const titles = {
    dashboard: 'Dashboard',
    shipments: 'Shipments',
    orders: 'Orders',
    customers: 'Customers',
    pricing: 'Pricing Management',
    reports: 'Reports',
    users: 'User Management'
  };

  document.getElementById('pageTitle').textContent = titles[section];

  // Load section data
  switch(section) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'shipments':
      loadAllShipments();
      break;
    case 'orders':
      loadAllOrders();
      break;
    case 'customers':
      loadAllCustomers();
      break;
    case 'pricing':
      loadPricingRules();
      break;
    case 'reports':
      loadReports();
      break;
    case 'users':
      loadUsers();
      break;
  }
}

// API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (response.status === 401) {
      redirectToLogin();
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error('API error:', err);
    return null;
  }
}

// Dashboard
async function loadDashboard() {
  const stats = await apiCall('/admin/dashboard');
  if (!stats) return;

  const statsGrid = document.getElementById('statsGrid');
  statsGrid.innerHTML = `
    <div class="stat-card">
      <h3>Total Shipments</h3>
      <div class="value">${stats.total_shipments || 0}</div>
    </div>
    <div class="stat-card">
      <h3>Delivered</h3>
      <div class="value">${stats.delivered || 0}</div>
    </div>
    <div class="stat-card">
      <h3>In Transit</h3>
      <div class="value">${stats.in_transit || 0}</div>
    </div>
    <div class="stat-card">
      <h3>Failed</h3>
      <div class="value">${stats.failed || 0}</div>
    </div>
    <div class="stat-card">
      <h3>Total Orders</h3>
      <div class="value">${stats.total_orders || 0}</div>
    </div>
    <div class="stat-card">
      <h3>Total Revenue</h3>
      <div class="value">$${(stats.total_revenue || 0).toFixed(2)}</div>
    </div>
    <div class="stat-card">
      <h3>Total Customers</h3>
      <div class="value">${stats.total_customers || 0}</div>
    </div>
    <div class="stat-card">
      <h3>Total Users</h3>
      <div class="value">${stats.total_users || 0}</div>
    </div>
  `;

  loadRecentShipments();
  loadRecentOrders();
}

async function loadRecentShipments() {
  const data = await apiCall('/admin/shipments?limit=5');
  if (!data || !data.data) return;

  const tbody = document.getElementById('shipmentsBody');
  tbody.innerHTML = data.data.length > 0 ? data.data.map(s => `
    <tr>
      <td>${s.tracking_number}</td>
      <td>${s.customer_id}</td>
      <td><span class="badge ${getStatusBadgeClass(s.status)}">${s.status}</span></td>
      <td>${s.weight || '-'} kg</td>
      <td>${new Date(s.created_at).toLocaleDateString()}</td>
    </tr>
  `).join('') : '<tr><td colspan="5" style="text-align: center;">No shipments</td></tr>';
}

async function loadRecentOrders() {
  const data = await apiCall('/admin/orders?limit=5');
  if (!data || !data.data) return;

  const tbody = document.getElementById('ordersBody');
  tbody.innerHTML = data.data.length > 0 ? data.data.map(o => `
    <tr>
      <td>${o.order_number}</td>
      <td>${o.customer_id}</td>
      <td>$${(o.total_amount || 0).toFixed(2)}</td>
      <td><span class="badge ${o.payment_status === 'paid' ? 'success' : 'pending'}">${o.payment_status}</span></td>
      <td>${new Date(o.created_at).toLocaleDateString()}</td>
    </tr>
  `).join('') : '<tr><td colspan="5" style="text-align: center;">No orders</td></tr>';
}

async function loadAllShipments() {
  const data = await apiCall('/admin/shipments?limit=20');
  if (!data || !data.data) return;

  const tbody = document.getElementById('allShipmentsBody');
  tbody.innerHTML = data.data.length > 0 ? data.data.map(s => `
    <tr>
      <td>${s.tracking_number}</td>
      <td>${s.customer_id}</td>
      <td><span class="badge ${getStatusBadgeClass(s.status)}">${s.status}</span></td>
      <td>${s.weight || '-'} kg</td>
      <td>${new Date(s.created_at).toLocaleDateString()}</td>
      <td><button class="btn btn-small btn-primary" onclick="viewShipment(${s.id})">View</button></td>
    </tr>
  `).join('') : '<tr><td colspan="6" style="text-align: center;">No shipments</td></tr>';
}

async function loadAllOrders() {
  const data = await apiCall('/admin/orders?limit=20');
  if (!data || !data.data) return;

  const tbody = document.getElementById('allOrdersBody');
  tbody.innerHTML = data.data.length > 0 ? data.data.map(o => `
    <tr>
      <td>${o.order_number}</td>
      <td>${o.customer_id}</td>
      <td>$${(o.total_amount || 0).toFixed(2)}</td>
      <td><span class="badge ${o.payment_status === 'paid' ? 'success' : 'pending'}">${o.payment_status}</span></td>
      <td><span class="badge pending">${o.order_status}</span></td>
      <td>${new Date(o.created_at).toLocaleDateString()}</td>
      <td><button class="btn btn-small btn-primary" onclick="viewOrder(${o.id})">View</button></td>
    </tr>
  `).join('') : '<tr><td colspan="7" style="text-align: center;">No orders</td></tr>';
}

async function loadAllCustomers() {
  const data = await apiCall('/admin/customers?limit=20');
  if (!data || !data.data) return;

  const tbody = document.getElementById('allCustomersBody');
  tbody.innerHTML = data.data.length > 0 ? data.data.map(c => `
    <tr>
      <td>${c.business_name || '-'}</td>
      <td>${c.email}</td>
      <td>${c.volume_tier}</td>
      <td>${c.total_shipments}</td>
      <td>$${(c.total_spending || 0).toFixed(2)}</td>
      <td><button class="btn btn-small btn-primary" onclick="viewCustomer(${c.id})">View</button></td>
    </tr>
  `).join('') : '<tr><td colspan="6" style="text-align: center;">No customers</td></tr>';
}

async function loadPricingRules() {
  const data = await apiCall('/pricing/rules');
  if (!data) return;

  const tbody = document.getElementById('pricingBody');
  tbody.innerHTML = data.length > 0 ? data.map(r => `
    <tr>
      <td>${r.origin_country}</td>
      <td>${r.destination_country}</td>
      <td>${r.service_type}</td>
      <td>$${(r.price_per_kg || 0).toFixed(2)}</td>
      <td><button class="btn btn-small btn-primary" onclick="editPricingRule(${r.id})">Edit</button></td>
    </tr>
  `).join('') : '<tr><td colspan="5" style="text-align: center;">No pricing rules</td></tr>';
}

async function loadReports() {
  const revenue = await apiCall('/admin/reports/revenue');
  const shipments = await apiCall('/admin/reports/shipments');

  if (shipments) {
    const tbody = document.getElementById('analyticsBody');
    tbody.innerHTML = shipments.length > 0 ? shipments.map(s => `
      <tr>
        <td>${s.service_type}</td>
        <td>${s.count}</td>
        <td>${(s.avg_weight || 0).toFixed(2)} kg</td>
      </tr>
    `).join('') : '<tr><td colspan="3" style="text-align: center;">No data</td></tr>';
  }
}

async function loadUsers() {
  const data = await apiCall('/admin/users');
  if (!data) return;

  const tbody = document.getElementById('usersBody');
  tbody.innerHTML = data.length > 0 ? data.map(u => `
    <tr>
      <td>${u.email}</td>
      <td>${u.first_name || '-'} ${u.last_name || '-'}</td>
      <td><span class="badge">${u.role}</span></td>
      <td><span class="badge success">${u.status}</span></td>
      <td>${new Date(u.created_at).toLocaleDateString()}</td>
    </tr>
  `).join('') : '<tr><td colspan="5" style="text-align: center;">No users</td></tr>';
}

// Helper functions
function getStatusBadgeClass(status) {
  if (status === 'delivered') return 'success';
  if (status === 'failed') return 'failed';
  return 'pending';
}

function updateUserInfo() {
  document.getElementById('userName').textContent = currentUser.email || 'Admin User';
  document.getElementById('userRole').textContent = currentUser.role || 'admin';
}

function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  redirectToLogin();
}

function redirectToLogin() {
  window.location.href = '/admin/login.html';
}

// Placeholder functions for future implementation
function viewShipment(id) {
  alert('View shipment ' + id);
}

function viewOrder(id) {
  alert('View order ' + id);
}

function viewCustomer(id) {
  alert('View customer ' + id);
}

function editPricingRule(id) {
  alert('Edit pricing rule ' + id);
}
