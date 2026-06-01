import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, PhoneCall } from 'lucide-react';
import Loader from '../components/Loader';
import CallModal from '../components/CallModal';
import tutors from '../data/tutorsPersona.json';

const PageWrapper = styled.div`
  padding: 100px 5% 100px;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 80px 4% 100px;
  }
`;

const Header = styled.div`
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
`;

const SearchBar = styled.div`
  position: relative;
  width: 300px;

  @media (max-width: 768px) {
    width: 100%;
  }

  input {
    width: 100%;
    padding: 12px 20px 12px 45px;
    border-radius: 12px;
    border: 1px solid var(--glass-border);
    background: var(--glass);
    backdrop-filter: blur(10px);
    font-family: inherit;
    
    &:focus {
      outline: none;
      border-color: var(--primary);
    }
  }

  svg {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-light);
  }
`;

const CallList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CallItem = styled(motion.div)`
  background: var(--white);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  cursor: \${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: \${props => props.$disabled ? 0.7 : 1};
  position: relative;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 20px;
    flex-direction: column;
    align-items: stretch;
  }

  &:hover {
    border-color: ${props => props.$disabled ? 'var(--glass-border)' : 'var(--primary-light)'};
    box-shadow: ${props => props.$disabled ? '0 4px 20px rgba(0,0,0,0.03)' : '0 10px 30px rgba(79, 70, 229, 0.1)'};
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Avatar = styled.div`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);

  @media (max-width: 768px) {
    width: 55px;
    height: 55px;
  }
`;

const StatusDot = styled.div`
  width: 16px;
  height: 16px;
  background: ${props => props.$isAvailable ? '#22c55e' : '#94a3b8'};
  border-radius: 50%;
  position: absolute;
  bottom: 2px;
  right: 2px;
  border: 3px solid var(--white);
  box-shadow: 0 0 8px ${props => props.$isAvailable ? 'rgba(34, 197, 94, 0.4)' : 'transparent'};
`;

const CallContent = styled.div`
  flex: 1;
`;

const TutorName = styled.h4`
  margin: 0;
  font-size: 1.25rem;
  color: var(--text);
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.15rem;
  }
`;

const StatusText = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.$isAvailable ? 'rgba(34, 197, 94, 0.1)' : 'rgba(148, 163, 184, 0.1)'};
  color: ${props => props.$isAvailable ? '#15803d' : '#64748b'};
`;

const SubjectBadge = styled.div`
  font-size: 0.85rem;
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DescriptionText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-light);
  line-height: 1.5;
`;

const CallActionButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: ${props => props.$isAvailable ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : '#e2e8f0'};
  color: ${props => props.$isAvailable ? 'white' : '#94a3b8'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: ${props => props.$isAvailable ? 'pointer' : 'not-allowed'};
  box-shadow: ${props => props.$isAvailable ? '0 8px 20px rgba(34, 197, 94, 0.3)' : 'none'};
  transition: all 0.3s ease;

  &:hover {
    transform: ${props => props.$isAvailable ? 'scale(1.05) translateY(-2px)' : 'none'};
    box-shadow: ${props => props.$isAvailable ? '0 12px 25px rgba(34, 197, 94, 0.4)' : 'none'};
  }
  
  @media (max-width: 768px) {
    width: 100%;
    border-radius: 12px;
    height: 48px;
    gap: 10px;
    margin-top: 10px;
    
    &::after {
      content: ${props => props.$isAvailable ? "'Call Tutor'" : "'Offline'"};
      font-weight: 600;
      font-size: 1rem;
    }
  }
`;

const CallsPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCall, setActiveCall] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredTutors = tutors.filter(tutor => 
    tutor.tutorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)' }}>
        <Loader message="Connecting secure link to AI tutors..." icon={<PhoneCall size={28} />} />
      </div>
    );
  }

  return (
    <PageWrapper>
      <Header>
        <div>
          <h3 style={{ marginBottom: '10px', fontSize: '2.0rem'}}>Tutor Calls</h3>
          <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>
            Connect with your AI tutors for personalized voice guidance.
          </p>
        </div>
        <SearchBar>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search tutors or subjects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>
      </Header>

      <CallList>
        {filteredTutors.map((tutor) => (
          <CallItem 
            key={tutor.id}
            whileHover={{ scale: tutor.isAvailable ? 1.01 : 1 }}
            whileTap={{ scale: tutor.isAvailable ? 0.99 : 1 }}
            onClick={() => tutor.isAvailable ? setActiveCall(tutor) : null}
            $disabled={!tutor.isAvailable}
          >
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flex: 1 }}>
              <AvatarContainer>
                <Avatar>
                  <User size={30} />
                </Avatar>
                <StatusDot $isAvailable={tutor.isAvailable} />
              </AvatarContainer>

              <CallContent>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <TutorName>{tutor.tutorName}</TutorName>
                  <StatusText $isAvailable={tutor.isAvailable}>
                    {tutor.isAvailable ? 'Available Now' : 'Offline'}
                  </StatusText>
                </div>
                <SubjectBadge>{tutor.subject}</SubjectBadge>
                <DescriptionText>{tutor.description}</DescriptionText>
              </CallContent>
            </div>

            <CallActionButton 
              $isAvailable={tutor.isAvailable}
              onClick={(e) => {
                e.stopPropagation();
                if(tutor.isAvailable) setActiveCall(tutor);
              }}
            >
              <PhoneCall size={22} />
            </CallActionButton>
          </CallItem>
        ))}
      </CallList>

      {filteredTutors.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <PhoneCall size={48} style={{ color: 'var(--glass-border)', marginBottom: '16px' }} />
          <h3>No tutors found</h3>
        </div>
      )}

      <AnimatePresence>
        {activeCall && (
          <CallModal 
            chat={activeCall} 
            onClose={() => setActiveCall(null)} 
          />
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default CallsPage;
