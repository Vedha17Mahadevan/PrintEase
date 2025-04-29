rogressSteps();
    initializeNumberInputs();
    createParticlesBackground();
    
    // Initialize option change listeners
    document.querySelectorAll('select, input').forEach(element => {
        element.addEventListener('change', updateSummary);
    });
