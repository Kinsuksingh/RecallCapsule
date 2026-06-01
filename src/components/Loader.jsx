import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { BsCapsule } from 'react-icons/bs';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
`;

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: ${props => props.$fullPage ? '100vh' : '400px'};
  width: 100%;
  background: ${props => props.$fullPage ? 'var(--background)' : 'transparent'};
  position: ${props => props.$fullPage ? 'fixed' : 'relative'};
  top: 0;
  left: 0;
  z-index: 999;
  backdrop-filter: ${props => props.$fullPage ? 'blur(5px)' : 'none'};
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OuterRing = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  border-top-color: var(--primary);
  border-bottom-color: var(--primary-light);
  border-radius: 50%;
  animation: ${spin} 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
`;

const InnerRing = styled.div`
  position: absolute;
  width: 75%;
  height: 75%;
  border: 2px solid transparent;
  border-left-color: #94a3b8;
  border-right-color: #cbd5e1;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite reverse;
`;

const IconPulse = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingText = styled(motion.p)`
  margin-top: 24px;
  font-family: 'Kite One', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  font-weight: 500;
  letter-spacing: 0.05em;
  text-align: center;
`;

const Loader = ({ message = 'Loading...', fullPage = false, icon = <BsCapsule size={28} /> }) => {
  return (
    <LoaderWrapper $fullPage={fullPage}>
      <SpinnerContainer>
        <OuterRing />
        <InnerRing />
        <IconPulse>
          {icon}
        </IconPulse>
      </SpinnerContainer>
      <LoadingText
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {message}
      </LoadingText>
    </LoaderWrapper>
  );
};

export default Loader;
