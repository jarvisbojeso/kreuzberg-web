"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";

type Status = "idle" | "uploading" | "processing" | "done" | "error";

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const [markdown, setMarkdown] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [viewMode, setViewMode] = useState<"preview" | "raw">("preview");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFilename(file.name);
    setStatus("uploading");
    setError("");
    setMarkdown("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("processing");
      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setMarkdown(data.markdown);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    disabled: status === "uploading" || status === "processing",
  });

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.replace(/\.pdf$/i, ".md");
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(markdown);
  };

  const reset = () => {
    setStatus("idle");
    setMarkdown("");
    setError("");
    setFilename("");
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">📄 Kreuzberg Web</h1>
          <p className="text-gray-400 text-lg">
            Convert PDF documents to Markdown with AI-powered extraction
          </p>
        </header>

        {status === "idle" && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all ${
              isDragActive
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-600 hover:border-gray-500 hover:bg-gray-900/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-6xl mb-4">📥</div>
            {isDragActive ? (
              <p className="text-xl text-blue-400">Drop your PDF here...</p>
            ) : (
              <>
                <p className="text-xl mb-2">Drag & drop a PDF here</p>
                <p className="text-gray-500">or click to select a file</p>
              </>
            )}
          </div>
        )}

        {(status === "uploading" || status === "processing") && (
          <div className="border border-gray-700 rounded-xl p-16 text-center">
            <div className="animate-spin text-5xl mb-4">⚙️</div>
            <p className="text-xl mb-2">
              {status === "uploading" ? "Uploading..." : "Extracting text..."}
            </p>
            <p className="text-gray-500">{filename}</p>
          </div>
        )}

        {status === "error" && (
          <div className="border border-red-800 bg-red-900/20 rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <p className="text-xl text-red-400 mb-4">{error}</p>
            <button
              onClick={reset}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {status === "done" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-green-400">✅ Converted:</span>
                <span className="text-gray-300">{filename}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode(viewMode === "preview" ? "raw" : "preview")}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {viewMode === "preview" ? "📝 Raw" : "👁️ Preview"}
                </button>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  📋 Copy
                </button>
                <button
                  onClick={downloadMarkdown}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  ⬇️ Download .md
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  🔄 New
                </button>
              </div>
            </div>

            <div className="border border-gray-700 rounded-xl p-6 bg-gray-900/50 max-h-[70vh] overflow-y-auto">
              {viewMode === "preview" ? (
                <div className="markdown-preview">
                  <ReactMarkdown>{markdown}</ReactMarkdown>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300">
                  {markdown}
                </pre>
              )}
            </div>
          </div>
        )}

        <footer className="text-center mt-12 text-gray-600 text-sm">
          Powered by{" "}
          <a
            href="https://github.com/Goldziher/kreuzberg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-400"
          >
            Kreuzberg
          </a>
        </footer>
      </div>
    </main>
  );
}
