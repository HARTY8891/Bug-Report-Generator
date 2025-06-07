document.addEventListener('DOMContentLoaded', function() {
    // Initialize modules
    initFileUpload();
    initFormHandlers();
    initPreview();
    initDrafts();
    initExport();
    
    // Initialize date
    updateDate();
    document.getElementById('dateFormat').addEventListener('change', updateDate);
    
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
