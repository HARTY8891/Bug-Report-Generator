function initDrafts() {
    document.getElementById('saveDraftBtn').addEventListener('click', saveAsDraft);
    loadDrafts();
    
    function saveAsDraft() {
        if (!validateForm()) return;
        
        const draft = {
            date: document.getElementById('reportDate').value,
            reportNumber: document.getElementById('reportNumber').value,
            summary: document.getElementById('bugSummary').value,
            severity: document.getElementById('bugSeverity').value,
            description: document.getElementById('bugDescription').value,
            environment: document.getElementById('bugEnvironment').value,
            nextSteps: document.getElementById('nextSteps').value,
            reportedBy: document.getElementById('reportedBy').value,
            reportedTo: document.getElementById('reportedTo').value,
            urgent: document.getElementById('urgentFlag').checked,
            confidential: document.getElementById('confidentialFlag').checked,
            timestamp: new Date().toISOString(),
            // Note: We're not saving images in drafts for simplicity
        };
        
        let drafts = JSON.parse(localStorage.getItem('bugReportDrafts') || '[]');
        drafts.unshift(draft); // Add new draft at the beginning
        
        // Keep only the latest 5 drafts
        if (drafts.length > 5) {
            drafts = drafts.slice(0, 5);
        }
        
        localStorage.setItem('bugReportDrafts', JSON.stringify(drafts));
        
        alert('Draft saved successfully!');
        loadDrafts();
    }
    
    function loadDrafts() {
        const drafts = JSON.parse(localStorage.getItem('bugReportDrafts') || '[]');
        const draftsList = document.getElementById('draftsList');
        const draftsSection = document.getElementById('draftsSection');
        
        draftsList.innerHTML = '';
        
        if (drafts.length > 0) {
            draftsSection.classList.remove('hidden');
            
            drafts.forEach((draft, index) => {
                const draftItem = document.createElement('div');
                draftItem.classList.add('p-3', 'border', 'rounded-md', 'hover:bg-gray-50', 'cursor-pointer');
                draftItem.innerHTML = `
                    <h3 class="font-medium text-gray-800 truncate">${draft.reportNumber} - ${draft.summary}</h3>
                    <p class="text-sm text-gray-600">${new Date(draft.timestamp).toLocaleString()}</p>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-xs px-2 py-1 rounded ${getSeverityClass(draft.severity)}">${draft.severity}</span>
                        <button class="text-red-500 hover:text-red-700 text-sm load-draft" data-index="${index}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                
                draftItem.addEventListener('click', () => loadDraft(draft));
                
                // Add delete button functionality
                const deleteBtn = draftItem.querySelector('.load-draft');
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm('Delete this draft?')) {
                        deleteDraft(index);
                    }
                });
                
                draftsList.appendChild(draftItem);
            });
        } else {
            draftsSection.classList.add('hidden');
        }
    }
    
    function getSeverityClass(severity) {
        switch (severity) {
            case 'Low': return 'bg-green-100 text-green-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'High': return 'bg-orange-100 text-orange-800';
            case 'Critical': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
    
    function loadDraft(draft) {
        document.getElementById('reportDate').value = draft.date;
        document.getElementById('reportNumber').value = draft.reportNumber;
        document.getElementById('bugSummary').value = draft.summary;
        document.getElementById('bugSeverity').value = draft.severity;
        document.getElementById('bugDescription').value = draft.description;
        document.getElementById('bugEnvironment').value = draft.environment;
        document.getElementById('nextSteps').value = draft.nextSteps;
        document.getElementById('reportedBy').value = draft.reportedBy;
        document.getElementById('reportedTo').value = draft.reportedTo;
        document.getElementById('urgentFlag').checked = draft.urgent;
        document.getElementById('confidentialFlag').checked = draft.confidential;
        
        // Generate preview automatically
        document.getElementById('previewBtn').click();
    }
    
    function deleteDraft(index) {
        let drafts = JSON.parse(localStorage.getItem('bugReportDrafts') || '[]');
        drafts.splice(index, 1);
        localStorage.setItem('bugReportDrafts', JSON.stringify(drafts));
        loadDrafts();
    }
}
