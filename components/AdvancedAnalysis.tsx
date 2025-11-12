
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { getAdvancedAnalysis, generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';
import Card from './shared/Card';
import Button from './shared/Button';
import Loader from './shared/Loader';
import { VolumeUpIcon, StopIcon } from './shared/Icons';

const AdvancedAnalysis: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('Provide a detailed fundamental and technical analysis for Apple Inc. (AAPL), including key financial ratios, support/resistance levels, and a 12-month price target. Suggest a suitable options strategy.');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isTtsLoading, setIsTtsLoading] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Initialize AudioContext on user interaction
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      document.removeEventListener('click', initAudioContext);
    };
    document.addEventListener('click', initAudioContext);
    return () => {
      document.removeEventListener('click', initAudioContext);
      audioSourceRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);

  const handleGenerateAnalysis = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Prompt cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const analysisResult = await getAdvancedAnalysis(prompt);
      setResult(analysisResult);
    } catch (err) {
      setError('An error occurred during advanced analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  const handleTextToSpeech = useCallback(async () => {
    if (!result || isSpeaking) return;

    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      setIsSpeaking(false);
      return;
    }
    
    setIsTtsLoading(true);
    try {
        if (!audioContextRef.current) {
            // Re-initialize if context was closed or never created
             audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

      const audioBase64 = await generateSpeech(result.substring(0, 1000)); // Limit to 1000 chars for performance
      const audioBytes = decode(audioBase64);
      const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => {
        setIsSpeaking(false);
        audioSourceRef.current = null;
      };
      source.start(0);
      audioSourceRef.current = source;
      setIsSpeaking(true);
    } catch (err) {
      console.error('TTS error:', err);
      setError('Failed to generate or play audio.');
    } finally {
      setIsTtsLoading(false);
    }
  }, [result, isSpeaking]);
  
  const stopSpeech = useCallback(() => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      // onended will handle state changes
    }
  }, []);


  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>Deep-Dive AI Analysis</Card.Header>
        <Card.Body>
          <p className="text-[#8B949E] mb-4">Leverage Gemini Pro with an extended thinking budget to tackle your most complex financial questions. Ideal for in-depth research and strategy planning.</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a complex query..."
            className="w-full h-32 p-3 bg-[#0D1117] border border-[#30363D] rounded-md focus:ring-2 focus:ring-[#25D366] focus:outline-none transition text-[#E6EDF3]"
            disabled={isLoading}
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={handleGenerateAnalysis} disabled={isLoading}>
              {isLoading ? <Loader size="sm" /> : 'Engage Thinking Mode'}
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      {error && <p className="text-red-400 text-center">{error}</p>}

      {isLoading && (
        <Card>
          <Card.Body>
            <div className="flex flex-col items-center justify-center p-8">
              <Loader />
              <p className="mt-4 text-[#8B949E]">AI is thinking... this may take a moment.</p>
            </div>
          </Card.Body>
        </Card>
      )}

      {result && (
        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
                <span>Analysis Result</span>
                 <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={isSpeaking ? stopSpeech : handleTextToSpeech}
                    disabled={isTtsLoading}
                 >
                    {isTtsLoading ? <Loader size="sm"/> : isSpeaking ? <StopIcon className="h-5 w-5 mr-1" /> : <VolumeUpIcon className="h-5 w-5 mr-1" />}
                    {isSpeaking ? 'Stop' : 'Read Aloud'}
                 </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="prose prose-invert prose-sm max-w-none text-[#E6EDF3] whitespace-pre-wrap">{result}</div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default AdvancedAnalysis;
