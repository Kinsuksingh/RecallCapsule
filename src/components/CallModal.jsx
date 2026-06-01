import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneOff, User } from 'lucide-react';
import { useTutorAgent } from '../hooks/useTutorAgent';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalCard = styled(motion.div)`
  background: var(--white);
  width: 90%;
  max-width: 450px;
  height: 80vh;
  max-height: 700px;
  border-radius: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const Header = styled.div`
  padding: 30px 20px 20px;
  text-align: center;
  z-index: 10;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  color: var(--text);
  margin-bottom: 4px;
`;

const Subtitle = styled.div`
  font-size: 0.9rem;
  color: var(--text-light);
  font-weight: 500;
`;

const VisualizerContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.5); opacity: 0.2; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const CircleWave = styled.div`
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.$isAi ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)'};
  z-index: 1;
  
  ${props => props.$active && css`
    animation: ${pulseAnimation} 2s infinite ease-in-out;
    animation-delay: ${props.$delay || '0s'};
  `}
`;

const AvatarCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--background);
  border: 4px solid ${props => props.$isAi ? '#3b82f6' : '#22c55e'};
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px -5px ${props => props.$isAi ? 'rgba(59, 130, 246, 0.4)' : 'rgba(34, 197, 94, 0.4)'};
  transition: all 0.3s ease;
`;

const TranscriptArea = styled.div`
  padding: 20px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
  z-index: 10;
`;

const StatusText = styled(motion.div)`
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-light);
  margin-bottom: 8px;
  font-weight: 600;
`;



const ControlsContainer = styled.div`
  padding: 30px;
  display: flex;
  justify-content: center;
  gap: 24px;
  background: #f8fafc;
  border-top: 1px solid var(--glass-border);
  z-index: 10;
`;

const ControlButton = styled(motion.button)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: ${props => props.$danger ? '#ef4444' : (props.$muted ? '#64748b' : '#3b82f6')};
  box-shadow: 0 10px 15px -3px ${props => props.$danger ? 'rgba(239, 68, 68, 0.3)' : (props.$muted ? 'rgba(100, 116, 139, 0.3)' : 'rgba(59, 130, 246, 0.3)')};
  border: none;
  cursor: pointer;
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 8px;
  font-weight: 500;
`;

const CallModal = ({ chat, onClose }) => {
  const {
    isListening,
    isThinking,
    isSpeaking,
    currentUserText,
    currentAiText,
    error,
    startListening,
    stopInteraction
  } = useTutorAgent(chat);

  const handleClose = () => {
    stopInteraction();
    onClose();
  };

  const isAnySpeaking = isSpeaking || isListening;

  let statusMessage = "Tap mic to speak";
  if (isListening) statusMessage = "Listening...";
  if (isThinking) statusMessage = "Thinking...";
  if (isSpeaking) statusMessage = "AI is speaking...";



  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <ModalCard
          initial={{ scale: 0.9, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Header>
            <Title>{chat.tutorName}</Title>
            <Subtitle>{chat.subject} Expert</Subtitle>
          </Header>

          <VisualizerContainer>
            {/* Visualizer rings */}
            <CircleWave $active={isAnySpeaking} $isAi={isSpeaking || isThinking} />
            <CircleWave $active={isAnySpeaking} $isAi={isSpeaking || isThinking} $delay="0.6s" />
            <CircleWave $active={isAnySpeaking} $isAi={isSpeaking || isThinking} $delay="1.2s" />
            
            <AvatarCircle $isAi={isSpeaking || isThinking}>
              <User size={48} color={isSpeaking || isThinking ? '#3b82f6' : (isListening ? '#22c55e' : 'var(--text-light)')} />
            </AvatarCircle>
          </VisualizerContainer>

          <TranscriptArea>
            <AnimatePresence mode="wait">
              <motion.div
                key={statusMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <StatusText>
                  {statusMessage}
                </StatusText>
                {error && <ErrorText>{error}</ErrorText>}
              </motion.div>
            </AnimatePresence>
          </TranscriptArea>

          <ControlsContainer>
            <ControlButton 
              $muted={!isListening}
              onClick={() => isListening ? stopInteraction() : startListening()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {!isListening ? <MicOff size={28} /> : <Mic size={28} />}
            </ControlButton>
            
            <ControlButton 
              $danger 
              onClick={handleClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PhoneOff size={28} />
            </ControlButton>
          </ControlsContainer>
        </ModalCard>
      </Overlay>
    </AnimatePresence>
  );
};

export default CallModal;
