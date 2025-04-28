document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }

    // Load user information
    document.getElementById('userName').textContent = localStorage.getItem('userName') || 'User';
    document.getElementById('userEmail').textContent = localStorage.getItem('userEmail') || 'user@example.com';
    
    // Fetch and display orders
    fetchOrders();
});

// Fetch orders from the server
async function fetchOrders() {
    try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/orders?userId=${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        const orders = await response.json();
        const ordersContainer = document.getElementById('ordersContainer');
        ordersContainer.innerHTML = '';

        // Update order count
        document.getElementById('orderCount').textContent = orders.length;

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<div class="no-orders">No orders found. <a href="order.html">Create your first order</a></div>';
            return;
        }

        // Create order cards
        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            orderCard.setAttribute('data-order-id', order._id);
            orderCard.innerHTML = `
                <div class="order-content">
                    <h3 class="order-title">${order.documentName}</h3>
                    <p class="order-info">Status: <span>${capitalizeFirstLetter(order.status)}</span></p>
                    <p class="order-info">Type: <span>${order.printType}</span></p>
                    <p class="order-info">Size: <span>${order.paperSize}</span></p>
                    <p class="order-info">Copies: <span>${order.copies}</span></p>
                    <p class="order-info">Date: <span>${new Date(order.createdAt).toLocaleDateString()}</span></p>
                </div>
            `;
            ordersContainer.appendChild(orderCard);
        });
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('ordersContainer').innerHTML = 
            '<div class="error-message">Failed to load orders. Please try again later.</div>';
    }
}

// Helper Functions
function capitalizeFirstLetter(string) {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}

// Logout function
function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// Refresh orders every 5 minutes
setInterval(fetchOrders, 5 * 60 * 1000);