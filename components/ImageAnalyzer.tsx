
import React, { useState, useCallback } from 'react';
import { analyzeImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/imageUtils';
import Card from './shared/Card';
import Button from './shared/Button';
import Loader from './shared/Loader';
import { UploadIcon } from './shared/Icons';
import { FeatureID } from '../types';

const AUTOMATIC_PATTERN_PROMPT = `Analyze this stock chart image. Identify any common technical analysis patterns such as Head and Shoulders, Double Top, Double Bottom, Ascending Triangle, Descending Triangle, or Pennant. If a pattern is found, name it and briefly describe its implications (bullish or bearish). If no clear pattern is visible, state that.`;

interface ImageAnalyzerProps {
  onNavigate?: (id: FeatureID) => void;
}

const ImageAnalyzer: React.FC<ImageAnalyzerProps> = () => {
  const [prompt, setPrompt] = useState<string>('Identify the chart pattern and suggest the next likely price movement.');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [customResult, setCustomResult] = useState<string>('');
  const [patternResult, setPatternResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setCustomResult('');
      setPatternResult('');
      setError('');
    }
  };

  const handleAnalysis = useCallback(async () => {
    if (!image || !prompt.trim()) {
      setError('Please upload an image and provide a prompt.');
      return;
    }

    setIsLoading(true);
    setError('');
    setCustomResult('');
    setPatternResult('');

    try {
      const { base64, mimeType } = await fileToBase64(image);
      
      const [customAnalysisResult, patternAnalysisResult] = await Promise.all([
        analyzeImage(prompt, base64, mimeType),
        analyzeImage(AUTOMATIC_PATTERN_PROMPT, base64, mimeType)
      ]);

      setCustomResult(customAnalysisResult);
      setPatternResult(patternAnalysisResult);

    } catch (err) {
      setError('An error occurred during image analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [image, prompt]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <Card.Header>Upload Chart Image</Card.Header>
          <Card.Body>
            <label htmlFor="image-upload" className="cursor-pointer block w-full p-6 border-2 border-dashed border-[#30363D] rounded-md text-center hover:border-[#25D366] transition">
              {preview ? (
                <img src={preview} alt="Chart preview" className="max-h-60 mx-auto rounded-md" />
              ) : (
                <div className="text-[#8B949E]">
                  <UploadIcon className="h-12 w-12 mx-auto" />
                  <p className="mt-2">Click to upload an image</p>
                  <p className="text-xs">PNG, JPG, WEBP up to 10MB</p>
                </div>
              )}
            </label>
            <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>Custom Analysis Prompt</Card.Header>
          <Card.Body>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Is this a bullish or bearish pattern?"
              className="w-full h-24 p-3 bg-[#0D1117] border border-[#30363D] rounded-md focus:ring-2 focus:ring-[#25D366] focus:outline-none transition text-[#E6EDF3]"
              disabled={isLoading}
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={handleAnalysis} disabled={isLoading || !image}>
                {isLoading ? <Loader size="sm" /> : 'Analyze Image'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
      <div className="space-y-6">
        {error && <p className="text-red-400 text-center bg-[#161B22] p-4 rounded-lg">{error}</p>}
        
        {isLoading && (
            <Card>
                <Card.Body>
                    <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
                        <Loader />
                        <p className="mt-4 text-[#8B949E]">Running dual analysis...</p>
                    </div>
                </Card.Body>
            </Card>
        )}

        {!isLoading && !customResult && !patternResult && !error && (
            <Card>
                <Card.Body>
                    <div className="text-center py-20 text-[#8B949E] min-h-[400px] flex items-center justify-center">
                        <p>Analysis results will appear here.</p>
                    </div>
                </Card.Body>
            </Card>
        )}
        
        {customResult && (
            <Card>
                <Card.Header>Custom Analysis</Card.Header>
                <Card.Body className="min-h-[150px]">
                    <div className="prose prose-invert prose-sm max-w-none text-[#E6EDF3] whitespace-pre-wrap">{customResult}</div>
                </Card.Body>
            </Card>
        )}

        {patternResult && (
            <Card>
                <Card.Header>Automatic Pattern Detection</Card.Header>
                <Card.Body className="min-h-[150px]">
                     <div className="prose prose-invert prose-sm max-w-none text-[#E6EDF3] whitespace-pre-wrap">{patternResult}</div>
                </Card.Body>
            </Card>
        )}

      </div>
    </div>
  );
};

export default ImageAnalyzer;
