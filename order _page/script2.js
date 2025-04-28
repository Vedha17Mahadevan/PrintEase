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
        'hard': 70
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

 // Confidential Printing - Show/Hide Fields
 const confidentialCheckbox = document.getElementById('confidential-printing');
 const confidentialOptions = document.getElementById('confidential-options');
 const securityQuestion = document.getElementById('security-question');
 const customQuestionGroup = document.getElementById('custom-question-group');
 const customQuestionInput = document.getElementById('custom-question');

 // Toggle security fields when confidential printing is checked
 confidentialCheckbox.addEventListener('change', function () {
     confidentialOptions.style.display = this.checked ? 'block' : 'none';
 });

 // Show custom question input if "Custom Question" is selected
 securityQuestion.addEventListener('change', function () {
     if (this.value === 'custom') {
         customQuestionGroup.style.display = 'block';
     } else {
         customQuestionGroup.style.display = 'none';
         customQuestionInput.value = ''; // Clear custom question field if not needed
     }
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

document.addEventListener("DOMContentLoaded", function () {
    const viewBtn = document.getElementById("view-secure-details");
    const secureDetails = document.getElementById("secure-details");
    const viewSummaryBtn = document.getElementById("view-secure-summary");
    const secureSummary = document.getElementById("secure-summary");

    if (viewBtn && secureDetails) {
        viewBtn.addEventListener("click", function () {
            secureDetails.classList.toggle("hidden");
            viewBtn.textContent = secureDetails.classList.contains("hidden")
                ? "View Security Details"
                : "Hide Security Details";
        });
    }

    if (viewSummaryBtn && secureSummary) {
        viewSummaryBtn.addEventListener("click", function () {
            secureSummary.classList.toggle("hidden");
            viewSummaryBtn.textContent = secureSummary.classList.contains("hidden")
                ? "View Security Details"
                : "Hide Security Details";
        });
    }

    function updateSecuritySummary() {
        const securityKey = document.getElementById("security-key").value;

        document.getElementById("summary-security-key").textContent = securityKey || "N/A";
    }

    document.getElementById("order-form").addEventListener("change", updateSecuritySummary);
});


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
    const sizeFormat = document.getElementById('size-format');
    if (document.getElementById('summary-size').textContent.indexOf('Custom') === -1) {
        sizeFormat.value = 'A4';
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


function closeCustomSize() {
    document.getElementById('custom-size-dialog').style.display = 'none';
    // Reset to default size format if custom size dialog is closed without saving
    if (document.getElementById('summary-size').textContent.indexOf('Custom') === -1) {
        document.getElementById('size-format').value = 'A4';
    }
}

function saveCustomSize() {
    const width = document.getElementById('custom-width').value;
    const height = document.getElementById('custom-height').value;

    if (width > 0 && height > 0) {
        document.getElementById('summary-size').textContent = `Custom: ${width} × ${height} cm`;
        document.getElementById('custom-size-dialog').style.display = 'none';
        updateSummary();
    } else {
        showToast('Please enter valid dimensions', 'error');
    }
}

// Form Submission
async function confirmOrder() {
    if (files.length === 0) {
        showToast('Please upload at least one file', 'error');
        return;
    }
    
    const orderData = {
        userId: localStorage.getItem('userId'),
        documentName: document.getElementById('summary-filename').textContent,
        copies: parseInt(document.getElementById('summary-copies').textContent),
        paperSize: document.getElementById('summary-size').textContent,
        printType: document.getElementById('summary-print-type').textContent,
        bindingType: document.getElementById('summary-binding').textContent,
        additionalNotes: document.getElementById('summary-notes').textContent || '',
        status: 'pending'
    };

    try {
        const token = localStorage.getItem('token');
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

        // Show success modal with animation
        const modal = document.getElementById('confirmation-modal');
        const modalContent = modal.querySelector('.modal-content');
        modal.style.display = 'block';
        modal.style.opacity = '0';
        modalContent.style.transform = 'translateY(-20px)';
        
        // Fade in animation
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'translateY(0)';
            modalContent.style.transition = 'transform 0.3s ease-out';
        }, 10);

        // Automatically close modal and redirect after 3 seconds
        setTimeout(() => {
            modal.style.opacity = '0';
            modalContent.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                modal.style.display = 'none';
                window.location.href = 'dashboard.html';
            }, 300);
        }, 3000);

    } catch (error) {
        showToast('Failed to submit order: ' + error.message, 'error');
    }
}

function closeConfirmation() {
    document.getElementById('confirmation-modal').style.display = 'none';
    resetForm();
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
}

// Toast Notifications
function showToast(message, type = 'info') {
    alert(message);
}