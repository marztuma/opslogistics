const API_URL = '/api';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstNameInput').value.trim();
    const lastName = document.getElementById('lastNameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const businessName = document.getElementById('businessNameInput').value.trim();
    const password = document.getElementById('passwordInput').value;
    const confirmPassword = document.getElementById('confirmPasswordInput').value;

    const registerBtn = document.getElementById('registerBtn');
    const loadingState = document.getElementById('loadingState');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Hide previous messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    // Validate passwords match
    if (password !== confirmPassword) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = '❌ Passwords do not match. Please try again.';
        return;
    }

    // Validate password length
    if (password.length < 8) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = '❌ Password must be at least 8 characters long.';
        return;
    }

    // Show loading
    registerBtn.style.display = 'none';
    loadingState.style.display = 'block';

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                business_name: businessName
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        // Store token
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Show success
            loadingState.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.textContent = `✓ Welcome, ${firstName}! Your account has been created. Redirecting to dashboard...`;

            // Redirect to customer portal after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'customer-portal.html';
            }, 1500);
        }
    } catch (error) {
        loadingState.style.display = 'none';
        registerBtn.style.display = 'block';
        errorMessage.style.display = 'block';
        errorMessage.textContent = `❌ ${error.message}. Please try again or call +1 858-428-7703.`;
        console.error('Registration error:', error);
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
