// User authentication and session management
let currentUser = null;

// Form validation and submission handlers
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store user session and data
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userName', data.user.fullName);
        localStorage.setItem('userInstitution', data.user.institution);
        localStorage.setItem('userClass', data.user.className);
        localStorage.setItem('userId', data.user.id);

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

// Handle signup form submission
async function handleSignup(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const institution = document.getElementById('institution').value;
    const className = document.getElementById('class').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (!fullName || !institution || !className || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName,
                institution,
                className,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }

        // Store user data in session
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', email);
        sessionStorage.setItem('userName', fullName);
        sessionStorage.setItem('userInstitution', institution);
        sessionStorage.setItem('userClass', className);

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
}

// User data storage in localStorage
function saveUserData(userData) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userName', userData.fullName);
    localStorage.setItem('userInstitution', userData.institution);
    localStorage.setItem('userClass', userData.className);
    localStorage.setItem('userId', userData.id);
}

// Clear user data from localStorage
function clearUserData() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userInstitution');
    localStorage.removeItem('userClass');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
}

// Check authentication status
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const currentPath = window.location.pathname;

    // Protected routes - add all pages that require authentication
    const protectedRoutes = ['dashboard.html', 'order.html', 'profile.html', 'settings.html'];
    // Check if current path exactly matches any protected route
    const isProtectedRoute = protectedRoutes.some(route => currentPath.toLowerCase().endsWith(route.toLowerCase()));

    if (isProtectedRoute && !isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// Logout function
function logout() {
    // Clear all user session data
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userInstitution');
    sessionStorage.removeItem('userClass');
    // Redirect to login page
    window.location.href = 'login.html';
}

// Check authentication status when page loads
document.addEventListener('DOMContentLoaded', checkAuth);