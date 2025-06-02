document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单功能
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
        
        // 点击菜单项后关闭菜单
        mobileMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 图片压缩功能元素
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadText = document.getElementById('uploadText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // 批量处理元素
    const batchControls = document.getElementById('batchControls');
    const imagesGrid = document.getElementById('imagesGrid');
    const selectedCount = document.getElementById('selectedCount');
    const processedCount = document.getElementById('processedCount');
    const processedNum = document.getElementById('processedNum');
    const batchQualitySlider = document.getElementById('batchQualitySlider');
    const batchQualityValue = document.getElementById('batchQualityValue');
    const compressAllBtn = document.getElementById('compressAllBtn');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    
    // 单图处理元素（保持兼容）
    const previewContainer = document.getElementById('previewContainer');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalInfo = document.getElementById('originalInfo');
    const compressedInfo = document.getElementById('compressedInfo');
    const downloadBtn = document.getElementById('downloadBtn');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const resetBtn = document.getElementById('resetBtn');
    
    // 图片数据存储
    let images = []; // 存储所有图片数据
    let currentMode = 'single'; // 'single' 或 'batch'
    
    // 显示加载状态
    function showLoading() {
        uploadText.style.display = 'none';
        loadingSpinner.style.display = 'flex';
    }

    // 隐藏加载状态
    function hideLoading() {
        uploadText.style.display = 'block';
        loadingSpinner.style.display = 'none';
    }

    // 重置功能
    function resetTool() {
        images = [];
        currentMode = 'single';
        previewContainer.style.display = 'none';
        batchControls.style.display = 'none';
        imagesGrid.style.display = 'none';
        fileInput.value = '';
        if (qualitySlider) {
            qualitySlider.value = 70;
            qualityValue.textContent = '70%';
        }
        batchQualitySlider.value = 70;
        batchQualityValue.textContent = '70%';
        hideLoading();
    }

    // 文件验证
    function validateFile(file) {
        if (!file.type.startsWith('image/')) {
            return '请选择有效的图片文件！';
        }
        if (file.size > 10 * 1024 * 1024) {
            return '图片文件过大，请选择小于10MB的图片！';
        }
        return null;
    }

    // 生成唯一ID
    function generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 压缩图片
    function compressImage(imageData, quality = 0.7) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 计算新的尺寸，保持宽高比
            let width = imageData.originalImage.width;
            let height = imageData.originalImage.height;
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
            ctx.drawImage(imageData.originalImage, 0, 0, width, height);
            
            // 转换为blob
            canvas.toBlob((blob) => {
                if (blob) {
                    imageData.compressedBlob = blob;
                    imageData.compressedSize = blob.size;
                    imageData.compressedUrl = URL.createObjectURL(blob);
                    imageData.compressedWidth = width;
                    imageData.compressedHeight = height;
                    imageData.compressionRatio = ((1 - blob.size / imageData.originalSize) * 100).toFixed(1);
                    imageData.status = 'completed';
                    resolve(imageData);
                } else {
                    imageData.status = 'error';
                    reject(new Error('压缩失败'));
                }
            }, 'image/jpeg', quality);
        });
    }

    // 创建图片卡片
    function createImageCard(imageData) {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.dataset.id = imageData.id;
        
        card.innerHTML = `
            <div class="image-card-header">
                <div class="image-card-title" title="${imageData.file.name}">${imageData.file.name}</div>
                <div class="image-card-status status-${imageData.status}">${getStatusText(imageData.status)}</div>
            </div>
            <div class="image-card-preview">
                <img src="${imageData.originalUrl}" alt="预览">
            </div>
            <div class="image-card-info">
                <div>原始大小: ${formatFileSize(imageData.originalSize)}</div>
                <div>尺寸: ${imageData.originalImage.width} × ${imageData.originalImage.height}</div>
                <div>格式: ${imageData.file.type.split('/')[1].toUpperCase()}</div>
                ${imageData.status === 'completed' ? `
                    <div>压缩后: ${formatFileSize(imageData.compressedSize)}</div>
                    <div>压缩率: ${imageData.compressionRatio}%</div>
                ` : ''}
            </div>
            <div class="image-card-progress">
                <div class="progress-bar"></div>
            </div>
            <div class="image-card-actions">
                ${imageData.status === 'pending' ? `
                    <button class="image-card-btn compress" onclick="compressSingleImage('${imageData.id}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4L20 4M4 20L20 20M8 9L12 5L16 9M8 15L12 19L16 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        压缩
                    </button>
                ` : ''}
                ${imageData.status === 'completed' ? `
                    <button class="image-card-btn download" onclick="downloadSingleImage('${imageData.id}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        下载
                    </button>
                ` : ''}
                <button class="image-card-btn remove" onclick="removeSingleImage('${imageData.id}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    移除
                </button>
            </div>
        `;
        
        return card;
    }

    // 获取状态文本
    function getStatusText(status) {
        const statusMap = {
            'pending': '待压缩',
            'processing': '压缩中',
            'completed': '已完成',
            'error': '错误'
        };
        return statusMap[status] || '未知';
    }

    // 更新图片卡片
    function updateImageCard(imageData) {
        const card = document.querySelector(`[data-id="${imageData.id}"]`);
        if (!card) return;
        
        // 更新状态
        const statusElement = card.querySelector('.image-card-status');
        statusElement.className = `image-card-status status-${imageData.status}`;
        statusElement.textContent = getStatusText(imageData.status);
        
        // 更新信息
        const infoElement = card.querySelector('.image-card-info');
        infoElement.innerHTML = `
            <div>原始大小: ${formatFileSize(imageData.originalSize)}</div>
            <div>尺寸: ${imageData.originalImage.width} × ${imageData.originalImage.height}</div>
            <div>格式: ${imageData.file.type.split('/')[1].toUpperCase()}</div>
            ${imageData.status === 'completed' ? `
                <div>压缩后: ${formatFileSize(imageData.compressedSize)}</div>
                <div>压缩率: ${imageData.compressionRatio}%</div>
            ` : ''}
        `;
        
        // 更新操作按钮
        const actionsElement = card.querySelector('.image-card-actions');
        actionsElement.innerHTML = `
            ${imageData.status === 'pending' ? `
                <button class="image-card-btn compress" onclick="compressSingleImage('${imageData.id}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4L20 4M4 20L20 20M8 9L12 5L16 9M8 15L12 19L16 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    压缩
                </button>
            ` : ''}
            ${imageData.status === 'completed' ? `
                <button class="image-card-btn download" onclick="downloadSingleImage('${imageData.id}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    下载
                </button>
            ` : ''}
            <button class="image-card-btn remove" onclick="removeSingleImage('${imageData.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                移除
            </button>
        `;
    }

    // 更新批量控制UI
    function updateBatchControls() {
        selectedCount.textContent = images.length;
        const completed = images.filter(img => img.status === 'completed').length;
        processedNum.textContent = completed;
        
        if (completed > 0) {
            processedCount.style.display = 'inline';
            downloadAllBtn.style.display = completed === images.length ? 'flex' : 'none';
        } else {
            processedCount.style.display = 'none';
            downloadAllBtn.style.display = 'none';
        }
        
        compressAllBtn.disabled = images.every(img => img.status === 'completed' || img.status === 'processing');
    }

    // 处理文件上传
    function handleFiles(files) {
        if (files.length === 0) return;
        
        // 限制文件数量
        if (files.length > 30) {
            alert('最多只能选择30张图片！');
            return;
        }
        
        // 如果是单个文件，使用单图模式
        if (files.length === 1) {
            processSingleFile(files[0]);
            return;
        }
        
        // 多个文件使用批量模式
        currentMode = 'batch';
        processBatchFiles(files);
    }

    // 处理单个文件（保持原有功能）
    function processSingleFile(file) {
        const error = validateFile(file);
        if (error) {
            alert(error);
            return;
        }
        
        showLoading();
        
        const reader = new FileReader();
        reader.onerror = function() {
            hideLoading();
            alert('读取文件时发生错误，请重试！');
        };
        
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            
            img.onerror = function() {
                hideLoading();
                alert('图片格式不支持或文件已损坏！');
            };
            
            img.onload = function() {
                const imageData = {
                    img: img,
                    file: file,
                    originalUrl: e.target.result
                };
                
                // 显示原图信息
                originalPreview.src = e.target.result;
                originalInfo.innerHTML = `
                    <div>大小: ${(file.size / 1024).toFixed(2)} KB</div>
                    <div>尺寸: ${img.width} × ${img.height}</div>
                    <div>格式: ${file.type.split('/')[1].toUpperCase()}</div>
                `;
                
                // 压缩图片
                compressSingleImageData(imageData, qualitySlider.value / 100);
                
                // 显示预览区域
                previewContainer.style.display = 'grid';
                hideLoading();
            };
        };
    }

    // 处理批量文件
    async function processBatchFiles(files) {
        showLoading();
        
        // 清空现有数据
        images = [];
        imagesGrid.innerHTML = '';
        
        let validFiles = 0;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const error = validateFile(file);
            
            if (error) {
                console.warn(`文件 ${file.name} 验证失败: ${error}`);
                continue;
            }
            
            validFiles++;
            
            try {
                const imageData = await loadImageData(file);
                images.push(imageData);
                
                // 创建并添加图片卡片
                const card = createImageCard(imageData);
                imagesGrid.appendChild(card);
                
            } catch (error) {
                console.error(`加载图片 ${file.name} 失败:`, error);
            }
        }
        
        if (validFiles === 0) {
            alert('没有有效的图片文件！');
            hideLoading();
            return;
        }
        
        // 显示批量界面
        batchControls.style.display = 'block';
        imagesGrid.style.display = 'grid';
        previewContainer.style.display = 'none';
        
        updateBatchControls();
        hideLoading();
    }

    // 加载图片数据
    function loadImageData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('读取文件失败'));
            reader.onload = function(e) {
                const img = new Image();
                img.onerror = () => reject(new Error('图片格式不支持'));
                img.onload = function() {
                    const imageData = {
                        id: generateId(),
                        file: file,
                        originalUrl: e.target.result,
                        originalImage: img,
                        originalSize: file.size,
                        status: 'pending',
                        compressedBlob: null,
                        compressedUrl: null,
                        compressedSize: 0,
                        compressedWidth: 0,
                        compressedHeight: 0,
                        compressionRatio: 0
                    };
                    resolve(imageData);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // 压缩单个图片（原有功能）
    function compressSingleImageData(imageData, quality) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
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
        ctx.drawImage(imageData.img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
            const compressedUrl = URL.createObjectURL(blob);
            compressedPreview.src = compressedUrl;
            
            const compressionRatio = ((1 - blob.size / imageData.file.size) * 100).toFixed(1);
            compressedInfo.innerHTML = `
                <div>大小: ${(blob.size / 1024).toFixed(2)} KB</div>
                <div>尺寸: ${width} × ${height}</div>
                <div>压缩率: ${compressionRatio}%</div>
            `;
            
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = compressedUrl;
                link.download = `compressed_${imageData.file.name}`;
                link.click();
            };
        }, 'image/jpeg', quality);
    }

    // 全局函数（供HTML调用）
    window.compressSingleImage = async function(id) {
        const imageData = images.find(img => img.id === id);
        if (!imageData || imageData.status !== 'pending') return;
        
        imageData.status = 'processing';
        updateImageCard(imageData);
        
        const card = document.querySelector(`[data-id="${id}"]`);
        const progressBar = card.querySelector('.progress-bar');
        const progressContainer = card.querySelector('.image-card-progress');
        
        progressContainer.classList.add('show');
        progressBar.style.width = '50%';
        
        try {
            const quality = batchQualitySlider.value / 100;
            await compressImage(imageData, quality);
            progressBar.style.width = '100%';
            
            setTimeout(() => {
                updateImageCard(imageData);
                updateBatchControls();
                progressContainer.classList.remove('show');
            }, 500);
        } catch (error) {
            imageData.status = 'error';
            updateImageCard(imageData);
            progressContainer.classList.remove('show');
            console.error('压缩失败:', error);
        }
    };

    window.downloadSingleImage = function(id) {
        const imageData = images.find(img => img.id === id);
        if (!imageData || imageData.status !== 'completed') return;
        
        const link = document.createElement('a');
        link.href = imageData.compressedUrl;
        link.download = `compressed_${imageData.file.name}`;
        link.click();
    };

    window.removeSingleImage = function(id) {
        const index = images.findIndex(img => img.id === id);
        if (index === -1) return;
        
        // 清理URL对象
        const imageData = images[index];
        if (imageData.originalUrl) URL.revokeObjectURL(imageData.originalUrl);
        if (imageData.compressedUrl) URL.revokeObjectURL(imageData.compressedUrl);
        
        // 移除数据和DOM
        images.splice(index, 1);
        const card = document.querySelector(`[data-id="${id}"]`);
        if (card) card.remove();
        
        // 更新UI
        updateBatchControls();
        
        // 如果没有图片了，隐藏批量界面
        if (images.length === 0) {
            batchControls.style.display = 'none';
            imagesGrid.style.display = 'none';
        }
    };

    // 批量压缩所有图片
    async function compressAllImages() {
        const pendingImages = images.filter(img => img.status === 'pending');
        if (pendingImages.length === 0) return;
        
        compressAllBtn.disabled = true;
        compressAllBtn.textContent = '压缩中...';
        
        const quality = batchQualitySlider.value / 100;
        
        for (const imageData of pendingImages) {
            imageData.status = 'processing';
            updateImageCard(imageData);
            
            try {
                await compressImage(imageData, quality);
                updateImageCard(imageData);
            } catch (error) {
                imageData.status = 'error';
                updateImageCard(imageData);
                console.error('压缩失败:', error);
            }
        }
        
        compressAllBtn.disabled = false;
        compressAllBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4L20 4M4 20L20 20M8 9L12 5L16 9M8 15L12 19L16 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            压缩全部
        `;
        
        updateBatchControls();
    }

    // 批量下载（打包）
    async function downloadAllImages() {
        const completedImages = images.filter(img => img.status === 'completed');
        if (completedImages.length === 0) return;
        
        // 如果只有一张图片，直接下载
        if (completedImages.length === 1) {
            downloadSingleImage(completedImages[0].id);
            return;
        }
        
        downloadAllBtn.disabled = true;
        downloadAllBtn.innerHTML = `
            <div class="image-card-spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>
            打包中...
        `;
        
        try {
            // 创建ZIP文件
            const zip = new JSZip();
            
            // 添加所有压缩后的图片到ZIP
            for (let i = 0; i < completedImages.length; i++) {
                const imageData = completedImages[i];
                const fileName = `compressed_${String(i + 1).padStart(2, '0')}_${imageData.file.name}`;
                
                // 将blob转换为ArrayBuffer
                const arrayBuffer = await imageData.compressedBlob.arrayBuffer();
                zip.file(fileName, arrayBuffer);
            }
            
            // 生成ZIP文件
            const zipBlob = await zip.generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: {
                    level: 6
                }
            });
            
            // 下载ZIP文件
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = `PicYaSuo_compressed_images_${new Date().toISOString().slice(0, 10)}.zip`;
            link.click();
            
            // 清理URL对象
            setTimeout(() => {
                URL.revokeObjectURL(link.href);
            }, 1000);
            
        } catch (error) {
            console.error('打包下载失败:', error);
            alert('打包下载失败，请重试！');
        }
        
        downloadAllBtn.disabled = false;
        downloadAllBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            打包下载
        `;
    }

    // 清空所有图片
    function clearAllImages() {
        if (images.length === 0) return;
        
        if (!confirm('确定要清空所有图片吗？')) return;
        
        // 清理URL对象
        images.forEach(imageData => {
            if (imageData.originalUrl) URL.revokeObjectURL(imageData.originalUrl);
            if (imageData.compressedUrl) URL.revokeObjectURL(imageData.compressedUrl);
        });
        
        resetTool();
    }

    // 事件监听器
    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#0071e3';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#d1d5db';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#d1d5db';
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (files.length > 0) {
            handleFiles(files);
        }
    });

    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            handleFiles(files);
        }
    });

    // 批量质量滑块
    batchQualitySlider.addEventListener('input', function(e) {
        batchQualityValue.textContent = `${e.target.value}%`;
    });

    // 单图质量滑块（保持兼容）
    if (qualitySlider && qualityValue) {
        qualitySlider.addEventListener('input', function(e) {
            qualityValue.textContent = `${e.target.value}%`;
            // 如果有当前图片，重新压缩
            if (currentMode === 'single' && originalPreview.src) {
                // 这里可以添加实时重压缩功能
            }
        });
    }

    // 批量操作按钮
    compressAllBtn.addEventListener('click', compressAllImages);
    downloadAllBtn.addEventListener('click', downloadAllImages);
    clearAllBtn.addEventListener('click', clearAllImages);

    // 重置按钮（保持兼容）
    if (resetBtn) {
        resetBtn.addEventListener('click', resetTool);
    }
}); 