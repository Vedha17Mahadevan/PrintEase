// Variables to track current panel and uploaded files
let currentPanel = 0;
const panels = ['upload-panel', 'options-panel', 'verification-panel'];
const files = [];
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

// Initialize when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFileUpload();
    initializeFormValidation();
    updateProgressSteps();
    initializeNumberInputs();
    createParticlesBackground();
    
    // Initialize option change listeners
    document.querySelectorAll('select, input').forEach(element => {
        element.addEventListener('change', updateSummary);
    });

    // Handle form submission
    document.getElementById('order-form').addEventListener('submit', function(e) {
        e.preventDefault();
        confirmOrder();
    });
});

// Initialize Number Inputs
function initializeNumberInputs() {
    const numberInputs = document.querySelectorAll('.number-input');
    
    numberInputs.forEach(container => {
        const input = container.querySelector('input');
        const decreaseBtn = container.querySelector('.decrease-btn');
        const increaseBtn = container.querySelector('.increase-btn');
        
        // Ensure buttons exist
        if (decreaseBtn && increaseBtn && input) {
            decreaseBtn.addEventListener('click', function() {
                const currentValue = parseInt(input.value) || 0;
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
            
            increaseBtn.addEventListener('click', function() {
                const currentValue = parseInt(input.value) || 0;
                input.value = currentValue + 1;
                input.dispatchEvent(new Event('change'));
            });
            
            // Handle manual input validation
            input.addEventListener('input', function() {
                if (this.value === '' || parseInt(this.value) < 1) {
                    this.value = 1;
                }
            });
        }
    });
}

// Create particles background
function createParticlesBackground() {
    // Create container for particles
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    document.body.appendChild(particlesContainer);
    
    // Create 15 particles
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 10px and 50px
        const size = Math.floor(Math.random() * 40) + 10;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 15}s`;
        
        // Random animation duration between 15 and 30 seconds
        particle.style.animationDuration = `${Math.random() * 15 + 15}s`;
        
        // Add to container
        particlesContainer.appendChild(particle);
    }
}

// File Upload Functionality
function initializeFileUpload() {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);

    // Handle file selection via file input
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    // Prevent default drag behavior
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop area
    function highlight() {
        dropArea.classList.add('dragover');
    }

    // Remove highlight
    function unhighlight() {
        dropArea.classList.remove('dragover');
    }

    // Handle dropped files
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const droppedFiles = dt.files;
        handleFiles(droppedFiles);
    }

    // Process the files
    function handleFiles(fileList) {
        if (fileList.length) {
            Array.from(fileList).forEach(file => {
                if (!isFileDuplicate(file)) {
                    addFile(file);
                } else {
                    showToast(`${file.name} is already added.`, 'warning');
                }
            });
            updateFileList();
            updateSummary();
        }
    }

    // Check if file is already in the list
    function isFileDuplicate(file) {
        return files.some(existingFile => 
            existingFile.name === file.name && 
            existingFile.size === file.size
        );
    }

    // Add file to our array
    function addFile(file) {
        files.push(file);
    }

    // Remove file from our array
    window.removeFile = function(index) {
        files.splice(index, 1);
        updateFileList();
        updateSummary();
    };

    // Update the file list display
    function updateFileList() {
        if (files.length === 0) {
            fileList.innerHTML = '<div class="no-files">No files selected</div>';
            return;
        }

        fileList.innerHTML = '';
        files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file"></i>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${(file.size / 1024).toFixed(2)} KB</span>
                </div>
                <i class="fas fa-times file-remove" onclick="removeFile(${index})"></i>
            `;
            fileList.appendChild(fileItem);
        });
    }
}

// Form Validation and Navigation
function initializeFormValidation() {
    setInterval(() => {
        const nextBtns = document.querySelectorAll('.next-btn');

        // Enable only if files are uploaded in the first panel
        if (currentPanel === 0) {
            nextBtns[0].disabled = files.length === 0;
        }
    }, 100);
}

// Validate options panel before proceeding
function validateAndNext() {
    const form = document.getElementById('order-form');
    const requiredFields = form.querySelectorAll('#options-panel select[required]');
    
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value) {
            isValid = false;
            field.classList.add('invalid');
            showToast(`Please select a ${field.name.replace('-', ' ')}`, 'error');
        } else {
            field.classList.remove('invalid');
        }
    });
    
    if (isValid) {
        nextPanel();
    }
}

// Panel Navigation Functions
function nextPanel() {
    if (currentPanel < panels.length - 1) {
        document.getElementById(panels[currentPanel]).classList.remove('active');
        currentPanel++;
        document.getElementById(panels[currentPanel]).classList.add('active');
        updateProgressSteps();
        updateSummary();
    }
}

function prevPanel() {
    if (currentPanel > 0) {
        document.getElementById(panels[currentPanel]).classList.remove('active');
        currentPanel--;
        document.getElementById(panels[currentPanel]).classList.add('active');
        updateProgressSteps();
    }
}

// Update progress steps
function updateProgressSteps() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.classList.toggle('active', index === currentPanel);
        step.classList.toggle('completed', index < currentPanel);
    });
}

// Custom Size Dialog Functions
function checkCustomSize() {
    const sizeFormat = document.getElementById('size-format');
    const customDialog = document.getElementById('custom-size-dialog');

    if (sizeFormat.value === 'custom') {
        customDialog.classList.add('active');  // show modal
    } else {
        customDialog.classList.remove('active');  // hide modal if not custom
    }
}

function closeCustomSize() {
    document.getElementById('custom-size-dialog').classList.remove('active');
    if (document.getElementById('summary-size').textContent.indexOf('Custom') === -1) {
        document.getElementById('size-format').value = 'A4';
    }
}


function saveCustomSize() {
    const width = document.getElementById('custom-width').value;
    const height = document.getElementById('custom-height').value;

    if (width > 0 && height > 0) {
        document.getElementById('summary-size').textContent = `Custom: ${width} × ${height} cm`;
        document.getElementById('custom-size-dialog').classList.remove('active');
        updateSummary();
    } else {
        showToast('Please enter valid dimensions', 'error');
    }
}

//calculate order total
function calculateOrderTotal() {
    const printType = document.getElementById('print-option').value;
    const bindingType = document.getElementById('binding-option').value;
    const copies = parseInt(document.getElementById('copies').value) || 1;
    let pages = parseInt(document.getElementById('pages').value) || 1;
    const doubleSided = document.getElementById('double-side').checked;

    // If double-sided, divide pages by 2 and round up
    if (doubleSided) {
        pages = Math.ceil(pages / 2);
    }

    // Get pricing from our pricing object
    const pricePerPage = pricing.print[printType] || 0;
    const bindingCost = pricing.binding[bindingType] || 0;

    // Calculate total cost: (price per page * pages * copies) + binding cost
    const total = (pricePerPage * pages * copies) + bindingCost;
    
    return total.toFixed(2); // Format to 2 decimal places
}


// Form Submission
function confirmOrder() {
    if (files.length === 0) {
        showToast('Please upload at least one file', 'error');
        return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const orderData = {
        userId: localStorage.getItem('userId'),
        documentName: files[0].name,
        copies: document.getElementById('copies').value || 1,
        paperSize: document.getElementById('size-format').value,
        printType: document.getElementById('print-option').value,
        bindingType: document.getElementById('binding-option').value,
        additionalNotes: document.getElementById('other-details').value,
        cost: parseFloat(calculateOrderTotal()),
        status: 'pending'
    };

    fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        document.getElementById('confirmation-modal').style.display = 'block';
        setTimeout(() => {
            closeConfirmation();
            window.location.href = 'payment.html?amount=' + orderData.cost;
        }, 300);
    })
    .catch(error => {
        showToast('Failed to submit order: ' + error.message, 'error');
    });
}

function closeConfirmation() {
    document.getElementById('confirmation-modal').style.display = 'none';
    resetForm();
}

function proceedToPayment() {
    const totalAmount = calculateOrderTotal(); // Reuse your existing total calculation
    window.location.href = `payment.html?amount=${totalAmount}`;
}


// Reset form
function resetForm() {
    files.length = 0;
    updateFileList();
    
    // Reset all form fields
    document.getElementById('order-form').reset();
    
    // Reset current panel
    currentPanel = 0;
    panels.forEach(panel => {
        document.getElementById(panel).classList.remove('active');
    });
    document.getElementById(panels[currentPanel]).classList.add('active');
    updateProgressSteps();
}

// Update summary
function updateSummary() {
    // This function will be called whenever options change
    // Update summary content based on selected options
    const printOption = document.getElementById('print-option');
    const bindingOption = document.getElementById('binding-option');
    const otherOption = document.getElementById('other-option');
    const sizeFormat = document.getElementById('size-format');
    const copies = document.getElementById('copies');
    const pages = document.getElementById('pages');
    const doubleSide = document.getElementById('double-side');
    const confidential = document.getElementById('Confidential');
    const otherDetails = document.getElementById('other-details');
    
    // Update summary elements
    if (document.getElementById('summary-files')) {
        document.getElementById('summary-files').textContent = `${files.length} file(s)`;
    }
    
    if (document.getElementById('summary-print')) {
        document.getElementById('summary-print').textContent = printOption.selectedIndex > 0 ? 
            printOption.options[printOption.selectedIndex].text : 'Not selected';
    }
    
    if (document.getElementById('summary-binding')) {
        document.getElementById('summary-binding').textContent = bindingOption.selectedIndex > 0 ? 
            bindingOption.options[bindingOption.selectedIndex].text : 'Not selected';
    }
    
    if (document.getElementById('summary-document')) {
        document.getElementById('summary-document').textContent = otherOption.selectedIndex > 0 ? 
            otherOption.options[otherOption.selectedIndex].text : 'Not selected';
    }
    
    if (document.getElementById('summary-size') && sizeFormat.value !== 'custom') {
        document.getElementById('summary-size').textContent = sizeFormat.options[sizeFormat.selectedIndex].text;
    }
    
    if (document.getElementById('summary-copies')) {
        document.getElementById('summary-copies').textContent = copies.value;
    }
    
    if (document.getElementById('summary-pages')) {
        document.getElementById('summary-pages').textContent = pages.value;
    }
    
    if (document.getElementById('summary-double')) {
        document.getElementById('summary-double').textContent = doubleSide.checked ? 'Yes' : 'No';
    }
    if (document.getElementById('summary-confidential')) {
        document.getElementById('summary-confidential').textContent = confidential.checked ? 'Yes' : 'No';
    }
    
    if (document.getElementById('summary-instructions')) {
        document.getElementById('summary-instructions').textContent = otherDetails.value || 'None';
    }
     // Calculate and update the estimated cost if we're on the verification panel
     if (currentPanel === 2) {
        const totalCost = calculateOrderTotal();
        
        // Check if cost element exists, if not create it
        let costElement = document.getElementById('summary-cost');
        if (!costElement) {
            const summaryContent = document.querySelector('.summary-content');
            const costItem = document.createElement('div');
            costItem.className = 'summary-item';
            costItem.innerHTML = `
                <span class="item-label">Estimated Cost:</span>
                <span class="item-value" id="summary-cost">₹ ${totalCost}</span>
            `;
            summaryContent.appendChild(costItem);
        } else {
            costElement.textContent = `₹ ${totalCost}`;
        }
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    alert(message);
}