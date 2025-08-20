# JPG to Small - Free Online Image Compressor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Website](https://img.shields.io/website?url=https%3A//www.jpgtosmall.com)](https://www.jpgtosmall.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A simple, fast, and privacy-focused online image compression tool. Compress JPG, PNG, and WebP images directly in your browser without uploading to any server.

## 🌟 Features

### Core Functionality
- **Drag & Drop Upload**: Easy image upload with drag and drop support
- **Real-time Preview**: Instant preview of original and compressed images
- **Quality Control**: Adjustable compression quality with real-time feedback
- **Multiple Formats**: Support for JPEG, PNG, and WebP output formats
- **Smart Format Selection**: Automatic format recommendation based on image type
- **Transparency Preservation**: Maintains transparent backgrounds for PNG images
- **File Size Display**: Shows original and compressed file sizes
- **One-click Download**: Download compressed images with branded filenames

### Privacy & Security
- **100% Client-side**: All processing happens in your browser
- **No Server Upload**: Images never leave your device
- **No Data Collection**: Complete privacy protection
- **No Registration**: Use immediately without any signup

### Technical Features
- **Browser-based Compression**: Uses HTML5 Canvas API for image processing
- **File Size Limit**: Supports files up to 30MB
- **Cross-browser Compatibility**: Works on all modern browsers
- **Mobile Responsive**: Optimized for mobile and desktop devices
- **PWA Ready**: Progressive Web App capabilities

## 🚀 Live Demo

Visit the live application: **[www.jpgtosmall.com](https://www.jpgtosmall.com)**

## 📱 Supported Formats

### Input Formats
- **JPEG/JPG** ✅ Full support
- **PNG** ✅ Full support (with transparency)
- **WebP** ✅ Full support
- **GIF** ⚠️ Converted to JPEG (animation lost)
- **SVG** ⚠️ Converted to JPEG

### Output Formats
- **JPEG** - Best for photos, smaller file size
- **PNG** - Best for graphics with transparency
- **WebP** - Modern format with excellent compression

## 🛠️ Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Image Processing**: HTML5 Canvas API
- **Styling**: Custom CSS with responsive design
- **Icons**: SVG icons and emoji
- **No Dependencies**: Zero external libraries or frameworks

## 📖 How to Use

1. **Upload Image**:
   - Drag and drop an image onto the upload area, or
   - Click the upload area to select a file from your device

2. **Adjust Quality**:
   - Use the quality slider to adjust compression level (1-100%)
   - See real-time preview of the compressed result

3. **Choose Format**:
   - Select output format (JPEG, PNG, or WebP)
   - Default format matches your original image

4. **Download**:
   - Click the download button to save the compressed image
   - Files are saved with "_jpgtosmall" suffix for branding

## 🏗️ Project Structure

```
jpgtosmall/
├── index.html          # Main application page
├── about.html          # About page
├── contact.html        # Contact page
├── privacy.html        # Privacy policy
├── 404.html           # Error page
├── styles.css         # Main stylesheet
├── script.js          # Application logic
├── assets/            # Static assets
│   ├── logo-16.svg    # Favicon 16x16
│   ├── logo-32.svg    # Favicon 32x32
│   ├── logo-64.svg    # Brand logo
│   ├── logo-128.svg   # Large logo
│   ├── logo-192.svg   # PWA icon
│   ├── logo-512.svg   # High-res logo
│   └── apple-touch-icon.svg # iOS icon
├── site.webmanifest   # PWA manifest
├── robots.txt         # Search engine instructions
├── sitemap.xml        # Site structure
└── README.md          # This file
```

## 🔧 Development

### Local Development
1. Clone the repository
2. Open `index.html` in a web browser
3. No build process required - it's pure HTML/CSS/JS

### Browser Requirements
- Modern browsers with HTML5 Canvas support
- JavaScript enabled
- File API support for drag & drop

### Testing
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices
- Verify image compression quality
- Check file download functionality

## 🎨 Design Philosophy

### Minimalist Design
- Clean, uncluttered interface
- Focus on core functionality
- Intuitive user experience
- Fast loading and responsive

### User-Centric Approach
- No registration required
- Instant results
- Clear visual feedback
- Error handling and guidance

## 📊 SEO & Performance

### SEO Optimization
- **Structured Data**: Complete Schema.org markup
- **Meta Tags**: Comprehensive Open Graph and Twitter Cards
- **Canonical URLs**: Proper URL canonicalization
- **Sitemap**: XML sitemap for search engines
- **404 Page**: Custom error page with navigation

### Performance Features
- **Lightweight**: Minimal CSS and JavaScript
- **No External Dependencies**: Faster loading
- **Optimized Images**: SVG icons for crisp display
- **Responsive Design**: Mobile-first approach

## 🔒 Privacy & Security

### Data Protection
- **No Server Processing**: Images processed locally
- **No Data Storage**: No images or data stored anywhere
- **No Tracking**: No analytics or tracking scripts
- **HTTPS Ready**: Secure connection support

### Browser Security
- **Content Security Policy**: XSS protection
- **No External Resources**: Reduced attack surface
- **Client-side Only**: Maximum privacy protection

## 🌍 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 60+     | ✅ Full |
| Firefox | 55+     | ✅ Full |
| Safari  | 11+     | ✅ Full |
| Edge    | 79+     | ✅ Full |
| Mobile  | Modern  | ✅ Full |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
- Follow existing code style
- Test on multiple browsers
- Ensure mobile compatibility
- Maintain performance standards

## 📞 Support

- **Website**: [www.jpgtosmall.com](https://www.jpgtosmall.com)
- **Issues**: Report bugs or request features via GitHub issues
- **Contact**: Use the contact form on the website

## 🎯 Roadmap

### Planned Features
- [ ] Batch image compression
- [ ] Additional output formats
- [ ] Advanced compression options
- [ ] Image resize functionality
- [ ] Offline PWA support

### Performance Improvements
- [ ] Service Worker implementation
- [ ] Advanced caching strategies
- [ ] Image optimization pipeline
- [ ] Core Web Vitals optimization

---

**Made with ❤️ for the web community. Compress images freely and privately.**