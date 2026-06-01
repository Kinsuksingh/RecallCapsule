import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlayCircle, PauseCircle, Brain, Sparkles } from 'lucide-react';
import { buildMemoryTextPrompt, buildMemoryAudioPrompt } from '../services/promptService';
import { generateTextContent, generateAudioScript } from '../services/aiService';
import { generateVoice } from '../services/voiceService';

const NARRATOR_VOICE_ID = 'FZkK3TvQ0pjyDmT8fzIW';

const wipeText = keyframes`
  0% { background-size: 100% 0%; }
  100% { background-size: 100% 100%; }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(12px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalCard = styled(motion.div)`
  background: var(--white);
  width: 100%;
  max-width: 600px;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 24px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--glass-border);
  background: #f8fafc;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--text);
  
  svg { color: var(--primary); }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  transition: all 0.2s;
  
  &:hover {
    background: #e2e8f0;
    color: var(--text);
  }
`;

const ModalContent = styled.div`
  padding: 40px 30px;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--text-light);
  
  svg {
    animation: spin 3s linear infinite;
  }
  
  @keyframes spin {
    100% { transform: rotate(360deg); }
  }
`;

const HighlightText = styled.div`
  font-size: 1.35rem;
  line-height: 1.6;
  font-weight: 500;
  color: #cbd5e1; /* unhighlighted state */
  margin: 0;

  white-space: pre-wrap;

  * {
    color: inherit;
  }
  
  p, ul, ol, blockquote {
    margin-bottom: 1rem;
  }
  ul, ol {
    padding-left: 20px;
  }
  strong {
    font-weight: 800;
  }

  /* The magic highlighting effect */
  background-color: #cbd5e1; /* Fallback for unhighlighted text */
  background-image: linear-gradient(to bottom, var(--text) 0%, var(--text) 100%);
  background-repeat: no-repeat;
  background-size: 100% 0%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;

  ${props => props.$isAudioReady && props.$isPlaying && css`
    animation: ${wipeText} ${props.$duration}s linear forwards;
  `}
  
  ${props => props.$isAudioReady && !props.$isPlaying && props.$hasPlayed && css`
    background-size: 100% 100%;
  `}
`;

const ControlsContainer = styled.div`
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border-top: 1px solid var(--glass-border);
`;

const AudioStatus = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  span { font-weight: 700; color: var(--text); }
  small { color: var(--text-light); font-size: 0.9rem; }
`;

const PlayButton = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
  
  svg {
    fill: ${props => props.$isPlaying ? 'currentColor' : 'transparent'};
  }
`;

const CapsuleModal = ({ capsule, onClose }) => {
  const [loadingText, setLoadingText] = useState(true);
  const [loadingAudio, setLoadingAudio] = useState(true);
  const [error, setError] = useState(null);
  const [memoryText, setMemoryText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  
  const audioRef = useRef(null);

  useEffect(() => {
    let active = true;

    const fetchAndGenerate = async () => {
      try {
        setLoadingText(true);
        setLoadingAudio(true);
        setError(null);

        // Step 1: Get the Text points
        const txtPrompt = buildMemoryTextPrompt(capsule);
        const txtContent = await generateTextContent(txtPrompt);
        
        if (!active) return;
        setMemoryText(txtContent);
        setLoadingText(false); // Text is ready to display!

        // Step 2: Get the Hinglish audio script
        const audioPrompt = buildMemoryAudioPrompt(txtContent);
        const audioScript = await generateAudioScript(audioPrompt);

        if (!active) return;

        // Step 3: Generate the voice
        const url = await generateVoice(audioScript, NARRATOR_VOICE_ID);
        
        if (!active) return;
        setAudioUrl(url);
        setLoadingAudio(false); // Audio is ready to play!

      } catch (err) {
        console.error("Modal generation failed:", err);
        if (active) setError("Failed to generate memory trick.");
      } finally {
        if (active) {
          setLoadingText(false);
          setLoadingAudio(false);
        }
      }
    };

    fetchAndGenerate();

    return () => {
      active = false;
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [capsule]);

  const handleMetadata = (e) => {
    // When audio loads, we know exactly how long the highlight animation should take
    setAudioDuration(e.target.duration);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      setHasPlayed(true);
    }
    setIsPlaying(!isPlaying);
  };

  const handleEnd = () => {
    setIsPlaying(false);
  };

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ModalCard
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 30 }}
        >
          <ModalHeader>
            <HeaderTitle>
              <Brain size={20} />
              {capsule.title} Memory Trick
            </HeaderTitle>
            <CloseButton onClick={onClose}><X size={24} /></CloseButton>
          </ModalHeader>

          <ModalContent>
            {loadingText && (
              <LoadingState>
                <Sparkles size={40} />
                <p>Synthesizing memory trick...</p>
              </LoadingState>
            )}

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {!loadingText && memoryText && (
              <HighlightText 
                $isAudioReady={audioDuration > 0} 
                $isPlaying={isPlaying}
                $hasPlayed={hasPlayed}
                $duration={audioDuration}
              >
                {memoryText}
              </HighlightText>
            )}
          </ModalContent>

          {!loadingText && memoryText && (
            <ControlsContainer>
              <AudioStatus>
                <span>Listen & Learn</span>
                <small>{loadingAudio ? "Generating audio..." : "Audio syncing active"}</small>
              </AudioStatus>
              
              {!loadingAudio && audioUrl ? (
                <PlayButton
                  $isPlaying={isPlaying}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlay}
                >
                  {isPlaying ? <PauseCircle size={28} /> : <PlayCircle size={28} />}
                </PlayButton>
              ) : (
                <Sparkles size={24} style={{ color: 'var(--text-light)', animation: 'spin 3s linear infinite' }} />
              )}
              
              {audioUrl && (
                <audio 
                  ref={audioRef} 
                  src={audioUrl} 
                  onLoadedMetadata={handleMetadata}
                  onEnded={handleEnd} 
                  style={{ display: 'none' }}
                />
              )}
            </ControlsContainer>
          )}

        </ModalCard>
      </Overlay>
    </AnimatePresence>
  );
};

export default CapsuleModal;
