import { Actions } from '../types';

function removeFileExtension(file_name: string) {
  const lastDotIndex = file_name.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return file_name.slice(0, lastDotIndex);
  }
  return file_name; // No file extension found
}

export default async function convertFile(
  ffmpeg: any, // Use any type since we're using dynamic imports
  action: Actions,
): Promise<any> {
  const { fetchFile } = await import('@ffmpeg/util');
  
  const { file, to, file_name, file_type } = action;
  
  // Use simple, safe filenames to avoid issues with special characters
  const input = `input.${file_name.split('.').pop()}`;
  const output = `output.${to}`;
  
  console.log(`Converting ${input} to ${output}, file type: ${file_type}`);
  
  try {
    // Write the input file to FFmpeg's file system
    const fileData = await fetchFile(file);
    await ffmpeg.writeFile(input, fileData);
    console.log('File written to FFmpeg filesystem');

    // FFMEG COMMANDS - simplified for better compatibility
    let ffmpeg_cmd: any = [];
    
    // Handle different file types with simplified, reliable commands
    if (file_type.startsWith('image/')) {
      // Simple image conversion
      ffmpeg_cmd = ['-i', input, output];
    } else if (file_type.startsWith('video/')) {
      // Simple video conversion with basic codecs
      if (to === 'mp4') {
        ffmpeg_cmd = ['-i', input, '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', output];
      } else if (to === 'webm') {
        ffmpeg_cmd = ['-i', input, '-c:v', 'libvpx', '-crf', '30', output];
      } else {
        // Basic conversion without codec specification
        ffmpeg_cmd = ['-i', input, output];
      }
    } else if (file_type.startsWith('audio/')) {
      // Simple audio conversion
      if (to === 'mp3') {
        ffmpeg_cmd = ['-i', input, '-c:a', 'mp3', output];
      } else if (to === 'wav') {
        ffmpeg_cmd = ['-i', input, '-c:a', 'pcm_s16le', output];
      } else {
        ffmpeg_cmd = ['-i', input, output];
      }
    } else {
      // Fallback - simple conversion
      ffmpeg_cmd = ['-i', input, output];
    }

    console.log('FFmpeg command:', ffmpeg_cmd.join(' '));

    // Execute command
    await ffmpeg.exec(ffmpeg_cmd);
    console.log('FFmpeg conversion completed');

    // Read the output file
    const data = await ffmpeg.readFile(output);
    console.log('Output file read successfully');
    
    // Clean up files from FFmpeg's virtual file system
    try {
      await ffmpeg.deleteFile(input);
      await ffmpeg.deleteFile(output);
      console.log('Cleanup completed');
    } catch (cleanupError) {
      console.warn('Failed to cleanup files:', cleanupError);
    }
    
    // Create blob with proper MIME type
    let mimeType = file_type;
    if (to === 'mp4') mimeType = 'video/mp4';
    else if (to === 'mp3') mimeType = 'audio/mp3';
    else if (to === 'png') mimeType = 'image/png';
    else if (to === 'jpg' || to === 'jpeg') mimeType = 'image/jpeg';
    
    const blob = new Blob([data.buffer], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    return { url, output: `${removeFileExtension(file_name)}.${to}` };
    
  } catch (error) {
    console.error('FFmpeg conversion error:', error);
    // Clean up input file if it exists
    try {
      await ffmpeg.deleteFile(input);
      await ffmpeg.deleteFile(output);
    } catch (cleanupError) {
      console.warn('Failed to cleanup files after error:', cleanupError);
    }
    throw error;
  }
}