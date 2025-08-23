
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface VideoPlayerProps {
  videoUrl: string;
  prompt: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, prompt }) => {
  const downloadFilename = prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.mp4';
  
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <video
        src={videoUrl}
        controls
        autoPlay
        loop
        className="w-full max-w-full rounded-lg shadow-2xl"
      />
      <a
        href={videoUrl}
        download={downloadFilename}
        className="w-full max-w-sm mt-4 inline-flex items-center justify-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:scale-105 transform transition-all duration-300"
      >
        <DownloadIcon className="w-5 h-5 mr-2" />
        Download Video
      </a>
    </div>
  );
};

export default VideoPlayer;
