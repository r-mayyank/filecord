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
  const input = file_name; // Use the full filename as input
  const output = removeFileExtension(file_name) + '.' + to;
  
  try {
    // Write the input file to FFmpeg's file system
    await ffmpeg.writeFile(input, await fetchFile(file));

    // FFMEG COMMANDS
    let ffmpeg_cmd: any = [];
    
    // Handle different file types with optimized commands
    if (file_type.startsWith('image/')) {
      // Image conversion - simple and efficient
      ffmpeg_cmd = ['-i', input, '-q:v', '2', output];
    } else if (file_type.startsWith('video/')) {
      // Video conversion
      if (to === '3gp') {
        ffmpeg_cmd = [
          '-i', input,
          '-r', '20',
          '-s', '352x288',
          '-vb', '400k',
          '-acodec', 'aac',
          '-strict', 'experimental',
          '-ac', '1',
          '-ar', '8000',
          '-ab', '24k',
          output,
        ];
      } else if (to === 'mp4') {
        ffmpeg_cmd = [
          '-i', input,
          '-c:v', 'libx264',
          '-crf', '23',
          '-preset', 'medium',
          '-c:a', 'aac',
          '-b:a', '128k',
          output,
        ];
      } else {
        ffmpeg_cmd = ['-i', input, '-c', 'copy', output];
      }
    } else if (file_type.startsWith('audio/')) {
      // Audio conversion
      if (to === 'mp3') {
        ffmpeg_cmd = ['-i', input, '-codec:a', 'libmp3lame', '-b:a', '192k', output];
      } else if (to === 'wav') {
        ffmpeg_cmd = ['-i', input, '-codec:a', 'pcm_s16le', output];
      } else {
        ffmpeg_cmd = ['-i', input, '-codec:a', 'copy', output];
      }
    } else {
      // Fallback for other file types
      ffmpeg_cmd = ['-i', input, output];
    }

    // execute cmd
    await ffmpeg.exec(ffmpeg_cmd);

    // Read the output file
    const data = (await ffmpeg.readFile(output)) as any;
    
    // Clean up - remove files from FFmpeg's virtual file system
    try {
      await ffmpeg.deleteFile(input);
      await ffmpeg.deleteFile(output);
    } catch (cleanupError) {
      console.warn('Failed to cleanup files:', cleanupError);
    }
    
    const blob = new Blob([data], { type: file_type.split('/')[0] });
    const url = URL.createObjectURL(blob);
    return { url, output };
    
  } catch (error) {
    // Clean up input file if it exists
    try {
      await ffmpeg.deleteFile(input);
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
    throw error;
  }
}