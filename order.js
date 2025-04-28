document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Create modal element for success message
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div id="successModal" class="modal" style="display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); opacity: 0; transition: opacity 0.3s ease;">
            <div style="background-color: #fefefe; margin: 15% auto; padding: 30px; border: none; width: 90%; max-width: 400px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transform: translateY(-20px); transition: transform 0.3s ease;">
                <div style="color: #4CAF50; font-size: 48px; margin-bottom: 20px;">
                    <i class="fas fa-check-circle" style="animation: pulse 2s infinite;"></i>
                </div>
                <h2 style="color: #333; margin-bottom: 15px; font-size: 24px;">Order Submitted Successfully!</h2>
                <p style="color: #666; margin-bottom: 25px;">Your order has been received and is being processed.</p>
                <button onclick="window.location.href='dashboard.html'" style="background-color: #4CAF50; color: white; padding: 12px 30px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 500; transition: background-color 0.3s ease;">View Orders</button>
            </div>
        </div>
        <style>
            @keyframes pulse {
                0% { transform: scale(0.95); opacity: 0.8; }
                70% { transform: scale(1); opacity: 1; }
                100% { transform: scale(0.95); opacity: 0.8; }
            }
        </style>
    `;
    document.body.appendChild(modal);

    // Get user information
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userInstitution = localStorage.getItem('userInstitution');

    // Initialize order form if it exists
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmission);
    }

    // Handle file upload preview
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFilePreview);
    }

    // Handle order submission
    async function handleOrderSubmission(e) {
        e.preventDefault();
    
        const formData = new FormData(orderForm);
        
        // Calculate cost manually (based on your frontend logic)
        const printType = formData.get('printType');
        const bindingType = formData.get('bindingType');
        const copies = parseInt(formData.get('copies')) || 1;
        const doubleSided = formData.get('doubleSide') === 'on'; // if using checkbox
        let pages = parseInt(formData.get('pages')) || 1;
    
        const pricing = {
            print: {
                'black-white': 1,
                'color': 5,
                'glossy': 7,
                'matte': 6
            },
            binding: {
                'spiral': 20,
                'soft': 40,
                'hard': 70,
                'stapled': 80,
                'no-bind': 0
            }
        };
    
        if (doubleSided) {
            pages = Math.ceil(pages / 2);
        }
    
        const pricePerPage = pricing.print[printType] || 0;
        const bindingCost = pricing.binding[bindingType] || 0;
        const totalCost = (pricePerPage * pages * copies) + bindingCost;
    
        const orderData = {
            userId: localStorage.getItem('userId'),
            documentName: formData.get('documentName'),
            copies: copies,
            paperSize: formData.get('paperSize'),
            printType: printType,
            bindingType: bindingType,
            additionalNotes: formData.get('additionalNotes'),
            cost: parseFloat(totalCost.toFixed(2)), // 🆕 Add calculated cost here
            status: 'pending'
        };
    
        try {
            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Order submission failed');
            }

            // Show success modal instead of alert
            const modal = document.getElementById('successModal');
            modal.style.display = 'block';
            setTimeout(() => modal.style.opacity = '1', 10);
            const modalContent = modal.querySelector('div > div');
            modalContent.style.transform = 'translateY(0)';

            // Automatically close modal and redirect after 3 seconds
            setTimeout(() => {
                modal.style.opacity = '0';
                modalContent.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    modal.style.display = 'none';
                    window.location.href = 'dashboard.html';
                }, 300);
            }, 2700);
        } catch (error) {
            alert('Failed to submit order: ' + error.message);
        }
    }

    // Handle file preview
    function handleFilePreview(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('filePreview');
                if (preview) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        }
    }
});