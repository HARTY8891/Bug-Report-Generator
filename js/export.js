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
    
    async function exportReport(format) {
        if (!validateForm()) return;
        
        try {
            // Create a temporary element with the report content
            const element = document.createElement('div');
            element.innerHTML = await generateReportHTML();
            
            // Process images for PDF export
            const images = element.querySelectorAll('img');
            
            // Compress and resize large images
            for (const img of images) {
                await new Promise(resolve => {
                    if (img.complete) {
                        resolve();
                    } else {
                        img.onload = resolve;
                        img.onerror = resolve;
                    }
                });
                
                // Compress large images
                if (img.naturalWidth > 1000 || img.naturalHeight > 1000) {
                    await compressImage(img, 0.7);
                }
                
                // Add styles for PDF
                img.style.maxWidth = '90%';
                img.style.maxHeight = 'none';
                img.style.height = 'auto';
                img.style.width = 'auto';
                img.style.display = 'block';
                img.style.margin = '15px auto';
                img.style.border = '1px solid #ddd';
                img.style.borderRadius = '4px';
                img.style.padding = '5px';
                img.style.objectFit = 'contain';
                img.style.pageBreakInside = 'avoid';
                img.style.pageBreakAfter = 'auto';
                img.style.pageBreakBefore = 'avoid';
            }
            
            const opt = {
                margin: [15, 15, 15, 15],
                filename: `${document.getElementById('reportNumber').value}_bug_report.pdf`,
                image: { 
                    type: 'jpeg', 
                    quality: 0.95,
                    cache: true
                },
                html2canvas: { 
                    scale: 2,
                    logging: true,
                    useCORS: true,
                    allowTaint: true,
                    letterRendering: true,
                    async: true
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    hotfixes: ["px_scaling"]
                },
                pagebreak: { 
                    mode: ['avoid-all', 'css', 'legacy'],
                    avoid: ['img', '.break-avoid']
                }
            };
            
            if (format === 'pdf') {
                document.getElementById('previewModal').classList.add('hidden');
                
                // Add professional header
                const header = document.createElement('div');
                header.style.marginBottom = '20px';
                header.style.paddingBottom = '10px';
                header.style.borderBottom = '1px solid #eee';
                
                header.innerHTML = `
                    <h1 style="text-align: center; font-size: 20pt; font-weight: bold; margin-bottom: 5px; color: #2c3e50;">Bug Report</h1>
                    <div style="display: flex; justify-content: space-between; font-size: 10pt;">
                        <div>
                            <p style="margin: 2px 0;"><strong>Date:</strong> ${document.getElementById('reportDate').value}</p>
                            <p style="margin: 2px 0;"><strong>Report #:</strong> ${document.getElementById('reportNumber').value}</p>
                        </div>
                        <div>
                            <p style="margin: 2px 0;"><strong>Status:</strong> Open</p>
                            <p style="margin: 2px 0;"><strong>Priority:</strong> ${document.getElementById('bugSeverity').value}</p>
                        </div>
                    </div>
                `;
                element.insertBefore(header, element.firstChild);
                
                // Adjust container styles
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
                
                // Export with retry logic for images
                await exportWithRetry(element, opt);
            } else {
                alert('Word export would be implemented here. For this demo, we only provide PDF export.');
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    }
    
    async function compressImage(imgElement, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate new dimensions while maintaining aspect ratio
            const maxDimension = 1000;
            let width = imgElement.naturalWidth;
            let height = imgElement.naturalHeight;
            
            if (width > height && width > maxDimension) {
                height *= maxDimension / width;
                width = maxDimension;
            } else if (height > maxDimension) {
                width *= maxDimension / height;
                height = maxDimension;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            ctx.drawImage(imgElement, 0, 0, width, height);
            
            canvas.toBlob((blob) => {
                imgElement.src = URL.createObjectURL(blob);
                resolve();
            }, 'image/jpeg', quality);
        });
    }
    
    async function exportWithRetry(element, options, retries = 3) {
        try {
            await html2pdf().set(options).from(element).save();
        } catch (error) {
            if (retries > 0) {
                console.log(`Retrying export... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 500));
                await exportWithRetry(element, options, retries - 1);
            } else {
                throw error;
            }
        }
    }
    
    async function generateReportHTML() {
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
            <div style="margin-bottom: 20px; page-break-inside: avoid;">
                <h2 style="font-size: 14pt; font-weight: bold; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px;">Issue Summary</h2>
                <p style="margin: 5px 0;"><strong>Summary:</strong> ${summary}</p>
                <p style="margin: 5px 0;"><strong>Severity:</strong> ${severity} ${urgent ? '<span style="background-color: #ffebee; color: #c62828; padding: 2px 5px; border-radius: 3px; font-size: 9pt; margin-left: 5px;">URGENT</span>' : ''}</p>
                ${confidential ? '<p style="color: #c62828; font-weight: bold; margin: 5px 0;"><span style="margin-right: 5px;">🔒</span>CONFIDENTIAL</p>' : ''}
                <p style="margin: 5px 0;"><strong>Reported By:</strong> ${reportedBy}</p>
                <p style="margin: 5px 0;"><strong>Assigned To:</strong> ${reportedTo || 'Not assigned'}</p>
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
                    <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
            `;
            
            images.forEach(img => {
                html += `
                    <div class="break-avoid" style="page-break-inside: avoid;">
                        <img src="${img.src}" style="max-width: 100%; height: auto; display: block; margin: 0 auto; border: 1px solid #ddd; border-radius: 4px; padding: 5px; object-fit: contain;">
                    </div>
                `;
            });
            
            html += `</div></div>`;
        }
        
        return html;
    }
}
