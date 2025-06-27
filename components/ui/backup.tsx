import { log } from 'console';
import { UploadCloud } from 'lucide-react';
import { useState } from 'react';

interface Actions {
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
}
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

export default function Dropzone() {
    const max_files = 10;
    // const max_size = 10 * 1024 * 1024;
    const max_size = 10
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [actions, setActions] = useState<Actions[]>([]);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [files, setFiles] = useState<Array<any>>([]);


    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const onDragLeave = () => setIsDragging(false);

    const handleUpload = (data: FileList) => {
        setFiles(Array.from(data));
        const tmp: Actions[] = [];
        Array.from(data).slice(0, max_files - files.length)
                tmp.push({
                    file_name: file.name,
                    file_size: file.size,
                    from: file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2),
                    to: null,
                    file_type: file.type,
                    file,
                    is_converted: false,
                    is_converting: false,
                    is_error: false,
                });
            });
        // const updateFiles = [...files, ...newFiles];
        // setActions(updateFiles);
        setActions(tmp);
        console.log("Files to be uploaded:", actions);
        
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleUpload(e.dataTransfer.files);
    };

    return (
        <div className={`w-full space-y-4 relative rounded-card transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${isDragging ? 'border-2 border-primary' : ''}`}>
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className="border-transparent bg-accent/50 hover:bg-accent p-8 min-h-[160px]"
            >
                <div className={`group w-full flex flex-col items-center justify-center `}>
                    <UploadCloud className="w-12 h-12 text-muted-foreground mb-2" />
                    <p className='text-muted-foreground text-xl'>Upload Files</p>
                    <p className="text-muted-foreground text-sm">Drag and drop files here or click to browse</p>
                    <span className='text-sm'>{" (up to " + max_files + " files,"}
                        {" max size: " + max_size + ".0 MB" + ")"}
                    </span>
                </div>
            </div>
        </div>
    )
}