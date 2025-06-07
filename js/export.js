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
        
        // Apply PDF-specific styles
        const sections = element.querySelectorAll('div > div');
        sections.forEach(section => {
            section.style.marginBottom = '15px';
            section.style.pageBreakInside = 'avoid';
        });
        
        // Format images for PDF
        const images = element.querySelectorAll('img');
        images.forEach(img => {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            img.style.margin = '10px auto';
            img.style.border = '1px solid #ddd';
            img.style.borderRadius = '4px';
            img.style.padding = '5px';
        });
        
        const opt = {
            margin: [15, 15, 15, 15],
            filename: `${document.getElementById('reportNumber').value}_bug_report.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                logging: true,
                useCORS: true,
                allowTaint: true,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                hotfixes: ["px_scaling"]
            },
            pagebreak: { 
                mode: ['avoid-all', 'css', 'legacy'] 
            }
        };
        
        if (format === 'pdf') {
            document.getElementById('previewModal').classList.add('hidden');
            
            // Add a professional title
            const title = document.createElement('h1');
            title.textContent = 'Bug Report';
            title.style.textAlign = 'center';
            title.style.fontSize = '20pt';
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '20px';
            title.style.color = '#2c3e50';
            element.insertBefore(title, element.firstChild);
            
            // Add header with logo and metadata
            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.marginBottom = '20px';
            header.style.paddingBottom = '10px';
            header.style.borderBottom = '1px solid #eee';
            
            const metaData = document.createElement('div');
            metaData.innerHTML = `
                <p style="margin: 2px 0; font-size: 10pt;"><strong>Date:</strong> ${document.getElementById('reportDate').value}</p>
                <p style="margin: 2px 0; font-size: 10pt;"><strong>Report #:</strong> ${document.getElementById('reportNumber').value}</p>
                <p style="margin: 2px 0; font-size: 10pt;"><strong>Status:</strong> Open</p>
            `;
            
            header.appendChild(metaData);
            element.insertBefore(header, element.firstChild.nextSibling);
            
            // Adjust container styles for PDF
            element.style.padding = '20px';
            element.style.fontFamily = 'Arial, sans-serif';
            element.style.color = '#333';
            element.style.lineHeight = '1.5';
            
            // Add footer
            const footer = document.createElement('div');
            footer.style.marginTop = '20px';
            footer.style.paddingTop = '10px';
            footer.style.borderTop = '1px solid #eee';
            footer.style.fontSize = '8pt';
            footer.style.color = '#777';
            footer.style.textAlign = 'center';
            footer.innerHTML = `Confidential - ${new Date().getFullYear()} © Bug Reporting System`;
            element.appendChild(footer);
            
            html2pdf().set(opt).from(element).save();
        } else {
            alert('Word export would be implemented here. For this demo, we only provide PDF export.');
        }
    }
    
    function generateReportHTML() {
        const date = document.getElementById('reportDate').value;
        const reportNumber = document.getElementById('reportNumber').value;
        const summary = document.getElementById('bugSummary').value;
        const severity = document.getElementById('bugSeverity').value;
        const description = document.getElementById('bugDescription').value;
        const environment = document.getElementById('bugEnvironment').value;
        const nextSteps = document.getElementById('nextSteps').value;
        const reportedBy = document.getElementById('reportedBy').value;
        const reportedTo = document.getElementById('reportedTo').value;
        const urgent = document.getElementById('urgentFlag').checked;
        const confidential = document.getElementById('confidentialFlag').checked;
        
        let html = `
            <div style="margin-bottom: 20px;">
                <h2 style="font-size: 14pt; font-weight: bold; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px;">Issue Summary</h2>
                <p style="margin: 5px 0;"><strong>Summary:</strong> ${summary}</p>
                <p style="margin: 5px 0;"><strong>Severity:</strong> ${severity} ${urgent ? '<span style="background-color: #ffebee; color: #c62828; padding: 2px 5px; border-radius: 3px; font-size: 9pt; margin-left: 5px;">URGENT</span>' : ''}</p>
                ${confidential ? '<p style="color: #c62828; font-weight: bold; margin: 5px 0;"><span style="margin-right: 5px;">🔒</span>CONFIDENTIAL</p>' : ''}
            </div>
            
            <div style="margin-bottom: 20px; page-break-inside: avoid;">
                <h2 style="font-size: 14pt; font-weight: bold; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px;">Detailed Description</h2>
                <p style="white-space: pre-wrap; margin: 5px 0;">${description.replace(/\n/g, '<br>')}</p>
            </div>
        `;
        
        if (environment) {
            html += `
                <div style="margin-bottom: 20px; page-break-inside: avoid;">
                    <h2 style="font-size: 14pt; font-weight: bold; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px;">Environment</h2>
                    <p style="white-space: pre-wrap; margin: 5px 0;">${environment.replace(/\n/g, '<br>')}</p>
                </div>
            `;
        }
        
        if (nextSteps) {
            html += `
                <div style="margin-bottom: 20px; page-break-inside: avoid;">
                    <h2 style="font-size: 14pt; font-weight: bold; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px;">Recommended Next Steps</h2>
                    <p style="white-space: pre-wrap; margin: 5px 0;">${nextSteps.replace(/\n/g, '<br>')}</p>
                </div>
            `;
        }
        
        // Add screenshots if any
        const images = document.getElementById('previewContainer').querySelectorAll('img');
        if (images.length > 0) {
            html += `
                <div style="margin-bottom: 20px; page-break-inside: avoid;">
                    <h2 style="font-size: 14pt; font-weight: bold; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px;">Screenshots</h2>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
            `;
            
            images.forEach(img => {
                html += `
                    <div style="border: 1px solid #ddd; border-radius: 4px; padding: 5px; page-break-inside: avoid;">
                        <img src="${img.src}" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">
                    </div>
                `;
            });
            
            html += `</div></div>`;
        }
        
        html += `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                <div>
                    <h3 style="font-size: 12pt; font-weight: bold; color: #2c3e50; margin-bottom: 5px;">Reported By</h3>
                    <p style="margin: 0;">${reportedBy}</p>
                </div>
                <div>
                    <h3 style="font-size: 12pt; font-weight: bold; color: #2c3e50; margin-bottom: 5px;">Assigned To</h3>
                    <p style="margin: 0;">${reportedTo || 'Not assigned'}</p>
                </div>
            </div>
        `;
        
        return html;
    }
}
