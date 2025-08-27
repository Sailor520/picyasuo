document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    console.log('Current URL:', window.location.href);
    console.log('User Agent:', navigator.userAgent);
    
    // DOM Elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    // Debug: Check if elements exist
    console.log('uploadArea:', uploadArea);
    console.log('fileInput:', fileInput);
    
    // Check if upload area is visible and clickable
    if (uploadArea) {
        const rect = uploadArea.getBoundingClientRect();
        const styles = window.getComputedStyle(uploadArea);
        console.log('Upload area position:', rect);
        console.log('Upload area display:', styles.display);
        console.log('Upload area visibility:', styles.visibility);
        console.log('Upload area pointer-events:', styles.pointerEvents);
    }
    
    // Check if elements exist before adding event listeners
    if (!uploadArea) {
        console.error('Upload area not found!');
        return;
    }
    if (!fileInput) {
        console.error('File input not found!');
        return;
    }
    const qualitySection = document.getElementById('qualitySection');
    const previewSection = document.getElementById('previewSection');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalInfo = document.getElementById('originalInfo');
    const compressedInfo = document.getElementById('compressedInfo');
    const downloadBtn = document.getElementById('downloadBtn');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const originalContainer = document.getElementById('originalContainer');
    const compressedContainer = document.getElementById('compressedContainer');
    const originalPlaceholder = document.getElementById('originalPlaceholder');
    const compressedPlaceholder = document.getElementById('compressedPlaceholder');
    const resetBtn = document.getElementById('resetBtn');
    const formatSelection = document.getElementById('formatSelection');
    const outputFormat = document.getElementById('outputFormat');
    const formatInfo = document.getElementById('formatInfo');

    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Current image variable
    let currentImage = null;

    // 检测WebP支持
    function checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const dataURL = canvas.toDataURL('image/webp');
        return dataURL.indexOf('data:image/webp') === 0;
    }

    // 初始化格式选择
    function initializeFormatOptions() {
        if (!checkWebPSupport()) {
            const webpOption = outputFormat.querySelector('option[value="webp"]');
            if (webpOption) {
                webpOption.disabled = true;
                webpOption.textContent = 'WebP (Not supported in this browser)';
            }
        }
    }

    // 初始化格式选项
    initializeFormatOptions();

    // 检查图片是否有透明背景
    function hasTransparency(img) {
        const testCanvas = document.createElement('canvas');
        const testCtx = testCanvas.getContext('2d');
        testCanvas.width = Math.min(img.naturalWidth || img.width, 100);
        testCanvas.height = Math.min(img.naturalHeight || img.height, 100);

        testCtx.drawImage(img, 0, 0, testCanvas.width, testCanvas.height);
        const imageData = testCtx.getImageData(0, 0, testCanvas.width, testCanvas.height);
        const data = imageData.data;

        // 检查是否有透明像素
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 255) {
                return true;
            }
        }
        return false;
    }

    // Click upload area to trigger file selection
    uploadArea.addEventListener('click', function(e) {
        console.log('Upload area clicked - SIMPLE VERSION');
        
        // 阻止事件冒泡，防止重复触发
        e.stopPropagation();
        
        // 直接触发文件输入框
        try {
            fileInput.click();
            console.log('File input click triggered');
        } catch (error) {
            console.error('Error triggering file input:', error);
            // 备用方案：临时显示文件输入框
            fileInput.style.display = 'block';
            fileInput.style.position = 'absolute';
            fileInput.style.top = '0';
            fileInput.style.left = '0';
            fileInput.style.opacity = '0.01';
            
            setTimeout(() => {
                fileInput.click();
                fileInput.style.display = 'none';
                fileInput.style.position = '';
                fileInput.style.top = '';
                fileInput.style.left = '';
                fileInput.style.opacity = '';
            }, 50);
        }
    });
    
    // 添加键盘支持（无障碍访问）
    uploadArea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            console.log('Keyboard trigger on upload area');
            e.preventDefault(); // 这里保留preventDefault防止滚动
            try {
                if (fileInput) {
                    fileInput.click();
                    console.log('File input click triggered via keyboard');
                }
            } catch (error) {
                console.error('Error triggering file input via keyboard:', error);
            }
        }
    });
    
    // 确保上传区域可以获得焦点
    uploadArea.setAttribute('tabindex', '0');
    uploadArea.setAttribute('role', 'button');
    uploadArea.setAttribute('aria-label', 'Click to upload image');

    // Handle drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        console.log('Drag over');
        e.preventDefault();
        uploadArea.style.borderColor = '#3b82f6';
        uploadArea.style.backgroundColor = '#eff6ff';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        console.log('Drag leave');
        e.preventDefault();
        uploadArea.style.borderColor = '#d1d5db';
        uploadArea.style.backgroundColor = '#f9fafb';
    });

    uploadArea.addEventListener('drop', (e) => {
        console.log('File dropped:', e.dataTransfer.files[0]);
        e.preventDefault();
        uploadArea.style.borderColor = '#d1d5db';
        uploadArea.style.backgroundColor = '#f9fafb';
        const file = e.dataTransfer.files[0];
        if (file && validateFile(file)) {
            processImage(file);
        }
    });

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        console.log('File input changed:', e.target.files[0]);
        const file = e.target.files[0];
        if (file && validateFile(file)) {
            processImage(file);
        }
    });

    // 文件验证函数
    function validateFile(file) {
        // 完全支持的格式
        const fullySupported = ['image/jpeg', 'image/jpg', 'image/png'];
        // 部分支持的格式（需要转换）
        const partiallySupported = ['image/webp', 'image/gif', 'image/svg+xml'];

        // 检查文件类型
        if (!fullySupported.includes(file.type) && !partiallySupported.includes(file.type)) {
            alert('❌ Unsupported file format!\n\n✅ Best Support: JPG, JPEG, PNG\n⚠️ Limited Support: WebP, GIF, SVG (converted to JPEG)\n\nPlease upload a supported image file.');
            return false;
        }

        // 检查文件大小 (30MB = 30 * 1024 * 1024 bytes)
        const maxSize = 30 * 1024 * 1024;
        if (file.size > maxSize) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            alert(`❌ File too large!\n\nYour file: ${fileSizeMB}MB\nMaximum allowed: 30MB\n\nPlease choose a smaller image file.`);
            return false;
        }

        // 部分支持格式的警告
        if (file.type === 'image/webp') {
            const proceed = confirm('⚠️ WebP Format Notice\n\nWebP files will be converted to JPEG format.\nCompression quality may vary depending on your browser.\n\nFor best results, use JPG or PNG files.\n\nDo you want to continue?');
            if (!proceed) return false;
        }

        if (file.type === 'image/gif') {
            const proceed = confirm('⚠️ GIF Format Notice\n\nAnimated GIFs will be converted to static JPEG images.\nOnly the first frame will be preserved.\n\nFor best results, use JPG or PNG files.\n\nDo you want to continue?');
            if (!proceed) return false;
        }

        if (file.type === 'image/svg+xml') {
            const proceed = confirm('⚠️ SVG Format Notice\n\nSVG files will be converted to JPEG format.\nVector properties will be lost and converted to raster image.\n\nFor best results, use JPG or PNG files.\n\nDo you want to continue?');
            if (!proceed) return false;
        }

        return true;
    }

    // 处理图片压缩
    function processImage(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function() {
                // 清理之前的格式转换提示
                const existingFormatNotes = compressedInfo.querySelectorAll('div');
                existingFormatNotes.forEach(note => note.remove());

                // 保存当前图片以供重复使用
                currentImage = {
                    img: img,
                    file: file,
                    originalUrl: e.target.result
                };

                // 显示原图信息
                originalPreview.src = e.target.result;
                originalPreview.style.display = 'block';
                originalPlaceholder.style.display = 'none';
                originalContainer.classList.add('has-image');
                originalInfo.textContent = `Size: ${(file.size / 1024).toFixed(2)} KB`;

                // 重置压缩图区域到占位符状态
                compressedPreview.style.display = 'none';
                compressedPreview.src = '';
                compressedPlaceholder.style.display = 'flex';
                compressedContainer.classList.remove('has-image');
                compressedInfo.textContent = 'Size: N/A';
                downloadBtn.style.display = 'none';

                // 设置格式选择默认值为原图格式
                const originalFormat = getOriginalFormat(currentImage);
                outputFormat.value = originalFormat;
                updateFormatInfo();

                // 显示格式选择区域
                formatSelection.style.display = 'block';

                // 使用当前滑块值进行压缩
                compressImage(currentImage, qualitySlider.value / 100);

                // 显示质量控制区域
                qualitySection.style.display = 'block';
            };
        };
    }

    // 新增压缩函数
    function compressImage(imageData, quality) {
        if (!imageData) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 计算新的尺寸，保持宽高比
        let width = imageData.img.naturalWidth || imageData.img.width;
        let height = imageData.img.naturalHeight || imageData.img.height;
        const maxSize = 1200;

        // 只有当图片超过最大尺寸时才缩小，避免放大
        if (width > maxSize || height > maxSize) {
            if (width > height && width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
            } else if (height > maxSize) {
                width = (width * maxSize) / height;
                height = maxSize;
            }
        }

        canvas.width = width;
        canvas.height = height;

        // 根据图片类型和透明度决定背景处理
        const needsBackground = imageData.file.type === 'image/svg+xml' ||
                               (imageData.file.type === 'image/png' && !hasTransparency(imageData.img));

        if (needsBackground) {
            // 只有SVG或不透明的PNG才添加白色背景
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
        }

        try {
            // 绘制压缩后的图片
            ctx.drawImage(imageData.img, 0, 0, width, height);

            // 根据用户选择和图片特性确定输出格式
            const selectedFormat = getActualOutputFormat(imageData);
            const formatMap = {
                'jpeg': { mime: 'image/jpeg', ext: 'jpg', quality: true },
                'png': { mime: 'image/png', ext: 'png', quality: false },
                'webp': { mime: 'image/webp', ext: 'webp', quality: true }
            };

            const format = formatMap[selectedFormat];
            const outputMimeType = format.mime;
            const fileExtension = format.ext;
            
            // PNG特殊处理：智能压缩策略
            if (selectedFormat === 'png' && imageData.file.type === 'image/png') {
                console.log('开始PNG智能压缩处理');
                handlePNGCompression(imageData, canvas, width, height, format);
                return;
            }
            
            const compressionQuality = format.quality ? quality : 1.0;

            // 转换为blob并显示
            canvas.toBlob((blob) => {
                if (blob) {
                    displayCompressedResult(blob, imageData, format, fileExtension, outputMimeType);
                } else {
                    compressedInfo.textContent = 'Compression failed';
                    console.error('Failed to create compressed blob');
                }
            }, outputMimeType, compressionQuality);

        } catch (error) {
            compressedInfo.textContent = 'Compression error';
            console.error('Compression error:', error);
        }
    }

    // PNG智能压缩处理函数
    function handlePNGCompression(imageData, canvas, width, height, format) {
        console.log('开始PNG智能压缩处理');
        const originalSize = imageData.file.size;
        const originalWidth = imageData.img.naturalWidth;
        const originalHeight = imageData.img.naturalHeight;
        
        console.log('原图信息:', {
            size: originalSize,
            width: originalWidth,
            height: originalHeight,
            targetWidth: width,
            targetHeight: height
        });
        
        // 总是尝试压缩，但确保不会变大
        console.log('尝试PNG压缩...');
        canvas.toBlob((blob) => {
            if (blob) {
                console.log('压缩结果:', {
                    originalSize: originalSize,
                    compressedSize: blob.size,
                    sizeChange: blob.size - originalSize
                });
                
                if (blob.size <= originalSize) {
                    // 压缩成功，文件变小或相等
                    console.log('压缩成功，文件变小或相等');
                    displayCompressedResult(blob, imageData, format, format.ext, format.mime);
                } else {
                    // 压缩后变大，尝试其他策略
                    console.log('压缩后变大，尝试其他策略');
                    tryAlternativePNGStrategies(imageData, originalSize, format);
                }
            } else {
                // 压缩失败，使用原图
                console.log('压缩失败，使用原图');
                useOriginalPNG(imageData, format);
            }
        }, 'image/png', 1.0);
    }

    // 尝试其他PNG压缩策略
    function tryAlternativePNGStrategies(imageData, originalSize, format) {
        console.log('尝试其他PNG压缩策略...');
        const originalWidth = imageData.img.naturalWidth;
        const originalHeight = imageData.img.naturalHeight;
        
        // 策略1：尝试更激进的尺寸缩小
        const aggressiveSizes = [800, 600, 400];
        let compressionAttempted = false;
        
        for (let maxDim of aggressiveSizes) {
            if (originalWidth <= maxDim && originalHeight <= maxDim) {
                console.log(`跳过尺寸 ${maxDim}px，原图更小`);
                continue;
            }
            
            console.log(`尝试尺寸 ${maxDim}px 压缩...`);
            compressionAttempted = true;
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            let width = originalWidth;
            let height = originalHeight;
            
            if (width > height && width > maxDim) {
                height = (height * maxDim) / width;
                width = maxDim;
            } else if (height > maxDim) {
                width = (width * maxDim) / height;
                height = maxDim;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // 检查透明度
            if (hasTransparency(imageData.img)) {
                ctx.drawImage(imageData.img, 0, 0, width, height);
            } else {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(imageData.img, 0, 0, width, height);
            }
            
            canvas.toBlob((blob) => {
                if (blob) {
                    console.log(`尺寸 ${maxDim}px 压缩结果:`, {
                        originalSize: originalSize,
                        compressedSize: blob.size,
                        sizeChange: blob.size - originalSize,
                        success: blob.size <= originalSize
                    });
                    
                    if (blob.size <= originalSize) {
                        // 找到合适的压缩方案
                        console.log(`找到合适的压缩方案: ${maxDim}px`);
                        displayCompressedResult(blob, imageData, format, format.ext, format.mime);
                        return;
                    }
                }
            }, 'image/png', 1.0);
        }
        
        if (!compressionAttempted) {
            console.log('原图尺寸太小，无法进行激进压缩');
        }
        
        // 策略2：如果所有压缩策略都失败，建议转换为JPEG
        console.log('所有PNG压缩策略失败，尝试转换为JPEG...');
        suggestJPEGConversion(imageData, originalSize, format);
    }

    // 建议转换为JPEG
    function suggestJPEGConversion(imageData, originalSize, format) {
        console.log('开始JPEG转换...');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = imageData.img.naturalWidth;
        canvas.height = imageData.img.naturalHeight;
        
        // 添加白色背景（因为要转换为JPEG）
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageData.img, 0, 0);
        
        console.log('转换为JPEG，质量80%...');
        // 转换为JPEG，质量80%
        canvas.toBlob((blob) => {
            if (blob) {
                console.log('JPEG转换成功:', {
                    originalSize: originalSize,
                    jpegSize: blob.size,
                    sizeChange: blob.size - originalSize,
                    success: blob.size <= originalSize
                });
                
                if (blob.size <= originalSize) {
                    console.log('JPEG转换成功且文件变小');
                    const jpegFormat = { mime: 'image/jpeg', ext: 'jpg', quality: true };
                    displayCompressedResult(blob, imageData, jpegFormat, 'jpg', 'image/jpeg');
                    
                    // 显示转换建议
                    const formatNote = document.createElement('div');
                    formatNote.style.fontSize = '0.9em';
                    formatNote.style.color = '#e74c3c';
                    formatNote.style.marginTop = '5px';
                    formatNote.style.fontWeight = 'bold';
                    formatNote.textContent = '💡 PNG压缩后变大，已自动转换为JPEG格式以获得更好的压缩效果';
                    compressedInfo.appendChild(formatNote);
                } else {
                    console.log('JPEG转换后仍然变大，使用原图');
                    useOriginalPNG(imageData, format);
                }
            } else {
                console.log('JPEG转换失败，使用原图');
                // 如果JPEG转换也失败，使用原图
                useOriginalPNG(imageData, format);
            }
        }, 'image/jpeg', 0.8);
    }

    // 使用原图PNG
    function useOriginalPNG(imageData, format) {
        const compressedUrl = imageData.originalUrl;
        compressedPreview.src = compressedUrl;
        compressedPreview.style.display = 'block';
        compressedPlaceholder.style.display = 'none';
        compressedContainer.classList.add('has-image');
        compressedInfo.innerHTML = `
            <div>Size: ${(imageData.file.size / 1024).toFixed(2)} KB</div>
            <div style="color: #27ae60; font-size: 0.9em;">✅ Original PNG preserved (unable to compress further)</div>
        `;
        
        // 显示下载按钮
        downloadBtn.style.display = 'inline-block';
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.href = compressedUrl;
            const originalName = imageData.file.name.substring(0, imageData.file.name.lastIndexOf('.')) || 'image';
            link.download = `${originalName}_jpgtosmall.png`;
            link.click();
        };
    }

    // 显示压缩结果
    function displayCompressedResult(blob, imageData, format, fileExtension, outputMimeType) {
        const compressedUrl = URL.createObjectURL(blob);
        compressedPreview.src = compressedUrl;
        compressedPreview.style.display = 'block';
        compressedPlaceholder.style.display = 'none';
        compressedContainer.classList.add('has-image');
        
        // 显示压缩效果信息
        const originalSize = imageData.file.size;
        const compressedSize = blob.size;
        const sizeChange = ((compressedSize - originalSize) / originalSize * 100).toFixed(1);
        const sizeChangeText = sizeChange > 0 ? `+${sizeChange}%` : `${sizeChange}%`;
        const sizeChangeColor = sizeChange > 0 ? '#e74c3c' : '#27ae60';
        
        compressedInfo.innerHTML = `
            <div>Size: ${(blob.size / 1024).toFixed(2)} KB</div>
            <div style="color: ${sizeChangeColor}; font-size: 0.9em;">
                ${sizeChange > 0 ? '⚠️' : '✅'} ${sizeChangeText} change
            </div>
        `;

        // 显示下载按钮
        downloadBtn.style.display = 'inline-block';

        // 设置下载按钮
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.href = compressedUrl;
            const originalName = imageData.file.name.substring(0, imageData.file.name.lastIndexOf('.')) || 'image';
            link.download = `${originalName}_jpgtosmall.${fileExtension}`;
            link.click();
        };

        // 显示格式转换提示
        const originalFormat = imageData.file.type.split('/')[1].toUpperCase();
        const outputFormatName = fileExtension.toUpperCase();

        if (originalFormat !== outputFormatName) {
            const formatNote = document.createElement('div');
            formatNote.style.fontSize = '0.8em';
            formatNote.style.color = '#666';
            formatNote.style.marginTop = '5px';

            if (outputMimeType === 'image/png' && hasTransparency(imageData.img)) {
                formatNote.textContent = `Converted to PNG (transparent background preserved)`;
            } else {
                formatNote.textContent = `Converted from ${originalFormat} to ${outputFormatName}`;
            }
            compressedInfo.appendChild(formatNote);
        }
    }

    // 添加滑块事件监听器
    qualitySlider.addEventListener('input', function(e) {
        qualityValue.textContent = `${e.target.value}%`;
        compressImage(currentImage, e.target.value / 100);
    });

    // New Image按钮事件监听器 - 直接触发文件选择
    resetBtn.addEventListener('click', function() {
        fileInput.click();
    });

    // 格式选择事件监听器
    outputFormat.addEventListener('change', function() {
        if (currentImage) {
            updateFormatInfo();
            compressImage(currentImage, qualitySlider.value / 100);
        }
    });

    // 格式信息更新函数
    function updateFormatInfo() {
        const selectedFormat = outputFormat.value;
        const formatDescriptions = {
            'jpeg': 'Best for photos. Smaller file size, no transparency support',
            'png': 'Best for graphics with transparency. Larger file size, lossless quality',
            'webp': 'Modern format with excellent compression. May not work in older browsers'
        };

        formatInfo.textContent = formatDescriptions[selectedFormat] || '';
    }

    // 获取原图格式对应的输出格式
    function getOriginalFormat(imageData) {
        if (!imageData) return 'jpeg';

        // 根据原始文件类型映射到支持的输出格式
        const formatMapping = {
            'image/jpeg': 'jpeg',
            'image/jpg': 'jpeg',
            'image/png': 'png',
            'image/webp': 'webp',
            'image/gif': 'jpeg', // GIF转换为JPEG
            'image/svg+xml': 'jpeg' // SVG转换为JPEG
        };

        return formatMapping[imageData.file.type] || 'jpeg';
    }

    // 根据用户选择获取实际输出格式
    function getActualOutputFormat(imageData) {
        return outputFormat.value;
    }
});