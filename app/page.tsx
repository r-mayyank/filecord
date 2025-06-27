"use client";
import { FileUpload } from "@/components/ui/file-upload";
import * as React from "react"

export default function Home() {
  // const [isDragging, setIsDragging] = React.useState(false);

  // const onDragOver = (e: React.DragEvent) => {
  //     e.preventDefault();
  //     setIsDragging(true);
  //   };
  // const onDragLeave = () => setIsDragging(false);


  return (
    <div 
    // onDragOver={onDragOver}
    // onDragLeave={onDragLeave}
    >
      <div className="flex justify-center items-center">
        <main className="flex flex-col items-center justify-center min-h-screen ">
          {/* herosection */}
          <div className="text-center mb-8 text-shadow-2xs text-shadow-purple-600">
            <h1 className="text-5xl text-purple-600 font-serif">FileCord --add some spice here </h1>
            <h2 className="text-4xl font-serif pt-4">Convert multiple files with ease..</h2>
            <h4 className="text-2xl font-serif">We are backendless so no more privacy issue.</h4>
          </div>
          <FileUpload variant="ghost"></FileUpload>
          {/* <Dropzone /> */}
          {/* <FileUpload isDrag={isDragging} variant="ghost"/> */}
        </main>
      </div>
    </div>
  );
}
