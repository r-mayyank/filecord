import ReactDropzone from 'react-dropzone'
import { UploadCloud } from 'lucide-react';
import * as React from "react";
import { toast } from "@/components/ui/Toast/use-toast";

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

export default function Dropzone() {
    const [isDragging, setIsDragging] = React.useState<boolean>(false);
    const [files, setFiles] = React.useState<Array<any>>([]);
    const [actions, setActions] = React.useState<Actions[]>([]);

    const acceptedFileTypes = {
        'image/*': [
            '.jpg',
            '.jpeg',
            '.png',
            '.gif',
            '.bmp',
            '.webp',
            '.ico',
            '.tif',
            '.tiff',
            '.raw',
            '.tga',
        ],
        'audio/*': [],
        'video/*': [],
    }


    const handleOnDragEnter = () => setIsDragging(true);
    const handleOnDragLeave = () => setIsDragging(false);
    const handleUpload = (data: Array<any>) => {
        setFiles(data);
        handleOnDragLeave();
        const tmp: Actions[] = [];
        data.forEach((file: any) => {
            tmp.push({
                file: file,
                file_name: file.name,
                file_size: file.size,
                from: file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2),
                to: null,
                file_type: file.type,
                is_converting: false,
                is_converted: false,
                is_error: false,
                url: null,
                output: null
            });
        });
        setActions(tmp);
        console.log("Files uploaded:", tmp);
    }

    if (actions.length > 0) {
        return (
            <div className=''>
                {actions.map((action, index) => (
                    <span key={index}>{action.file_name}</span>
                ))}
            </div>
        )
    }

    return (
        <ReactDropzone
            onDragEnter={handleOnDragEnter}
            onDragLeave={handleOnDragLeave}
            onDrop={handleUpload}
            accept={acceptedFileTypes}
            onDropAccepted={() => toast.success("File Uploaded!", { duration: 1000 })}
            onDropRejected={() => toast.error("Error Uploading File!", { duration: 1000 })}
            onError={(error) => console.error("Dropzone error:", error)}
        >
            {(state) => (
                <div className={`group w-full flex flex-col items-center justify-center `}>
                    <UploadCloud className="w-12 h-12 text-muted-foreground mb-2" />
                    <p className='text-muted-foreground text-xl'>Upload Files</p>
                    <p className="text-muted-foreground text-sm">Drag and drop files here or click to browse</p>
                    {/* <span className='text-sm'>{" (up to " + max_files + " files,"}
                        {" max size: " + max_size + ".0 MB" + ")"}
                    </span> */}
                    {/* <button onClick={() => toast.error("Hello WOrld!")}>Hello</button> */}
                </div>
            )}
        </ReactDropzone>
    )
}