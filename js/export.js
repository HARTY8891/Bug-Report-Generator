function initExport() {
    document.getElementById('exportBtn').addEventListener('click', toggleExportDropdown);
    document.getElementById('exportPdfBtn').addEventListener('click', () => {
        exportReport('pdf');
        hideExportDropdown();
    });
    
    document.getElementById('exportDocxBtn').addEventListener('click', () => {
        exportReport('docx');
        hideExportDropdown();
    });
    
    // Click outside to close export dropdown
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.relative') && !e.target.classList.contains('export-dropdown-item')) {
            hideExportDropdown();
        }
    });
    
    function toggleExportDropdown() {
        const dropdown = document.getElementById('exportDropdown');
        dropdown.classList.toggle('hidden');
    }
    
    function hideExportDropdown() {
        document.getElementById('exportDropdown').classList.add('hidden');
    }
    
    function exportReport(format) {
        if (!validateForm()) return;
        
        const reportHtml = generateReportHTML();
        const opt = {
            margin: 10,
            filename: `${document.getElementById('reportNumber').value}_bug_report.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        if (format === 'pdf') {
            document.getElementById('previewModal').classList.add('hidden');
            
            // Create a temporary element with the report content
            const element = document.createElement('div');
            element.innerHTML = reportHtml;
            
            // Add a title at the top
            const title = document.createElement('h1');
            title.textContent = 'Bug Report';
            title.style.textAlign = 'center';
            title.style.fontSize = '24px';
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '20px';
            element.insertBefore(title, element.firstChild);
            
            // Adjust styles for PDF
            element.style.padding = '20px';
            
            html2pdf().set(opt).from(element).save();
        } else {
            alert('Word export would be implemented here. For this demo, we only provide PDF export.');
            // In a real implementation, you might use docx.js or similar library
        }
    }
    
    // Helper function to reuse the preview HTML generation
    function generateReportHTML() {
        return document.getElementById('reportPreviewContent').innerHTML;
    }
}
