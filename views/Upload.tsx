import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CloudUploadIcon, FileIcon, RefreshIcon, XMarkIcon } from '../components/Icons';

interface UploadProps {
  onUpload: (file: File) => void;
  onCancel: () => void;
}

export const Upload: React.FC<UploadProps> = ({ onUpload, onCancel }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const ALLOWED_EXTENSIONS = ['.pdb', '.pdbqt', '.sdf', '.out', '.txt'];

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const validateFile = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    const isValid = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    
    if (!isValid) {
      setError(`Invalid file type. Supported formats: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      } else {
        setFile(null);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      } else {
        // Reset input value if needed, though react handles state
        setFile(null);
      }
    }
  };

  const handleSubmit = () => {
    if (file) {
      setIsUploading(true);
      setProgress(0);
      setError(null);
      
      const interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            window.clearInterval(interval);
            setTimeout(() => onUpload(file), 500);
            return 100;
          }
          return prev + 5; 
        });
      }, 100); 
      
      intervalRef.current = interval;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 animate-slideUp">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">New Analysis</h2>
        <p className="text-slate-400 max-w-lg mx-auto">Upload your molecular docking files (PDBQT, SDF) to generate AI-driven insights and on-chain verification.</p>
      </div>

      <Card className={`p-12 border-2 border-dashed transition-all duration-300 relative overflow-hidden group ${dragActive ? 'border-science-500 bg-science-900/80 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'border-science-700/50 bg-science-900/30 hover:bg-science-900/50 hover:border-science-600'} ${error ? 'border-red-500/50' : ''}`}>
        
        {/* Background Mesh Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-science-500/5 to-transparent pointer-events-none" />

        {isUploading ? (
          <div className="relative z-10 flex flex-col items-center justify-center py-4 space-y-8 animate-fadeIn">
            <div className="relative">
                <div className="absolute inset-0 bg-science-500/20 blur-xl rounded-full"></div>
                <div className="w-20 h-20 bg-science-900 rounded-full border border-science-700 flex items-center justify-center relative z-10">
                   <RefreshIcon className="w-8 h-8 text-science-400 animate-spin" />
                </div>
            </div>
            
            <h3 className="text-xl font-medium text-white">Processing {file?.name}</h3>
            
            <div className="w-full max-w-sm space-y-3">
              <div className="flex justify-between text-xs font-semibold text-science-400 uppercase tracking-widest">
                <span>Uploading</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-science-950 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-science-500 rounded-full transition-all duration-100 ease-out shadow-[0_0_10px_#3b82f6]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-xs text-slate-500 pt-2 font-mono">
                Calculating SHA-256 Checksum...
              </p>
            </div>
          </div>
        ) : (
          <div 
            className="relative z-10 flex flex-col items-center justify-center text-center space-y-6"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${dragActive ? 'bg-science-500/20 text-science-400 scale-110' : 'bg-science-900 border border-science-700/50 text-slate-400 group-hover:text-science-400 group-hover:border-science-500/30'}`}>
              {file ? <FileIcon className="w-10 h-10" /> : <CloudUploadIcon className="w-10 h-10" />}
            </div>
            
            <div className="space-y-2 pointer-events-none">
                <h3 className="text-xl font-medium text-white">
                {file ? file.name : "Drag & Drop files here"}
                </h3>
                
                <p className="text-slate-400 text-sm">
                or <span className="text-science-400">browse</span> to upload
                </p>
            </div>
            
            <p className="text-slate-500 text-xs uppercase tracking-wide pointer-events-none">
              Supports .pdbqt, .sdf, .pdb, .out
            </p>

            <div className="relative mt-2">
              <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  onChange={handleChange}
                  accept=".pdb,.pdbqt,.sdf,.out,.txt"
              />
              <label htmlFor="file-upload">
                  <Button variant="secondary" className="px-8" onClick={(e) => document.getElementById('file-upload')?.click()}>
                    {file ? 'Replace File' : 'Select Files'}
                  </Button>
              </label>
            </div>
          </div>
        )}
      </Card>
      
      {/* Error Message */}
      {error && (
        <div className="mt-4 mx-auto max-w-lg p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm animate-fadeIn shadow-lg shadow-red-500/5">
            <div className="p-1 bg-red-500/20 rounded-full">
              <XMarkIcon className="w-4 h-4" />
            </div>
            <span>{error}</span>
        </div>
      )}

      {!isUploading && (
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="ghost" onClick={onCancel} className="text-slate-400 hover:text-white">Cancel</Button>
          <Button disabled={!file} onClick={handleSubmit} className="px-8 shadow-xl shadow-science-500/20">
            Start Analysis
          </Button>
        </div>
      )}
    </div>
  );
};
