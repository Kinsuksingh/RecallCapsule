import { useState, useRef, useEffect, useCallback } from 'react';
import { buildSystemPrompt } from '../services/promptService';
import { generateChatResponse } from '../services/aiService';
import { generateVoice, transcribeAudio } from '../services/voiceService';

export const useTutorAgent = (persona) => {
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentAiText, setCurrentAiText] = useState('');
  const [currentUserText, setCurrentUserText] = useState('');
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleUserMessage = async (userText) => {
    if (!userText.trim()) return;
    
    console.log("🗣️ USER SAID:", userText);
    setIsThinking(true);
    setError(null);
    setCurrentAiText('');
    
    try {
      // 1. Generate AI Response
      const systemPrompt = buildSystemPrompt(persona);
      const aiResponseText = await generateChatResponse(systemPrompt, conversationHistory, userText);
      
      console.log("🤖 AI SAID:", aiResponseText);
      setCurrentAiText(aiResponseText);
      
      // Update history
      setConversationHistory(prev => [
        ...prev, 
        { role: 'user', content: userText },
        { role: 'assistant', content: aiResponseText }
      ]);

      setIsThinking(false);
      setIsSpeaking(true);

      // 2. Generate and Play Voice
      const audioUrl = await generateVoice(aiResponseText, persona.voiceId);
      playAudio(audioUrl);

    } catch (err) {
      setIsThinking(false);
      setIsSpeaking(false);
      setError(err.message || 'An error occurred.');
    }
  };

  const playAudio = (url) => {
    const audio = audioRef.current;
    audio.src = url;
    audio.onended = () => {
      setIsSpeaking(false);
    };
    audio.play().catch(e => {
      console.error('Audio playback failed', e);
      setIsSpeaking(false);
      setError('Audio playback failed. Please interact with the page first.');
    });
  };

  const startListening = useCallback(async () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }
    
    setError(null);
    setCurrentUserText('');
    setCurrentAiText('');
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
        
        setIsListening(false);
        setIsThinking(true);
        setCurrentUserText('Transcribing audio...');
        
        // We use audio/webm as it is widely supported for recording in browsers and accepted by ElevenLabs
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        
        try {
          const text = await transcribeAudio(audioBlob);
          setCurrentUserText(text);
          if (text && text.trim()) {
            await handleUserMessage(text);
          } else {
            setIsThinking(false);
            setError("Couldn't hear anything clearly. Please try again.");
          }
        } catch (err) {
          setIsThinking(false);
          setError(err.message || 'Failed to transcribe audio.');
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error('Error accessing microphone', err);
      setError('Microphone access denied or not available.');
    }
  }, [persona, conversationHistory]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const stopInteraction = useCallback(() => {
    stopListening();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsListening(false);
    setIsSpeaking(false);
    setIsThinking(false);
  }, [stopListening]);

  return {
    isListening,
    isThinking,
    isSpeaking,
    currentUserText,
    currentAiText,
    error,
    startListening,
    stopListening,
    stopInteraction,
  };
};
