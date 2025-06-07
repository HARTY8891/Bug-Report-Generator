function initFormHandlers() {
    document.getElementById('clearFormBtn').addEventListener('click', clearForm);
    
    function clearForm() {
        if (confirm('Are you sure you want to clear all fields?')) {
            document.getElementById('bugSummary').value = '';
            document.getElementById('bugSeverity').value = '';
            document.getElementById('bugDescription').value = '';
            document.getElementById('bugEnvironment').value = '';
            document.getElementById('nextSteps').value = '';
            document.getElementById('reportedBy').value = '';
            document.getElementById('reportedTo').value = '';
            document.getElementById('urgentFlag').checked = false;
            document.getElementById('confidentialFlag').checked = false;
            
            // Clear images
            const clearImagesBtn = document.getElementById('clearImagesBtn');
            if (!clearImagesBtn.classList.contains('hidden')) {
                clearImagesBtn.click();
            }
            
            // Update date
            document.dispatchEvent(new Event('dateFormatChanged'));
            
            // Clear preview
            document.getElementById('reportPreviewContent').innerHTML = '<p class="text-gray-500 italic">Fill out the form to see the preview</p>';
        }
    }
    
    function validateForm() {
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
    }
    
    // Export the validateForm function for use in other modules
    window.validateForm = validateForm;
}
