document.addEventListener('DOMContentLoaded', function() {
    // Initialize date
    updateDate();
    document.getElementById('dateFormat').addEventListener('change', updateDate);
    
    // Initialize modules
    initFileUpload();
    initFormHandlers();
    initPreview();
    initDrafts();
    initExport();
    
    function updateDate() {
        const format = document.getElementById('dateFormat').value;
        const today = new Date();
        let formattedDate;
        
        if (format === 'DD/MM/YYYY') {
            formattedDate = today.getDate().toString().padStart(2, '0') + '/' + 
                            (today.getMonth() + 1).toString().padStart(2, '0') + '/' + 
                            today.getFullYear();
        } else if (format === 'MM/DD/YYYY') {
            formattedDate = (today.getMonth() + 1).toString().padStart(2, '0') + '/' + 
                            today.getDate().toString().padStart(2, '0') + '/' + 
                            today.getFullYear();
        } else {
            formattedDate = today.getFullYear() + '-' + 
                            (today.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                            today.getDate().toString().padStart(2, '0');
        }
        
        document.getElementById('reportDate').value = formattedDate;
        
        // Update report number with today's date
        const reportNumber = 'BR-' + today.getFullYear() + '-' + 
                            (today.getMonth() + 1).toString().padStart(2, '0') + 
                            today.getDate().toString().padStart(2, '0') + '-' + 
                            Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        document.getElementById('reportNumber').value = reportNumber;
    }
});

// Make validateForm globally available
window.validateForm = function() {
    const requiredFields = [
        { id: 'bugSummary', name: 'Summary' },
        { id: 'bugSeverity', name: 'Severity' },
        { id: 'bugDescription', name: 'Description' },
        { id: 'reportedBy', name: 'Reported By' }
    ];
    
    let isValid = true;
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            alert(`Please fill in the "${field.name}" field`);
            element.focus();
            isValid = false;
            return false;
        }
    });
    
    return isValid;
};
