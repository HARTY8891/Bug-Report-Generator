function initFileUpload() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const clearImagesBtn = document.getElementById('clearImagesBtn');
    
    dropzone.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', handleFiles);
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, unhighlight, false);
    });
    
    dropzone.addEventListener('drop', handleDrop, false);
    
    clearImagesBtn.addEventListener('click', clearAllImages);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropzone.classList.add('active');
    }
    
    function unhighlight() {
        dropzone.classList.remove('active');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }
    
    function handleFiles(e) {
        const files = e.target.files;
        if (files.length > 0) {
            previewContainer.classList.remove('hidden');
            clearImagesBtn.classList.remove('hidden');
            
            // Clear previous images
            previewContainer.innerHTML = '';
            
            // Create loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'col-span-full text-center py-4 text-gray-500';
            loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Loading images...';
            previewContainer.appendChild(loadingIndicator);
            
            let loadedCount = 0;
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.match('image.*')) continue;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    loadedCount++;
                    
                    // Remove loading indicator after first image loads
                    if (loadedCount === 1) {
                        previewContainer.innerHTML = '';
                    }
                    
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'relative group';
                    
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'w-full h-auto rounded object-cover border border-gray-200';
                    img.loading = 'lazy';
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                    removeBtn.className = 'absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600';
                    removeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        imgContainer.remove();
                        if (previewContainer.children.length === 0) {
                            previewContainer.classList.add('hidden');
                            clearImagesBtn.classList.add('hidden');
                        }
                    });
                    
                    imgContainer.appendChild(img);
                    imgContainer.appendChild(removeBtn);
                    previewContainer.appendChild(imgContainer);
                };
                
                reader.onerror = function() {
                    console.error('Error loading image');
                    loadedCount++;
                    if (loadedCount === files.length && previewContainer.children.length === 1 && previewContainer.firstChild === loadingIndicator) {
                        previewContainer.innerHTML = '<div class="col-span-full text-center py-4 text-red-500">Error loading images</div>';
                    }
                };
                
                reader.readAsDataURL(file);
            }
        }
    }
    
    function clearAllImages() {
        previewContainer.innerHTML = '';
        previewContainer.classList.add('hidden');
        clearImagesBtn.classList.add('hidden');
        fileInput.value = '';
    }
}
