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
        try {
            let files = Array.from(e.target.files);
            if (files.length === 0) return;
            
            // Limit to 10 files max
            if (files.length > 10) {
                alert('Maximum 10 images allowed. Only the first 10 will be processed.');
                files = files.slice(0, 10);
            }
            
            previewContainer.classList.remove('hidden');
            clearImagesBtn.classList.remove('hidden');
            
            // Clear previous images only if not holding Ctrl key (for multiple selections)
            if (!e.ctrlKey && !e.metaKey) {
                previewContainer.innerHTML = '';
            }
            
            // Create loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'col-span-full text-center py-4 text-gray-500';
            loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Loading images...';
            previewContainer.appendChild(loadingIndicator);
            
            let loadedCount = 0;
            const validImages = files.filter(file => file.type.match('image.*'));
            
            if (validImages.length === 0) {
                previewContainer.innerHTML = '<div class="col-span-full text-center py-4 text-red-500">No valid images found</div>';
                return;
            }
            
            validImages.forEach(file => {
                const reader = new FileReader();
                
                reader.onloadstart = () => {
                    // Show loading state for each image
                    const placeholder = document.createElement('div');
                    placeholder.className = 'relative bg-gray-100 rounded flex items-center justify-center';
                    placeholder.style.minHeight = '100px';
                    placeholder.innerHTML = '<div class="text-gray-500"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
                    previewContainer.appendChild(placeholder);
                };
                
                reader.onload = function(e) {
                    loadedCount++;
                    
                    // Replace placeholder with actual image
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'relative group break-avoid';
                    
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'w-full h-auto rounded object-contain border border-gray-200 max-h-[300px]';
                    img.loading = 'eager';
                    img.crossOrigin = 'Anonymous';
                    img.style.maxHeight = '300px';
                    img.style.objectFit = 'contain';
                    
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
                    
                    // Replace the last placeholder (which is our loading indicator)
                    const placeholders = previewContainer.querySelectorAll('div.relative.bg-gray-100');
                    if (placeholders.length > 0) {
                        placeholders[placeholders.length - 1].replaceWith(imgContainer);
                    } else {
                        previewContainer.appendChild(imgContainer);
                    }
                    
                    // Remove initial loading indicator if this is the first image
                    if (loadedCount === 1 && loadingIndicator.parentNode) {
                        previewContainer.removeChild(loadingIndicator);
                    }
                };
                
                reader.onerror = () => {
                    loadedCount++;
                    console.error('Error loading image:', file.name);
                    
                    // Show error for this image
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'col-span-full text-center py-4 text-red-500';
                    errorDiv.textContent = `Error loading: ${file.name}`;
                    
                    const placeholders = previewContainer.querySelectorAll('div.relative.bg-gray-100');
                    if (placeholders.length > 0) {
                        placeholders[placeholders.length - 1].replaceWith(errorDiv);
                    } else {
                        previewContainer.appendChild(errorDiv);
                    }
                };
                
                reader.readAsDataURL(file);
            });
        } catch (error) {
            console.error('Error handling files:', error);
            alert('Error processing files. Please try again.');
        }
    }
    
    function clearAllImages() {
        previewContainer.innerHTML = '';
        previewContainer.classList.add('hidden');
        clearImagesBtn.classList.add('hidden');
        fileInput.value = '';
    }
}
