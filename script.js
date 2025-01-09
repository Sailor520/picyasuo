document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalInfo = document.getElementById('originalInfo');
    const compressedInfo = document.getElementById('compressedInfo');
    const downloadBtn = document.getElementById('downloadBtn');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    
    // 添加当前处理的图片变量
    let currentImage = null;

    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', () => fileInput.click());

    // 处理拖放
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#0071e3';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#86868b';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#86868b';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            processImage(file);
        }
    });

    // 处理文件选择
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            processImage(file);
        }
    });

    // 处理图片压缩
    function processImage(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            
            img.onload = function() {
                // 保存当前图片以供重复使用
                currentImage = {
                    img: img,
                    file: file,
                    originalUrl: e.target.result
                };
                
                // 显示原图信息
                originalPreview.src = e.target.result;
                originalInfo.textContent = `大小: ${(file.size / 1024).toFixed(2)} KB`;
                
                // 使用当前滑块值进行压缩
                compressImage(currentImage, qualitySlider.value / 100);
                
                // 显示预览区域
                previewContainer.style.display = 'grid';
            };
        };
    }

    // 新增压缩函数
    function compressImage(imageData, quality) {
        if (!imageData) return;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 计算新的尺寸，保持宽高比
        let width = imageData.img.width;
        let height = imageData.img.height;
        const maxSize = 1200;
        
        if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
        } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // 绘制压缩后的图片
        ctx.drawImage(imageData.img, 0, 0, width, height);
        
        // 转换为blob并显示
        canvas.toBlob((blob) => {
            const compressedUrl = URL.createObjectURL(blob);
            compressedPreview.src = compressedUrl;
            compressedInfo.textContent = `大小: ${(blob.size / 1024).toFixed(2)} KB`;
            
            // 设置下载按钮
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = compressedUrl;
                link.download = `compressed_${imageData.file.name}`;
                link.click();
            };
        }, 'image/jpeg', quality);
    }

    // 添加滑块事件监听器
    qualitySlider.addEventListener('input', function(e) {
        qualityValue.textContent = `${e.target.value}%`;
        compressImage(currentImage, e.target.value / 100);
    });
}); 