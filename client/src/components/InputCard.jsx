import React, { useRef, useState } from "react";
import { Upload, Camera, X, Sparkles, Send, RefreshCw, AlertTriangle } from "lucide-react";

export default function InputCard({
  text,
  setText,
  image,
  setImage,
  onAnalyze,
  isLoading,
  onOpenDemo
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPEG, PNG, WEBP).");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      alert("Image is larger than 12MB. Please select a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage({
        data: e.target.result,
        name: file.name,
        size: (file.size / 1024).toFixed(0) + " KB"
      });
      // Reset so the same file can be re-selected after clearing
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-2">
      <div className="glass-panel overflow-hidden rounded-2xl border border-slate-800 p-5 shadow-2xl sm:p-7">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onAnalyze();
          }}
          className="space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="situationText" className="text-base font-bold text-white sm:text-lg">
                What happened?
              </label>
              <p className="text-xs text-slate-400">
                Describe the symptoms, injury, or physical campus safety hazard.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenDemo}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-900/60"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Try Demo Scenarios</span>
            </button>
          </div>

          {/* Text Area */}
          <div>
            <textarea
              id="situationText"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
              placeholder="Describe what happened, where it hurts, or what hazard you see..."
              className="w-full rounded-xl border border-slate-800 bg-[#090f1e] p-3.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 sm:text-base"
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Add Photo / Hazard Evidence <span className="text-slate-500">(Optional)</span>
              </span>
              <span className="text-[11px] text-slate-500">JPG, PNG, WEBP</span>
            </div>

            {image ? (
              /* Image Preview Box */
              <div className="relative flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900/90 p-3">
                <img
                  src={image.data}
                  alt="Incident preview"
                  className="h-20 w-20 rounded-lg object-cover border border-slate-700"
                />
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-xs font-semibold text-slate-200">{image.name}</p>
                  <p className="text-[11px] text-slate-400">{image.size}</p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-cyan-400">
                    <span>Ready for Gemini vision analysis</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  disabled={isLoading}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                  title="Remove image"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              /* Dropzone / Upload Triggers */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                  isDragging
                    ? "border-cyan-400 bg-cyan-950/20"
                    : "border-slate-800 bg-[#090f1e]/80 hover:border-slate-700 hover:bg-slate-900/50"
                }`}
              >
                <div className="flex gap-2">
                  {/* File Upload Hidden Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />

                  {/* Mobile Camera Hidden Input */}
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />

                  {/* Upload Image Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <Upload className="h-4 w-4 text-cyan-400" />
                    <span>Upload Image</span>
                  </button>

                  {/* Camera Capture Button */}
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <Camera className="h-4 w-4 text-teal-400" />
                    <span>Camera</span>
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-400">or drag and drop photo here</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isLoading || (!text.trim() && !image)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>
                    {image ? "Reviewing image and preparing guidance..." : "Analyzing situation..."}
                  </span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Analyze Situation</span>
                </>
              )}
            </button>

            {(text || image) && !isLoading && (
              <button
                type="button"
                onClick={() => {
                  setText("");
                  setImage(null);
                }}
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Safe Disclaimer footnote */}
          <div className="flex items-start gap-2 rounded-lg border border-slate-800/80 bg-slate-900/40 p-2.5 text-[11px] text-slate-400">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <span>
              <strong>First-Aid Educational Tool:</strong> SafeAid AI provides immediate safety guidance and cannot diagnose medical diseases. In life-threatening emergencies, dial 112 immediately.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
