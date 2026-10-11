import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function formatExerciseTitle(filename: string): string {
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
  const clean = nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/videomoveit/i, 'MoveIt Cardio Workout')
    .replace(/plank/i, 'Plank Core Hold');
  
  return clean
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function getExerciseInstructions(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes('plank')) {
    return 'Tahan postur plank dengan siku sejajar bahu, punggung lurus, dan kunci otot inti perut Anda.';
  }
  if (lower.includes('squat')) {
    return 'Lakukan gerakan squat dengan punggung tegak dan dorong pinggul ke belakang secara stabil.';
  }
  if (lower.includes('pushup') || lower.includes('push-up')) {
    return 'Lakukan push-up dengan tangan selebar bahu dan turunkan dada hingga hampir menyentuh lantai.';
  }
  if (lower.includes('video')) {
    return 'Ikuti gerakan ritmis instruktur pada video untuk membakar kalori dan membuka blokir layar!';
  }
  return 'Tirukan postur gerakan pada arahan visual ini dan posisikan tubuh Anda di depan kamera.';
}

export async function GET() {
  try {
    const componentsMediaPath = path.join(process.cwd(), 'components', 'media');
    const publicMediaPath = path.join(process.cwd(), 'public', 'media');

    const mediaDir = fs.existsSync(componentsMediaPath) 
      ? componentsMediaPath 
      : (fs.existsSync(publicMediaPath) ? publicMediaPath : null);

    if (!mediaDir) {
      return NextResponse.json({
        success: false,
        error: 'Media directory not found',
        video: null,
        images: []
      });
    }

    const files = await fs.promises.readdir(mediaDir);

    const videoExts = ['.mp4', '.webm', '.mov', '.ogg'];
    const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];

    const videoFiles = files.filter(f => videoExts.includes(path.extname(f).toLowerCase()));
    const imageFiles = files.filter(f => imageExts.includes(path.extname(f).toLowerCase()));

    // Prioritize videomoveit.mp4 or first video found
    const primaryVideoFilename = videoFiles.find(f => f.toLowerCase().includes('videomoveit')) || videoFiles[0] || null;

    const videoData = primaryVideoFilename ? {
      type: 'video' as const,
      filename: primaryVideoFilename,
      url: `/api/moveit-media/${primaryVideoFilename}`,
      fallbackUrl: `/media/${primaryVideoFilename}`,
      title: formatExerciseTitle(primaryVideoFilename),
      instructions: getExerciseInstructions(primaryVideoFilename)
    } : null;

    const imageData = imageFiles.map(imgFilename => ({
      type: 'image' as const,
      filename: imgFilename,
      url: `/api/moveit-media/${imgFilename}`,
      fallbackUrl: `/media/${imgFilename}`,
      title: formatExerciseTitle(imgFilename),
      instructions: getExerciseInstructions(imgFilename)
    }));

    return NextResponse.json({
      success: true,
      count: {
        videos: videoFiles.length,
        images: imageFiles.length
      },
      video: videoData,
      images: imageData
    });
  } catch (error: any) {
    console.error('Error scanning MoveIt media:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to list media' },
      { status: 500 }
    );
  }
}
