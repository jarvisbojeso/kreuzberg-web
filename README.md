# 📄 Kreuzberg Web

A simple web app to convert PDF documents to Markdown using [Kreuzberg](https://github.com/kreuzberg-dev/kreuzberg).

## Features

- 🎯 **Drag & drop** PDF upload
- 📝 **Markdown output** with preserved structure
- 📊 **Table support** in Markdown format
- 🔍 **OCR fallback** for image-based PDFs
- 👁️ **Preview/Raw** view toggle
- ⬇️ **Download** as `.md` file
- 📋 **Copy** to clipboard

## Quick Start

### Using Docker Compose (recommended)

```bash
git clone https://github.com/jarvisbojeso/kreuzberg-web.git
cd kreuzberg-web
docker compose up -d
```

Then open http://localhost:3000

### Using Pre-built Images

```bash
# Pull the images
docker pull ghcr.io/jarvisbojeso/kreuzberg-web:latest
docker pull ghcr.io/kreuzberg-dev/kreuzberg:latest

# Run with docker compose
curl -O https://raw.githubusercontent.com/jarvisbojeso/kreuzberg-web/main/docker-compose.yml
docker compose up -d
```

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Browser       │────▶│   Frontend       │────▶│   Kreuzberg     │
│   (Upload UI)   │     │   (Port 3000)    │     │   (Port 8000)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

Two containers:
- **Frontend (Next.js)** - Port 3000 (exposed)
- **Kreuzberg API** - Port 8000 (internal)

## Development

```bash
# Start Kreuzberg backend
docker run -p 8000:8000 ghcr.io/kreuzberg-dev/kreuzberg:latest serve -H 0.0.0.0

# In another terminal, start the frontend
npm install
KREUZBERG_URL=http://localhost:8000 npm run dev
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `KREUZBERG_URL` | `http://kreuzberg:8000` | URL of the Kreuzberg API |
| `PORT` | `3000` | Port for the Next.js server |

## OCR Languages

The Kreuzberg image includes OCR support for multiple languages.
Add language-specific Tesseract data to support more languages.

## License

MIT

## Credits

- [Kreuzberg](https://github.com/kreuzberg-dev/kreuzberg) - The PDF extraction engine
- [Next.js](https://nextjs.org/) - React framework
