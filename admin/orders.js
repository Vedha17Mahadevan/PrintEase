// orders.js

console.log('Orders.js script loaded');

document.addEventListener("DOMContentLoaded", function () {
    console.log('DOM content loaded');
    
    // Display a loading message
    const tableBody = document.querySelector('#ordersTable tbody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="empty-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading orders...</p>
            </td>
        </tr>
    `;
    // Function to fetch orders from the database
    async function fetchOrders() {
        console.log('Attempting to fetch orders...'); // Added log
        const tableBody = document.querySelector('#ordersTable tbody'); // Moved loading message here
        tableBody.innerHTML = ` 
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading orders...</p>
                </td>
            </tr>
        `;
        try {
            const apiUrl = 'http://localhost:3000/api/orders'; // Added variable for URL
            console.log(`Fetching orders from API: ${apiUrl}`); // Log the URL
            const response = await fetch(apiUrl);
            console.log('Fetch response received. Status:', response.status, 'Ok:', response.ok); // More detailed log
            if (!response.ok) {
                throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
            }
            const orders = await response.json();
            console.log('Orders fetched successfully:', orders);
            displayOrders(orders);
        } catch (error) {
            console.error('Detailed error fetching orders:', error); // More detailed error log
            const tableBody = document.querySelector('#ordersTable tbody');
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Error loading orders. Check console for details.</p>
                        <p style="font-size: 0.8em; color: #666;">${error.message}</p>
                    </td>
                </tr>
            `;
            // alert('Failed to load orders. Please check the console for more details.'); // Changed alert to console log
        }
    }

    // Initial fetch of orders when the page loads
    fetchOrders();

    // Function to display orders in the table
    function displayOrders(orders) {
        const tableBody = document.querySelector('#ordersTable tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        if (orders.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="6" class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No orders found</p>
                </td>
            `;
            tableBody.appendChild(emptyRow);
            return;
        }

        orders.forEach(order => {
            // Map database status to UI status
            let uiStatus = 'notavailable';
            switch(order.status) {
                case 'pending': uiStatus = 'notavailable'; break;
                case 'processing': uiStatus = 'printing'; break;
                case 'completed': uiStatus = 'printed'; break;
                case 'cancelled': uiStatus = 'notavailable'; break;
                default: uiStatus = 'notavailable';
            }

            const row = document.createElement('tr');
            row.setAttribute('data-order-id', order._id);
            row.innerHTML = `
                <td>${order._id}</td>
                <td>${order.userId && order.userId._id ? order.userId._id : (order.userId || 'N/A')}</td>
                <td>
                    <div class="order-details-grid">
                        <div class="detail-label"><i class="fas fa-print"></i> Print Type:</div>
                        <div class="detail-value">${order.printType || 'N/A'}</div>
                        <div class="detail-label"><i class="fas fa-book"></i> Binding:</div>
                        <div class="detail-value">${order.bindingType || 'None'}</div>
                        <div class="detail-label"><i class="fas fa-file-alt"></i> Doc Type:</div>
                        <div class="detail-value">${order.documentName || 'N/A'}</div>
                        <div class="detail-label"><i class="fas fa-expand"></i> Size:</div>
                        <div class="detail-value">${order.paperSize || 'N/A'}</div>
                        <div class="detail-label"><i class="fas fa-copy"></i> Copies:</div>
                        <div class="detail-value">${order.copies || '1'}</div>
                        <div class="detail-label"><i class="fas fa-lock"></i> Security Code:</div>
                        <div class="detail-value">${extractSecurityCode(order.additionalNotes)}</div>
                        <div class="detail-label"><i class="fas fa-info-circle"></i> Additional:</div>
                        <div class="detail-value">${order.additionalNotes || 'None'}</div>
                    </div>
                </td>
                <td><a href="#" class="file-link"><i class="fas fa-file-pdf"></i> View File</a></td>
                <td><span class="status-badge status-${uiStatus}">${capitalizeFirstLetter(order.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" title="Edit Order Status"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" title="Delete Order"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Attach event listeners to new buttons
        attachEventListeners();
    }

    // Helper function to extract security code from additional notes
    function extractSecurityCode(notes) {
        if (!notes) return 'N/A';
        const match = notes.match(/Security code\s*:\s*(\d+)/i);
        return match ? match[1] : 'N/A';
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Function to create and show status dropdown
    function showStatusDropdown(statusCell, orderId) {
        const currentStatus = statusCell.querySelector('.status-badge').textContent;
        const dropdown = document.createElement('select');
        dropdown.className = 'status-dropdown';
        
        // Map UI statuses to database statuses
        const statuses = [
            { ui: 'Available', db: 'pending' },
            { ui: 'Printing', db: 'processing' },
            { ui: 'Printed', db: 'completed' }
        ];
        
        statuses.forEach(status => {
            const option = document.createElement('option');
            option.value = status.db;
            option.textContent = status.ui;
            if (status.ui === currentStatus) {
                option.selected = true;
            }
            dropdown.appendChild(option);
        });

        statusCell.innerHTML = '';
        statusCell.appendChild(dropdown);

        // Focus and handle change
        dropdown.focus();
        dropdown.addEventListener('change', async function() {
            const newStatus = this.value;
            try {
                // Update status in database
                const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (!response.ok) {
                    throw new Error('Failed to update order status');
                }

                // Update UI
                let uiStatus = 'notavailable';
                let displayStatus = 'Pending';
                switch(newStatus) {
                    case 'pending': 
                        uiStatus = 'available'; 
                        displayStatus = 'Available';
                        break;
                    case 'processing': 
                        uiStatus = 'printing'; 
                        displayStatus = 'Printing';
                        break;
                    case 'completed': 
                        uiStatus = 'printed'; 
                        displayStatus = 'Printed';
                        break;
                    case 'cancelled': 
                        uiStatus = 'notavailable'; 
                        displayStatus = 'Not Available';
                        break;
                }

                const statusBadge = document.createElement('span');
                statusBadge.className = `status-badge status-${uiStatus}`;
                statusBadge.textContent = displayStatus;
                statusCell.innerHTML = '';
                statusCell.appendChild(statusBadge);
            } catch (error) {
                console.error('Error updating order status:', error);
                alert('Failed to update order status. Please try again.');
                // Revert to original status
                const statusBadge = document.createElement('span');
                statusBadge.className = `status-badge status-${currentStatus.toLowerCase()}`;
                statusBadge.textContent = currentStatus;
                statusCell.innerHTML = '';
                statusCell.appendChild(statusBadge);
            }
        });

        dropdown.addEventListener('blur', function() {
            // The change event will handle the update
        });
    }

    // Function to attach event listeners to buttons
    function attachEventListeners() {
        // Handle edit button clicks
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const orderId = row.getAttribute('data-order-id');
                const statusCell = row.querySelector('td:nth-child(5)');
                showStatusDropdown(statusCell, orderId);
            });
        });

        // Handle delete button clicks
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async function() {
                const row = this.closest('tr');
                const orderId = row.getAttribute('data-order-id');
                const statusCell = row.querySelector('td:nth-child(5)');
                const status = statusCell.textContent.trim();

                if (status.toLowerCase() === 'printed') {
                    if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
                        try {
                            const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
                                method: 'DELETE'
                            });

                            if (!response.ok) {
                                throw new Error('Failed to delete order');
                            }

                            row.remove();
                        } catch (error) {
                            console.error('Error deleting order:', error);
                            alert('Failed to delete order. Please try again.');
                        }
                    }
                } else {
                    alert('Only completed (Printed) orders can be deleted.');
                }
            });
        });
    }

    // Add event listener to refresh button
    document.querySelector('.refresh-btn').addEventListener('click', function() {
        fetchOrders();
    });

    // Initial fetch of orders
    fetchOrders();
});
