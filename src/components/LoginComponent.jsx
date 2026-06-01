import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../utils/cookieUtils';
import { Lock } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 140px);
  padding: 20px;
`;

const LoginCard = styled(motion.div)`
  background: var(--glass);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const IconWrapper = styled.div`
  background: rgba(79, 70, 229, 0.1);
  color: var(--primary);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-family: 'Kite One', sans-serif;
  color: var(--text);
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: var(--text-light);
  font-size: 0.9rem;
  margin-bottom: 32px;
  text-align: center;
`;

const PinContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
`;

const PinInput = styled.input`
  width: 50px;
  height: 60px;
  border-radius: 12px;
  border: 2px solid ${props => props.$error ? '#ef4444' : 'var(--glass-border)'};
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const ErrorMessage = styled(motion.p)`
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: -20px;
  margin-bottom: 20px;
  height: 20px;
`;

const CORRECT_PIN = "1234";

const LoginComponent = ({ onSuccess }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    setError(false);
    
    const newPin = [...pin];
    newPin[index] = value.substring(value.length - 1);
    setPin(newPin);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }

    if (index === 3 && value) {
      verifyPin([...newPin.slice(0, 3), value].join(''));
    } else if (newPin.every(digit => digit !== '')) {
       verifyPin(newPin.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyPin = (enteredPin) => {
    if (enteredPin === CORRECT_PIN) {
      setCookie('auth_pin', 'true', 1);
      if (onSuccess) onSuccess();
    } else {
      setError(true);
      setTimeout(() => {
        setPin(['', '', '', '']);
        inputRefs.current[0].focus();
      }, 500);
    }
  };

  return (
    <Container>
      <LoginCard
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <IconWrapper>
          <Lock size={32} />
        </IconWrapper>
        <Title>Access Required</Title>
        <Subtitle>
          Please enter your 4-digit PIN to access this area.
          <br /><br />
          <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Demo PIN: 1234</span>
        </Subtitle>

        <PinContainer>
          {pin.map((digit, index) => (
            <PinInput
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              $error={error}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </PinContainer>

        <ErrorMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: error ? 1 : 0 }}
        >
          Incorrect PIN. Please try again.
        </ErrorMessage>
        
      </LoginCard>
    </Container>
  );
};

export default LoginComponent;
