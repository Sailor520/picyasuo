// Environment Configuration for JPG to Small
// This file handles different path configurations for local development vs production

const config = {
    // Environment detection
    isProduction: window.location.hostname === 'www.jpgtosmall.com' || window.location.hostname === 'jpgtosmall.com',
    isLocal: window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    
    // Base paths
    basePath: {
        local: '',
        production: 'https://www.jpgtosmall.com'
    },
    
    // Asset paths
    assets: {
        local: 'assets/',
        production: '/assets/'
    },
    
    // Page paths
    pages: {
        local: {
            home: './',
            about: './about.html',
            contact: './contact.html',
            privacy: './privacy.html',
            pngTest: './png-compression-test.html',
            generateLogo: './generate-logo.html',
            error404: './404.html'
        },
        production: {
            home: '/',
            about: '/about',
            contact: '/contact',
            privacy: '/privacy',
            pngTest: '/png-compression-test',
            generateLogo: '/generate-logo',
            error404: '/404'
        }
    },
    
    // Get current environment
    getEnvironment() {
        if (this.isProduction) return 'production';
        if (this.isLocal) return 'local';
        return 'development'; // fallback
    },
    
    // Get base path for current environment
    getBasePath() {
        return this.basePath[this.getEnvironment()] || this.basePath.local;
    },
    
    // Get asset path for current environment
    getAssetPath(filename) {
        const env = this.getEnvironment();
        return this.assets[env] + filename;
    },
    
    // Get page URL for current environment
    getPageUrl(pageName) {
        const env = this.getEnvironment();
        return this.pages[env][pageName] || this.pages.local[pageName];
    },
    
    // Get full URL for current environment
    getFullUrl(pageName) {
        const env = this.getEnvironment();
        if (env === 'production') {
            return this.basePath.production + this.pages.production[pageName];
        }
        return this.pages.local[pageName];
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else {
    window.appConfig = config;
}

// Log current configuration for debugging
console.log('JPG to Small Environment Config:', {
    environment: config.getEnvironment(),
    basePath: config.getBasePath(),
    assetPath: config.getAssetPath('logo-64.svg'),
    homePage: config.getPageUrl('home')
});
