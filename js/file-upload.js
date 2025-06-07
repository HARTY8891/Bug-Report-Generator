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
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.match('image.*')) continue;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.classList.add('w-full', 'h-auto', 'rounded', 'object-cover');
                    
                    const previewItem = document.createElement('div');
                    previewItem.classList.add('relative', 'group');
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                    removeBtn.classList.add('absolute', '-top-2', '-right-2', 'bg-red-500', 'text-white', 'rounded-full', 'w-5', 'h-5', 'flex', 'items-center', 'justify-center', 'text-xs', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity');
                    removeBtn.addEventListener('click', () => {
                        previewItem.remove();
                        if (previewContainer.children.length === 0) {
                            previewContainer.classList.add('hidden');
                            clearImagesBtn.classList.add('hidden');
                        }
                    });
                    
                    previewItem.appendChild(img);
                    previewItem.appendChild(removeBtn);
                    previewContainer.appendChild(previewItem);
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
