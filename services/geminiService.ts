import { GoogleGenAI } from "@google/genai";
import { type AspectRatio } from '../types';

interface GenerateVideoParams {
  prompt: string;
  image?: {
    base64Data: string;
    mimeType: string;
  };
  aspectRatio: AspectRatio;
  onProgress: (message: string) => void;
}

// DEBUG: Log all environment variables with details
console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
console.log('import.meta.env:', import.meta.env);
console.log('VITE_API_KEY:', import.meta.env.VITE_API_KEY);
console.log('VITE_GEMINI_API_KEY:', import.meta.env.VITE_GEMINI_API_KEY);
console.log('API_KEY:', import.meta.env.API_KEY);
console.log('GEMINI_API_KEY:', import.meta.env.GEMINI_API_KEY);
console.log('All keys in import.meta.env:', Object.keys(import.meta.env));

// Fix: Check multiple possible environment variable names
const API_KEY = import.meta.env.VITE_API_KEY || 
                import.meta.env.VITE_GEMINI_API_KEY || 
                import.meta.env.API_KEY || 
                import.meta.env.GEMINI_API_KEY;

console.log('Final API_KEY value:', API_KEY ? 'Found (hidden for security)' : 'NOT FOUND');

if (!API_KEY) {
  console.error('Available environment variables:', import.meta.env);
  throw new Error("API_KEY environment variable not set. Please set VITE_API_KEY or VITE_GEMINI_API_KEY in Vercel environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const generateVideo = async ({ prompt, image, aspectRatio, onProgress }: GenerateVideoParams): Promise<string> => {
  onProgress("Starting video generation process...");

  const generateVideosParams: any = {
      model: 'veo-3.0-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
        // The VEO API currently does not support aspect ratio, but we include it for future compatibility
        // aspectRatio: aspectRatio,
      }
  };
  
  if (image) {
      generateVideosParams.image = {
          imageBytes: image.base64Data,
          mimeType: image.mimeType,
      };
  }

  let operation = await ai.models.generateVideos(generateVideosParams);
  
  onProgress("Video generation job submitted. Waiting for completion...");

  while (!operation.done) {
    await sleep(10000); // Poll every 10 seconds
    try {
        operation = await ai.operations.getVideosOperation({ operation: operation });
        const progress = operation.metadata?.progressPercentage;
        if(progress) {
             onProgress(`Rendering video... ${Math.round(progress)}% complete.`);
        } else {
             onProgress("Processing video, please wait...");
        }
    } catch(e) {
        console.error("Error polling for video operation status:", e);
        throw new Error("Failed to get video generation status.");
    }
  }

  onProgress("Finalizing video render...");

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error("Video generation completed, but no download link was found.");
  }

  onProgress("Downloading generated video...");
  const response = await fetch(`${downloadLink}&key=${API_KEY}`);

  if (!response.ok) {
    throw new Error(`Failed to download the video. Status: ${response.statusText}`);
  }

  const videoBlob = await response.blob();
  const videoUrl = URL.createObjectURL(videoBlob);
  
  onProgress("Video ready!");
  
  return videoUrl;
};
