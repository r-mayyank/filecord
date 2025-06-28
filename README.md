# 🎯 Filecord

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/FFmpeg-0.12.15-007808?style=for-the-badge&logo=ffmpeg&logoColor=white" alt="FFmpeg" />
</div>

<div align="center">
  <h3>🚀 A modern, browser-based file conversion tool</h3>
  <p>Convert images, videos, and audio files seamlessly with drag-and-drop functionality</p>
</div>

---

## ✨ Features

- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations
- 🖱️ **Global Drag & Drop** - Drop files anywhere on the screen with visual feedback
- 🔄 **Multi-format Support** - Convert between various image, video, and audio formats
- ⚡ **Browser-based Processing** - No server required, all conversions happen in your browser
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- 🌙 **Dark Theme** - Elegant dark theme with gradient backgrounds
- 📊 **Real-time Progress** - Live conversion progress with loading indicators
- 🔄 **Batch Processing** - Convert multiple files simultaneously
- 💾 **Direct Download** - Download converted files instantly
- 🚫 **Privacy First** - Files never leave your browser

## 🎬 Demo

![Filecord Demo](https://via.placeholder.com/800x400/0a0a0a/63e?text=Filecord+Demo)

*Drag and drop files anywhere to start converting*

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/filecord.git
   cd filecord
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
filecord/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx          # Home page
│   └── about/            # About page
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   │   ├── file-upload.tsx    # Main file upload component
│   │   ├── button.tsx         # Button component
│   │   ├── select.tsx         # Select dropdown component
│   │   └── Toast/             # Toast notification system
│   ├── appbar.tsx            # Navigation bar
│   └── blocks/              # Specialized components
├── util/                # Utility functions
│   ├── convert.ts       # File conversion logic
│   ├── types.ts         # TypeScript type definitions
│   └── compress-file-name.ts  # File name utilities
├── lib/                 # Library functions
│   └── utils.ts         # Utility functions
└── public/             # Static assets
```

## 🛠️ Technologies Used

### Frontend Framework
- **Next.js 15.3.4** - React framework with App Router
- **React 19.0.0** - Latest React with concurrent features
- **TypeScript 5.0** - Type safety and developer experience

### Styling & UI
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Framer Motion 12.19.2** - Smooth animations and transitions
- **Lucide React** - Beautiful SVG icons
- **Class Variance Authority** - Component variant management
- **Radix UI** - Accessible component primitives

### File Processing
- **FFmpeg.wasm 0.12.15** - Browser-based video/audio processing
- **React Dropzone 14.3.8** - File drag-and-drop functionality

### Developer Experience
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Sonner** - Toast notifications

## 🎯 Supported Formats

### 🖼️ Images
- **Input**: JPG, JPEG, PNG, GIF, BMP, WebP, ICO, TIF, TIFF, SVG, RAW, TGA
- **Output**: JPG, JPEG, PNG, GIF, BMP, WebP, ICO, TIF, TIFF, SVG, RAW, TGA

### 🎥 Videos
- **Input**: MP4, M4V, MP4V, 3GP, 3G2, AVI, MOV, WMV, MKV, FLV, OGV, WebM, H264, H265
- **Output**: MP4, M4V, MP4V, 3GP, 3G2, AVI, MOV, WMV, MKV, FLV, OGV, WebM, H264, H265

### 🎵 Audio
- **Input**: MP3, WAV, OGG, AAC, WMA, FLAC, M4A
- **Output**: MP3, WAV, OGG, AAC, WMA, FLAC, M4A

## 🚀 Usage

1. **Upload Files**
   - Drag and drop files anywhere on the screen
   - Or click the upload area to browse files
   - Multiple files supported (up to 10 files, 50MB each)

2. **Select Output Format**
   - Choose your desired output format from the dropdown
   - Format options are filtered based on input file type

3. **Convert**
   - Click the "Convert" button to start processing
   - Watch the real-time progress indicator

4. **Download**
   - Download your converted files instantly
   - Files are processed locally in your browser

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📊 Stats

<div align="center">
  <img src="https://img.shields.io/github/stars/yourusername/filecord?style=for-the-badge" alt="Stars" />
  <img src="https://img.shields.io/github/forks/yourusername/filecord?style=for-the-badge" alt="Forks" />
  <img src="https://img.shields.io/github/issues/yourusername/filecord?style=for-the-badge" alt="Issues" />
  <img src="https://img.shields.io/github/license/yourusername/filecord?style=for-the-badge" alt="License" />
</div>

---

<div align="center">
  <p>Made with ❤️ and modern web technologies</p>
  <p>Star ⭐ this repository if you found it helpful!</p>
</div>
