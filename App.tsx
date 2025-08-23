import React, { useState, useEffect, useCallback } from 'react';
import { type AspectRatio, type ImageFile } from './types';
import { generateVideo } from './services/geminiService';
import { LOADING_MESSAGES } from './constants';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import SettingsPanel from './components/SettingsPanel';
import VideoPlayer from './components/VideoPlayer';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [image, setImage] = useState<ImageFile | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) {
      setLoadingMessage(LOADING_MESSAGES[0]);
      let messageIndex = 0;
      const intervalId = setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      }, 4000);
      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const generatedUrl = await generateVideo({
        prompt,
        image: image ? { base64Data: image.base64Data, mimeType: image.mimeType } : undefined,
        aspectRatio,
        onProgress: setLoadingMessage,
      });
      setVideoUrl(generatedUrl);
    } catch (err) {
      console.error('Video generation failed:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during video generation.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, image, aspectRatio, isLoading]);
  
  const isGenerateDisabled = !prompt.trim() || isLoading;

  return (
    <div className="min-h-screen bg-base-100 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input and Settings Column */}
          <div className="flex flex-col gap-6">
            <div className="bg-base-200 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-content-100">1. Describe your video</h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A neon hologram of a cat driving at top speed..."
                className="w-full h-36 p-4 bg-base-300 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200 resize-none placeholder-content-200"
                disabled={isLoading}
              />
            </div>

            <div className="bg-base-200 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-content-100">2. Add a reference image (optional)</h2>
              <ImageUploader image={image} setImage={setImage} disabled={isLoading} />
            </div>
            
            <div className="bg-base-200 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-content-100">3. Configure settings</h2>
              <SettingsPanel aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} disabled={isLoading} />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerateDisabled}
              className={`w-full py-4 px-6 text-lg font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-3
                ${isGenerateDisabled 
                  ? 'bg-base-300 text-content-200 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:shadow-xl hover:scale-105 transform'
              }`}
            >
              {isLoading ? 'Generating...' : 'Generate Video'}
            </button>
          </div>

          {/* Output Column */}
          <div className="bg-base-200 rounded-xl p-6 shadow-lg flex items-center justify-center min-h-[400px] lg:min-h-full">
            {isLoading && <Loader message={loadingMessage} />}
            {!isLoading && error && (
              <div className="text-center text-red-400">
                <h3 className="text-xl font-bold mb-2">Generation Failed</h3>
                <p>{error}</p>
              </div>
            )}
            {!isLoading && !error && videoUrl && (
              <VideoPlayer videoUrl={videoUrl} prompt={prompt} />
            )}
            {!isLoading && !error && !videoUrl && (
              <div className="text-center text-content-200">
                <h3 className="text-2xl font-bold">Your video will appear here</h3>
                <p className="mt-2">Fill out the details on the left and click "Generate Video".</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;