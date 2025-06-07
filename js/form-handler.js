// form-handler.js
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
}
