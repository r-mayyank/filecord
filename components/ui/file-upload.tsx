"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  UploadCloud,
  File as FileIcon,
  X,
  Loader,
  RefreshCcw,
  ArrowDownToLine,
  RefreshCw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import compressFileName from "@/util/compress-file-name";
import { toast } from "./Toast/use-toast";
import convertFile from "@/util/convert";


const extensions = {
  image: [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'webp',
    'ico',
    'tif',
    'tiff',
    'svg',
    'raw',
    'tga',
  ],
  video: [
    'mp4',
    'm4v',
    'mp4v',
    '3gp',
    '3g2',
    'avi',
    'mov',
    'wmv',
    'mkv',
    'flv',
    'ogv',
    'webm',
    'h264',
    '264',
    'hevc',
    '265',
  ],
  audio: ['mp3', 'wav', 'ogg', 'aac', 'wma', 'flac', 'm4a'],
};



const fileUploadVariants = cva(
  "relative rounded-card border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 group w-full",
  {
    variants: {
      variant: {
        default:
          "border-border bg-card hover:border-primary/30",
        dashed:
          "border-dashed border-border bg-background hover:border-primary/50",
        ghost:
          "border-transparent bg-inherit hover:bg-stone-900",
      },
      size: {
        sm: "p-4 min-h-[120px]",
        default: "p-6 min-h-[160px]",
        lg: "p-8 min-h-[200px]",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "default",
    },
  },
);

interface FileWithPreview {
  id: string;
  file: any;
  file_name: any;
  file_size: number;
  from: string;
  to: String | null;
  file_type: string;
  is_converting?: boolean;
  is_converted?: boolean;
  is_error?: boolean;
  url?: any;
  output?: any;
  status: "uploading" | "completed" | "error";
  progress: number;
}

export interface FileUploadProps
  extends VariantProps<typeof fileUploadVariants> {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  isDrag?: boolean;
  onFilesChange?: (files: FileWithPreview[]) => void;
  className?: string;
  children?: React.ReactNode;
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className,
      variant,
      size,
      accept = "*/*",
      multiple = true,
      maxFiles = 10,
      maxSize = 10 * 1024 * 1024,
      disabled = false,
      isDrag,
      onFilesChange,
      children,
      ...props
    },
    ref,
  ) => {
    const [files, setFiles] = React.useState<FileWithPreview[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const [isGlobalDragging, setIsGlobalDragging] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const ffmpegRef = React.useRef<any>(null);
    const [isFFmpegLoaded, setIsFFmpegLoaded] = React.useState(false);
    const dragCounterRef = React.useRef(0);

    // Initialize FFmpeg
    React.useEffect(() => {
      const loadFFmpeg = async () => {
        try {
          // Dynamic import FFmpeg to avoid SSR issues
          const { FFmpeg } = await import('@ffmpeg/ffmpeg');
          const { toBlobURL } = await import('@ffmpeg/util');

          const ffmpeg = new FFmpeg();
          ffmpegRef.current = ffmpeg;

          const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
          await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
          });
          setIsFFmpegLoaded(true);
          console.log('FFmpeg loaded successfully');
        } catch (error) {
          console.error('Failed to load FFmpeg:', error);
        }
      };

      loadFFmpeg();
    }, []);

    // Global drag and drop handlers
    React.useEffect(() => {
      const handleGlobalDragEnter = (e: DragEvent) => {
        e.preventDefault();
        dragCounterRef.current++;
        
        // Check if the dragged item contains files
        if (e.dataTransfer?.types.includes('Files')) {
          setIsGlobalDragging(true);
        }
      };

      const handleGlobalDragLeave = (e: DragEvent) => {
        e.preventDefault();
        dragCounterRef.current--;
        
        // Only hide the overlay when all drag events have been countered
        if (dragCounterRef.current === 0) {
          setIsGlobalDragging(false);
        }
      };

      const handleGlobalDragOver = (e: DragEvent) => {
        e.preventDefault();
      };

      const handleGlobalDrop = (e: DragEvent) => {
        e.preventDefault();
        dragCounterRef.current = 0;
        setIsGlobalDragging(false);
        
        // Only handle the drop if it contains files
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
          // Create a local handleFiles function
          const localHandleFiles = (fileList: FileList) => {
            if (disabled) return;

            const newFiles = Array.from(fileList)
              .slice(0, maxFiles - files.length)
              .map((file) => ({
                id: `${Date.now()}-${Math.random()}`,
                file_name: file.name,
                file_size: file.size,
                from: file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2),
                to: null,
                file_type: file.type,
                file,
                is_converted: false,
                is_converting: false,
                is_error: false,
                status: "uploading" as const,
                progress: 0,
              }));

            const updatedFiles = [...files, ...newFiles];
            setFiles(updatedFiles);
            onFilesChange?.(updatedFiles);

            // Simulate upload
            newFiles.forEach((fileItem) => {
              let progress = 0;
              const interval = setInterval(() => {
                progress += Math.random() * 15;
                setFiles((prev) =>
                  prev.map((f) =>
                    f.id === fileItem.id
                      ? { ...f, progress: Math.min(progress, 100) }
                      : f,
                  ),
                );
                if (progress >= 100) {
                  clearInterval(interval);
                  setFiles((prev) =>
                    prev.map((f) =>
                      f.id === fileItem.id ? { ...f, status: "completed" } : f,
                    ),
                  );
                }
              }, 200);
            });
          };
          
          localHandleFiles(e.dataTransfer.files);
        }
      };

      // Add global event listeners
      document.addEventListener('dragenter', handleGlobalDragEnter);
      document.addEventListener('dragleave', handleGlobalDragLeave);
      document.addEventListener('dragover', handleGlobalDragOver);
      document.addEventListener('drop', handleGlobalDrop);

      // Cleanup
      return () => {
        document.removeEventListener('dragenter', handleGlobalDragEnter);
        document.removeEventListener('dragleave', handleGlobalDragLeave);
        document.removeEventListener('dragover', handleGlobalDragOver);
        document.removeEventListener('drop', handleGlobalDrop);
      };
    }, [files, disabled, maxFiles, onFilesChange]);

    const formatFileSize = (bytes: number): string => {
      if (!bytes) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
    };

    const convert = async (id: string) => {
      if (!isFFmpegLoaded || !ffmpegRef.current) {
        toast.error("Error", "FFmpeg is not loaded yet. Please wait and try again.");
        return;
      }

      const fileToConvert = files.find(file => file.id === id);
      if (!fileToConvert) {
        toast.error("Error", "Error converting file");
        return;
      }

      // Check file size (limit to 50MB for browser-based conversion)
      const maxFileSize = 50 * 1024 * 1024; // 50MB
      if (fileToConvert.file_size > maxFileSize) {
        toast.error("Error", "File too large. Please use files smaller than 50MB.");
        return;
      }

      setFiles(
        files.map((file): FileWithPreview => {
          if (file.id === id) {
            console.log('CONVERTING', id);
            return {
              ...file,
              is_converting: true,
              is_error: false,
            };
          }
          return file;
        }),
      );

      try {
        const { url, output } = await convertFile(ffmpegRef.current, fileToConvert);
        setFiles(
          files.map((file): FileWithPreview => {
            if (file.id === id) {
              console.log('CONVERTED', id);
              return {
                ...file,
                is_converting: false,
                is_converted: true,
                is_error: false,
                url,
                output,
              };
            }
            return file;
          }),
        );
        toast.success("Success", "File converted successfully!");
      } catch (error) {
        console.error("Error converting file:", error);
        setFiles(
          files.map((file): FileWithPreview => {
            if (file.id === id) {
              console.log('ERROR', id);
              return {
                ...file,
                is_converting: false,
                is_error: true,
                is_converted: false,
              };
            }
            return file;
          }),
        );

        // Provide more specific error messages
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        if (errorMessage.includes("memory access out of bounds")) {
          toast.error("Error", "File conversion failed due to memory issues. Try with a smaller file.");
        } else if (errorMessage.includes("timeout")) {
          toast.error("Error", "File conversion timed out. Try with a smaller file.");
        } else {
          toast.error("Error", `File conversion failed: ${errorMessage}`);
        }
      }
    };

    const updateAction = (id: string, to: string) => {
      setFiles(
        files.map((file): FileWithPreview => {
          if (file.id === id) {
            console.log('FOUND', id);
            return {
              ...file,
              to,
            };
          }

          return file;
        }),
      );
    }

    React.useEffect(() => {
      if (isDrag === true) {
        setIsDragging(true);
      } else {
        setIsDragging(false);
      }
    }, [isDrag]);

    const handleFiles = (fileList: FileList) => {
      if (disabled) return;

      const newFiles = Array.from(fileList)
        .slice(0, maxFiles - files.length)
        .map((file) => ({
          id: `${Date.now()}-${Math.random()}`,
          file_name: file.name,
          file_size: file.size,
          from: file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2),
          to: null,
          file_type: file.type,
          file,
          is_converted: false,
          is_converting: false,
          is_error: false,
          status: "uploading" as const,
          progress: 0,
        }));

      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);

      // Simulate upload
      newFiles.forEach((fileItem) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15;
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id
                ? { ...f, progress: Math.min(progress, 100) }
                : f,
            ),
          );
          if (progress >= 100) {
            clearInterval(interval);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileItem.id ? { ...f, status: "completed" } : f,
              ),
            );
          }
        }, 200);
      });
    };

    const download = (file: FileWithPreview) => {
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = file.url || URL.createObjectURL(file.file);
      a.download = file.output;

      document.body.appendChild(a);
      a.click();

      URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
      toast.success("Success", "File downloaded successfully");
    }

    const reset = (file : FileWithPreview) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? {
                ...f,
                is_converted: false,
                is_converting: false,
                is_error: false,
                url: null,
                output: null,
                to: null,
              }
            : f,
        ),
      );
    }

    const removeFile = (id: string) => {
      const updatedFiles = files.filter((f) => f.id !== id);
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    };

    const onDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      // Don't handle here since global handler will process it
    };

    const onDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) handleFiles(e.target.files);
    };

    const openFileDialog = () => {
      if (!disabled) inputRef.current?.click();
    };

    return (
      <div ref={ref} className="w-full space-y-4" {...props}>
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={openFileDialog}
          className={cn(
            fileUploadVariants({ variant, size }),
            isDragging &&
            "border-primary bg-primary/5",
            disabled && "opacity-50 pointer-events-none",
            "cursor-pointer",
            className,
          )}
        >
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <UploadCloud className="w-12 h-12 text-muted-foreground" />
            <div className="space-y-1">
              <h3 className="text-lg font-medium">
                {isDragging ? "Drop files here" : "Upload files"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop files here, or click to browse
                <br />
                {multiple ? " (up to " + maxFiles + " files," : ""}
                {maxSize ? " max size: " + formatFileSize(maxSize) + ")" : ""}
              </p>
            </div>
            {children}
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple={multiple}
            accept={accept}
            disabled={disabled}
            className="sr-only"
            onChange={onSelect}
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <AnimatePresence>
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col md:flex-row items-center gap-3 p-3 rounded-lg bg-black border w-full/90 justify-between mx-2"
                >
                  {/* Left section */}
                  <div className="flex items-center gap-3 flex-1">
                    <FileIcon className="w-8 h-8 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-start">
                        <p className="text-sm font-medium truncate">{compressFileName(file.file_name)}</p>
                        {/* <p className="text-sm font-medium truncate">{(file.to)}</p> */}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.file_size)}
                      </p>
                      {file.status === "uploading" && (
                        <div className="w-full h-1 bg-accent rounded-full mt-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right section */}
                  <div className="flex flex-col md:flex-row items-center gap-2">
                    {!file.is_converted && !file.url && (
                      <div className="flex flex-col md:flex-row items-center gap-2">
                        <div className="flex items-center gap-2">
                        <div className="whitespace-nowrap">Convert to:</div>
                        <Select
                          onValueChange={(value) =>
                            updateAction(file.id, value)
                          }
                        >
                          <SelectTrigger className="rounded-2xl bg-black text-white">
                            <SelectValue placeholder="Format" />
                          </SelectTrigger>
                          <SelectContent className="bg-black">
                            {file.file_type.includes('image') && (
                              <div className="grid grid-cols-3 gap-2 w-fit">
                                {extensions.image.map((elt, i) => (
                                  <div key={i} className="col-span-1 text-center">
                                    <SelectItem value={elt} className="mx-auto bg-black">
                                      {elt}
                                    </SelectItem>
                                  </div>
                                ))}
                              </div>
                            )}
                            {file.file_type.includes('video') && (
                              <div className="grid grid-cols-3 gap-2 w-fit">
                                {extensions.video.map((elt, i) => (
                                  <div key={i} className="col-span-1 text-center">
                                    <SelectItem value={elt} className="mx-auto">
                                      {elt}
                                    </SelectItem>
                                  </div>
                                ))}
                              </div>
                            )}
                            {file.file_type.includes('audio') && (
                              <div className="grid grid-cols-3 gap-2 w-fit">
                                {extensions.audio.map((elt, i) => (
                                  <div key={i} className="col-span-1 text-center">
                                    <SelectItem value={elt} className="mx-auto">
                                      {elt}
                                    </SelectItem>
                                  </div>
                                ))}
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        </div>
                        <div>
                        <button
                          onClick={() => convert(file.id)}
                          disabled={!file.to || file.status !== "completed" || file.is_converting || !isFFmpegLoaded}
                          className="p-1 px-3 bg-white text-black rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/80 transition-colors flex items-center gap-1"
                        >
                          {file.is_converting ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              Converting...
                            </>
                          ) : !isFFmpegLoaded ? (
                            "Loading..."
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4" />
                              Convert
                            </>
                          )}
                        </button>
                        </div>
                      </div>
                    )}

                    {file.is_converted && file.url && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => reset(file)} className="p-1 px-3 bg-stone-400 text-white rounded hover:bg-stone-800 transition-colors flex items-center gap-1">
                          <RefreshCcw className="w-4 h-4" />
                          Reset
                        </button>
                        <button
                          onClick={() => download(file)}
                          className="p-1 px-3 bg-teal-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <ArrowDownToLine className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    )}

                    {file.is_error && (
                      <span className="text-red-500 text-sm">Failed</span>
                    )}

                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 hover:bg-accent rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Global Drag Overlay */}
        <AnimatePresence>
          {isGlobalDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
              style={{ pointerEvents: 'none' }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, type: "spring" }}
                className="flex justify-centerbg-white/10 w-full h-full border-2 border-dashed border-white/50 rounded-2xl p-16 text-center backdrop-blur-md"
              >
                <div className="flex flex-1 flex-col items-center justify-center w-full h-full">
                  <UploadCloud className="w-24 h-24 text-white mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-white mb-2">Drop files here</h2>
                  <p className="text-white/80 text-lg">Release to upload your files</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

FileUpload.displayName = "FileUpload";

export { FileUpload, fileUploadVariants };
export type { FileWithPreview };