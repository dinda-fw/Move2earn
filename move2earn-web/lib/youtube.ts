/**
 * YouTube Embed Helper inspired by workout.cool (MIT License)
 * Converts various YouTube URL formats (watch?v=, youtu.be, embed, shorts)
 * into privacy-friendly embeddable URLs via youtube-nocookie.com
 */

interface YouTubeEmbedOptions {
  autoplay?: boolean;
  mute?: boolean;
}

export function getYouTubeEmbedUrl(url?: string | null, options: YouTubeEmbedOptions = {}): string | null {
  if (!url) return null;

  let videoId: string | null = null;

  try {
    const urlObject = new URL(url);
    const hostname = urlObject.hostname.toLowerCase();
    const pathname = urlObject.pathname;
    const searchParams = urlObject.searchParams;

    // 1. Standard watch URL (youtube.com/watch?v=...)
    if (hostname.includes('youtube.com') && pathname === '/watch') {
      videoId = searchParams.get('v');
    }
    // 2. Short URL (youtu.be/...)
    else if (hostname === 'youtu.be' || hostname.includes('youtu.be')) {
      videoId = pathname.substring(1).split('/')[0];
    }
    // 3. Existing Embed URL (/embed/...)
    else if (hostname.includes('youtube.com') && pathname.startsWith('/embed/')) {
      videoId = pathname.substring('/embed/'.length).split('/')[0];
    }
    // 4. Shorts URL (/shorts/...)
    else if (hostname.includes('youtube.com') && pathname.startsWith('/shorts/')) {
      videoId = pathname.substring('/shorts/'.length).split('/')[0];
    }
  } catch {
    // If not a full URL, check if it's directly a valid YouTube 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      videoId = url;
    }
  }

  if (!videoId) return null;

  const baseEmbedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
  const queryParams = new URLSearchParams();

  if (options.autoplay) {
    queryParams.set('autoplay', '1');
  }
  if (options.mute) {
    queryParams.set('mute', '1');
  }

  // Performance and privacy params
  queryParams.set('rel', '0');
  queryParams.set('modestbranding', '1');
  queryParams.set('playsinline', '1');

  const queryString = queryParams.toString();
  return queryString ? `${baseEmbedUrl}?${queryString}` : baseEmbedUrl;
}

/**
 * Get YouTube Thumbnail URL with high quality fallback
 */
export function getYouTubeThumbnailUrl(videoUrlOrId?: string | null): string | null {
  if (!videoUrlOrId) return null;

  let videoId: string | null = null;

  try {
    const urlObject = new URL(videoUrlOrId);
    const hostname = urlObject.hostname.toLowerCase();
    const pathname = urlObject.pathname;
    const searchParams = urlObject.searchParams;

    if (hostname.includes('youtube.com') && pathname === '/watch') {
      videoId = searchParams.get('v');
    } else if (hostname === 'youtu.be' || hostname.includes('youtu.be')) {
      videoId = pathname.substring(1).split('/')[0];
    } else if (hostname.includes('youtube.com') && (pathname.startsWith('/embed/') || pathname.startsWith('/shorts/'))) {
      videoId = pathname.split('/')[2];
    }
  } catch {
    if (/^[a-zA-Z0-9_-]{11}$/.test(videoUrlOrId)) {
      videoId = videoUrlOrId;
    }
  }

  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
