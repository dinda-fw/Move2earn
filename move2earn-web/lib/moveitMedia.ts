export interface MoveItMediaItem {
  type: 'video' | 'image';
  filename: string;
  url: string;
  fallbackUrl: string;
  title: string;
  instructions: string;
}

export interface MoveItMediaRegistry {
  video: MoveItMediaItem | null;
  images: MoveItMediaItem[];
}

export const DEFAULT_MOVEIT_VIDEO: MoveItMediaItem = {
  type: 'video',
  filename: 'videomoveit.mp4',
  url: '/api/moveit-media/videomoveit.mp4',
  fallbackUrl: '/media/videomoveit.mp4',
  title: 'MoveIt Dynamic Cardio Motion',
  instructions: 'Ikuti irama gerakan aerobik instruktur pada video untuk membuka blokir layar HP!'
};

export const DEFAULT_MOVEIT_IMAGES: MoveItMediaItem[] = [
  {
    type: 'image',
    filename: 'plank.jpeg',
    url: '/api/moveit-media/plank.jpeg',
    fallbackUrl: '/media/plank.jpeg',
    title: 'Core Plank Hold',
    instructions: 'Tahan postur plank dengan siku sejajar bahu, punggung lurus, dan kunci otot perut!'
  }
];

/**
 * Fetch dynamic list of media from components/media via API
 */
export async function fetchMoveItMedia(): Promise<MoveItMediaRegistry> {
  try {
    const res = await fetch('/api/moveit-media', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load media');
    const data = await res.json();
    return {
      video: data.video || DEFAULT_MOVEIT_VIDEO,
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : DEFAULT_MOVEIT_IMAGES
    };
  } catch {
    return {
      video: DEFAULT_MOVEIT_VIDEO,
      images: DEFAULT_MOVEIT_IMAGES
    };
  }
}

/**
 * Determine MoveIt media based on user rule:
 * - Session 1 (First session): Prioritizes Video (videomoveit.mp4).
 * - Session 2+ (1 hour later / subsequent sessions): Randomly selected image from components/media.
 */
export function getMediaForSession(
  sessionNumber: number,
  registry: MoveItMediaRegistry
): MoveItMediaItem {
  // Session 1: Prioritize Video
  if (sessionNumber <= 1 && registry.video) {
    return registry.video;
  }

  // Session 2+: Random image from available images
  if (registry.images && registry.images.length > 0) {
    const randomIndex = Math.floor(Math.random() * registry.images.length);
    return registry.images[randomIndex];
  }

  // Fallback to video if no images available
  return registry.video || DEFAULT_MOVEIT_VIDEO;
}
