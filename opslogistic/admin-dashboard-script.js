const API_URL = 'http://localhost:5000/api';

// Check admin authentication
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') {
        alert('Admin access required');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('adminName').textContent = `${user.first_name} ${user.last_name}`;

    // Setup navigation
    setupNavigation();

    // Load overview data
    loadOverview();
});

// Navigation setup
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchSection(section);

            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function switchSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(sectionName).classList.add('active');

    // Update title
    const titles = {
        overview: '📊 Dashboard Overview',
        shipments: '📦 Shipments',
        orders: '🛒 Orders',
        customers: '👥 Customers',
        pricing: '💰 Pricing Rules',
        reports: '📈 Reports',
        users: '🔑 Admin Users'
    };
    document.getElementById('pageTitle').textContent = titles[sectionName];

    // Load section data
    switch(sectionName) {
        case 'overview':
            loadOverview();
            break;
        case 'shipments':
            loadShipments();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'pricing':
            loadPricing();
            break;
        case 'reports':
            loadReports();
            break;
        case 'users':
            loadUsers();
            break;
    }
}

// Load Overview
async function loadOverview() {
    const token = localStorage.getItem('authToken');

    try {
        const [dashResponse, shipmentsResponse, ordersResponse] = await Promise.all([
            fetch(`${API_URL}/admin/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(`${API_URL}/admin/shipments?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(`${API_URL}/admin/orders?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!dashResponse.ok || !shipmentsResponse.ok || !ordersResponse.ok) {
            throw new Error('Failed to load data');
        }

        const dashData = await dashResponse.json();
        const shipmentsData = await shipmentsResponse.json();
        const ordersData = await ordersResponse.json();

        // Update KPI cards
        document.getElementById('totalShipments').textContent = dashData.total_shipments || '0';
        document.getElementById('activeOrders').textContent = dashData.active_orders || '0';
        document.getElementById('totalCustomers').textContent = dashData.total_customers || '0';
        document.getElementById('monthlyRevenue').textContent = `$${(dashData.monthly_revenue || 0).toLocaleString()}`;

        // Display shipments table
        displayShipmentsTable(shipmentsData.shipments || [], 'recentShipmentsContainer');

        // Display orders table
        displayOrdersTable(ordersData.orders || [], 'recentOrdersContainer');
    } catch (error) {
        console.error('Error loading overview:', error);
        document.getElementById('recentShipmentsContainer').innerHTML =
            `<div class="error">Failed to load data. Check API connection.</div>`;
    }
}

// Load Shipments
async function loadShipments() {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_URL}/admin/shipments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to load shipments');

        const data = await response.json();
        displayShipmentsTable(data.shipments || [], 'shipmentsTableContainer');
    } catch (error) {
        console.error('Error loading shipments:', error);
        document.getElementById('shipmentsTableContainer').innerHTML =
            `<div class="error">Failed to load shipments</div>`;
    }
}

function displayShipmentsTable(shipments, containerId) {
    if (shipments.length === 0) {
        document.getElementById(containerId).innerHTML = '<div style="padding: 2rem; text-align: center; color: #999;">No shipments found</div>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Tracking #</th>
                    <th>Status</th>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Created</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    shipments.forEach(s => {
        const status = s.status || 'pending';
        const statusClass = `status-${status}`;
        const created = new Date(s.created_at).toLocaleDateString();

        html += `
            <tr>
                <td><strong>${s.tracking_number || '—'}</strong></td>
                <td><span class="status-badge ${statusClass}">${status.replace('_', ' ').toUpperCase()}</span></td>
                <td>${s.origin_country || '—'}</td>
                <td>${s.destination_country || '—'}</td>
                <td>${created}</td>
                <td><button class="btn-primary btn-small" onclick="alert('View details for ${s.tracking_number}')">View</button></td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    document.getElementById(containerId).innerHTML = html;
}

// Load Orders
async function loadOrders() {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_URL}/admin/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to load orders');

        const data = await response.json();
        displayOrdersTable(data.orders || [], 'ordersTableContainer');
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('ordersTableContainer').innerHTML =
            `<div class="error">Failed to load orders</div>`;
    }
}

function displayOrdersTable(orders, containerId) {
    if (orders.length === 0) {
        document.getElementById(containerId).innerHTML = '<div style="padding: 2rem; text-align: center; color: #999;">No orders found</div>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Created</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    orders.forEach(o => {
        const status = o.status || 'pending';
        const statusClass = `status-${status}`;
        const created = new Date(o.created_at).toLocaleDateString();
        const total = o.total_price || 0;

        html += `
            <tr>
                <td><strong>#${o.id}</strong></td>
                <td>${o.customer_id || '—'}</td>
                <td><span class="status-badge ${statusClass}">${status.replace('_', ' ').toUpperCase()}</span></td>
                <td>$${total.toFixed(2)}</td>
                <td>${created}</td>
                <td><button class="btn-primary btn-small" onclick="openOrderModal('edit', ${o.id})">Edit</button></td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    document.getElementById(containerId).innerHTML = html;
}

// Load Customers
async function loadCustomers() {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_URL}/admin/customers`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to load customers');

        const data = await response.json();
        const customers = data.customers || [];

        if (customers.length === 0) {
            document.getElementById('customersTableContainer').innerHTML = '<div style="padding: 2rem; text-align: center; color: #999;">No customers found</div>';
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Company</th>
                        <th>Tier</th>
                        <th>Shipments</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        customers.forEach(c => {
            html += `
                <tr>
                    <td><strong>${c.name || '—'}</strong></td>
                    <td>${c.email || '—'}</td>
                    <td>${c.business_name || '—'}</td>
                    <td>${c.tier || 'standard'}</td>
                    <td>${c.shipment_count || 0}</td>
                    <td><button class="btn-primary btn-small" onclick="alert('Manage customer ${c.id}')">Manage</button></td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        document.getElementById('customersTableContainer').innerHTML = html;
    } catch (error) {
        console.error('Error loading customers:', error);
        document.getElementById('customersTableContainer').innerHTML =
            `<div class="error">Failed to load customers</div>`;
    }
}

// Load Pricing
async function loadPricing() {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_URL}/pricing/rules`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to load pricing');

        const data = await response.json();
        const rules = data.rules || [];

        if (rules.length === 0) {
            document.getElementById('pricingTableContainer').innerHTML = '<div style="padding: 2rem; text-align: center; color: #999;">No pricing rules found</div>';
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Service Type</th>
                        <th>Base Price</th>
                        <th>Per KG</th>
                        <th>Min Weight</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        rules.forEach(r => {
            html += `
                <tr>
                    <td><strong>${r.service_type || '—'}</strong></td>
                    <td>$${(r.base_price || 0).toFixed(2)}</td>
                    <td>$${(r.price_per_kg || 0).toFixed(2)}</td>
                    <td>${r.min_weight || '—'} kg</td>
                    <td><span class="status-badge status-completed">Active</span></td>
                    <td><button class="btn-primary btn-small" onclick="openPricingModal('edit', ${r.id})">Edit</button></td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        document.getElementById('pricingTableContainer').innerHTML = html;
    } catch (error) {
        console.error('Error loading pricing:', error);
        document.getElementById('pricingTableContainer').innerHTML =
            `<div class="error">Failed to load pricing rules</div>`;
    }
}

// Load Reports
async function loadReports() {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_URL}/admin/reports/revenue`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to load reports');

        const data = await response.json();

        document.getElementById('reportRevenue').textContent = `$${(data.total_revenue || 0).toLocaleString()}`;
        document.getElementById('reportCompleted').textContent = data.completed_shipments || '0';
        document.getElementById('reportAvgTime').textContent = `${data.avg_delivery_time || '—'} days`;

        // Simple revenue by service table
        const services = data.by_service || [];
        let html = '<table><thead><tr><th>Service</th><th>Revenue</th><th>Count</th></tr></thead><tbody>';

        services.forEach(s => {
            html += `<tr><td>${s.service_type}</td><td>$${(s.revenue || 0).toLocaleString()}</td><td>${s.count || 0}</td></tr>`;
        });

        html += '</tbody></table>';
        document.getElementById('reportsContainer').innerHTML = html;
    } catch (error) {
        console.error('Error loading reports:', error);
        document.getElementById('reportsContainer').innerHTML =
            `<div class="error">Failed to load reports</div>`;
    }
}

// Load Users
async function loadUsers() {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to load users');

        const data = await response.json();
        const users = data.users || [];

        if (users.length === 0) {
            document.getElementById('usersTableContainer').innerHTML = '<div style="padding: 2rem; text-align: center; color: #999;">No users found</div>';
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        users.forEach(u => {
            const created = new Date(u.created_at).toLocaleDateString();
            html += `
                <tr>
                    <td><strong>${u.first_name} ${u.last_name}</strong></td>
                    <td>${u.email}</td>
                    <td>${u.role}</td>
                    <td>${created}</td>
                    <td><button class="btn-primary btn-small" onclick="openUserModal('edit', ${u.id})">Edit</button></td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        document.getElementById('usersTableContainer').innerHTML = html;
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersTableContainer').innerHTML =
            `<div class="error">Failed to load users</div>`;
    }
}

// Modal functions
function openOrderModal(action, orderId) {
    alert(`Order modal: ${action} (ID: ${orderId || 'new'})`);
}

function openPricingModal(action, ruleId) {
    alert(`Pricing modal: ${action} (ID: ${ruleId || 'new'})`);
}

function openUserModal(action, userId) {
    alert(`User modal: ${action} (ID: ${userId || 'new'})`);
}

// Logout
function logoutAdmin() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}
