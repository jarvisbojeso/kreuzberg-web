# 📄 Kreuzberg Web

A simple web app to convert PDF documents to Markdown using [Kreuzberg](https://github.com/Goldziher/kreuzberg).

![Screenshot](docs/screenshot.png)

## Features

- 🎯 **Drag & drop** PDF upload
- 📝 **Markdown output** with preserved structure
- 📊 **Table support** in Markdown format
- 🔍 **OCR fallback** for image-based PDFs
- 👁️ **Preview/Raw** view toggle
- ⬇️ **Download** as `.md` file
- 📋 **Copy** to clipboard
- 🐳 **Single Docker container** - no external dependencies

## Quick Start

### Using Docker (recommended)

```bash
docker run -p 3000:3000 ghcr.io/jarvisbojeso/kreuzberg-web:latest
```

Then open http://localhost:3000

### Using Docker Compose

```bash
git clone https://github.com/jarvisbojeso/kreuzberg-web.git
cd kreuzberg-web
docker compose up
```

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Browser       │────▶│   Next.js        │────▶│   Kreuzberg     │
│   (Upload UI)   │     │   (Port 3000)    │     │   (Port 8000)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌─────────────────┐
                        │   Markdown      │
                        │   Output        │
                        └─────────────────┘
```

The Docker container runs both services:
- **Next.js frontend** on port 3000 (exposed)
- **Kreuzberg API** on port 8000 (internal)

## Development

### Prerequisites

- Node.js 20+
- Docker (for Kreuzberg backend)

### Local Setup

```bash
# Start Kreuzberg backend
docker run -p 8000:8000 ghcr.io/goldziher/kreuzberg:latest serve -H 0.0.0.0

# In another terminal, start the frontend
npm install
npm run dev
```

### Building the Docker Image

```bash
docker build -t kreuzberg-web .
docker run -p 3000:3000 kreuzberg-web
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `KREUZBERG_URL` | `http://localhost:8000` | URL of the Kreuzberg API server |
| `PORT` | `3000` | Port for the Next.js server |

## OCR Languages

The Docker image includes OCR support for:
- English (`eng`)
- Danish (`dan`)

To add more languages, modify the `Dockerfile` and add the relevant Tesseract language packs.

## License

MIT

## Credits

- [Kreuzberg](https://github.com/Goldziher/kreuzberg) - The PDF extraction engine
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
