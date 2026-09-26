// Global auth helper for all pages
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const loginBtn = document.querySelector('.login-btn');

    if (!loginBtn) return;

    if (token) {
        // User is logged in - show user menu
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const firstName = user.first_name || 'User';

        loginBtn.innerHTML = `${firstName} <span>▼</span>`;
        loginBtn.style.color = '#0055CC';

        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
            min-width: 180px;
            display: none;
            margin-top: 0.5rem;
        `;

        dropdown.innerHTML = `
            <a href="customer-portal.html" style="display: block; padding: 1rem; color: #0055CC; text-decoration: none; border-bottom: 1px solid #e0e0e0; font-weight: 600;">Dashboard</a>
            <a href="#" onclick="logoutUser(); return false;" style="display: block; padding: 1rem; color: #666; text-decoration: none; font-weight: 600;">Logout</a>
        `;

        loginBtn.parentElement.style.position = 'relative';
        loginBtn.parentElement.appendChild(dropdown);

        loginBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        // Close dropdown when clicking elsewhere
        document.addEventListener('click', () => {
            dropdown.style.display = 'none';
        });
    } else {
        // User not logged in - redirect to login
        loginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
});

function logoutUser() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}
