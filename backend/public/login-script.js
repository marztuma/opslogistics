const API_URL = '/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value;
    const loginBtn = document.getElementById('loginBtn');
    const loadingState = document.getElementById('loadingState');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Hide previous messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    // Show loading
    loginBtn.style.display = 'none';
    loadingState.style.display = 'block';

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store token
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Show success
            loadingState.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.textContent = `✓ Welcome back, ${data.user.first_name || email}! Redirecting to dashboard...`;

            // Redirect to customer portal after 1 second
            setTimeout(() => {
                window.location.href = 'customer-portal.html';
            }, 1000);
        }
    } catch (error) {
        loadingState.style.display = 'none';
        loginBtn.style.display = 'block';
        errorMessage.style.display = 'block';
        errorMessage.textContent = `❌ ${error.message}. Please check your email and password, or call +1 858-428-7703.`;
        console.error('Login error:', error);
    }
});

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        // Redirect to portal if already logged in
        window.location.href = 'customer-portal.html';
    }
});
