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
        
        // Create a temporary element with the report content
        const element = document.createElement('div');
        element.innerHTML = generateReportHTML();
        
        // Ensure proper formatting for PDF
        const descriptions = element.querySelectorAll('p');
        descriptions.forEach(p => {
            p.style.marginBottom = '8px';
            p.style.whiteSpace = 'pre-wrap';
        });
        
        const opt = {
            margin: 10,
            filename: `${document.getElementById('reportNumber').value}_bug_report.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                logging: true,
                useCORS: true,
                allowTaint: true
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        if (format === 'pdf') {
            document.getElementById('previewModal').classList.add('hidden');
            
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
        }
    }
    
    function generateReportHTML() {
        // Get the preview content
        let html = document.getElementById('reportPreviewContent').innerHTML;
        
        // Add images if they exist in the preview container
        const images = document.getElementById('previewContainer').querySelectorAll('img');
        if (images.length > 0) {
            // Find where to insert images in the HTML
            const screenshotSection = '<h2 class="text-xl font-semibold text-gray-800 border-b pb-1">Screenshots</h2>';
            const screenshotDiv = '<div class="grid grid-cols-1 gap-3">';
            
            // Insert images at the appropriate location
            let imageHTML = screenshotSection + screenshotDiv;
            images.forEach(img => {
                imageHTML += `<div class="border rounded-md p-2"><img src="${img.src}" class="w-full max-h-60 object-contain mx-auto"></div>`;
            });
            imageHTML += '</div>';
            
            // Insert the images section before the reporter information
            const reporterInfoIndex = html.indexOf('<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">');
            if (reporterInfoIndex !== -1) {
                html = html.slice(0, reporterInfoIndex) + imageHTML + html.slice(reporterInfoIndex);
            }
        }
        
        return html;
    }
}
