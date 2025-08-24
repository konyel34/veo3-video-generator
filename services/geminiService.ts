import { GoogleGenAI } from "@google/genai";
import { type AspectRatio } from '../types';

// Ini jadi API Key cadangan/default dari Vercel
const DEFAULT_API_KEY = import.meta.env.VITE_API_KEY;

interface GenerateVideoParams {
  prompt: string;
  userApiKey?: string; // Kita tambahkan parameter ini
  image?: {
    base64Data: string;
    mimeType: string;
  };
  aspectRatio: AspectRatio;
  onProgress: (message: string) => void;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const generateVideo = async ({ prompt, userApiKey, image, aspectRatio, onProgress }: GenerateVideoParams): Promise<string> => {
  
  const apiKeyToUse = userApiKey || DEFAULT_API_KEY;

  if (!apiKeyToUse) {
    throw new Error("API Key not provided. Please provide your own API Key in the input field, or the app owner needs to set a default key.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKeyToUse });

  onProgress("Starting video generation process...");

  const generateVideosParams: any = {
      model: 'veo-3.0-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
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
  // Perhatikan: kita pakai API Key lagi untuk download
  const response = await fetch(`${downloadLink}&key=${apiKeyToUse}`);

  if (!response.ok) {
    throw new Error(`Failed to download the video. Status: ${response.statusText}`);
  }

  const videoBlob = await response.blob();
  const videoUrl = URL.createObjectURL(videoBlob);
  
  onProgress("Video ready!");
  
  return videoUrl;
};