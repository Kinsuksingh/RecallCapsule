import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Search, Clock, BarChart, PlayCircle } from 'lucide-react';
import Loader from '../components/Loader';
import dummyLabs from '../data/dummylabs.json';

const PageWrapper = styled.div`
  padding: 100px 5% 50px;
  max-width: 1200px;
  margin: 0 auto;
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

const LabGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
`;

const LabCard = styled(motion.div)`
  background: var(--white);
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  cursor: pointer;
  overflow: hidden;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: stretch;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;

  @media (min-width: 768px) {
    width: 320px;
    height: auto;
    min-height: 100%;
  }
`;

const CardContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`;

const LabTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: ${props => props.$accentColor ? `${props.$accentColor}1A` : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 100px;
  font-size: 0.8rem;
  color: ${props => props.$accentColor || 'var(--text-light)'};
  font-weight: 600;
`;

const LabTitle = styled.h3`
  font-size: 1.4rem;
  color: var(--text);
  margin: 0;
`;

const LabDescription = styled.p`
  font-size: 0.95rem;
  color: var(--text-light);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
`;

const LabMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const PremiumBtn = styled.button`
  margin-top: 10px;
  width: 100%;
  padding: 14px 24px;
  border-radius: 12px;
  background: ${props => props.$lightColor || 'rgba(0,0,0,0.05)'};
  color: ${props => props.$accentColor || 'var(--primary)'};
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    width: fit-content;
    margin-top: auto;
    align-self: flex-start;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0; left: -100%; width: 50%; height: 100%;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent);
    transform: skewX(-20deg);
    transition: 0.5s;
  }

  &:hover {
    box-shadow: 0 8px 25px ${props => props.$accentColor ? props.$accentColor + '44' : 'rgba(79, 70, 229, 0.2)'};
    transform: translateY(-2px);
    border-color: ${props => props.$accentColor ? props.$accentColor + '88' : 'transparent'};
  }

  &:hover::before {
    left: 150%;
  }
`;

const LabsPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredLabs = dummyLabs.filter(lab => 
    lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)' }}>
        <Loader message="Calibrating virtual environment instruments..." icon={<FlaskConical size={28} />} />
      </div>
    );
  }

  return (
    <PageWrapper>
      <Header>
        <div>
          <h3 style={{ marginBottom: '10px', fontSize: '2.0rem'}}>Virtual Labs</h3>
          <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>
            Experiment without limits. Safe, interactive, and highly detailed scientific simulations.
          </p>
        </div>
        <SearchBar>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search experiments, subjects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>
      </Header>

      <LabGrid layout>
        <AnimatePresence mode='popLayout'>
          {filteredLabs.map((lab) => (
            <LabCard
              key={lab.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <CardImage src={lab.image} />
              <CardContent>
                <div>
                  <LabTag $accentColor={lab.color}><FlaskConical size={12} /> {lab.subject}</LabTag>
                </div>
                <LabTitle>{lab.title}</LabTitle>
                <LabDescription>{lab.description}</LabDescription>
                <LabMeta>
                  <LabTag><BarChart size={12} /> {lab.difficulty}</LabTag>
                  <LabTag><Clock size={12} /> {lab.duration}</LabTag>
                </LabMeta>
                <PremiumBtn $accentColor={lab.color} $lightColor={lab.lightColor}>
                  <PlayCircle size={18} /> Launch Lab
                </PremiumBtn>
              </CardContent>
            </LabCard>
          ))}
        </AnimatePresence>
      </LabGrid>

      {filteredLabs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <FlaskConical size={48} style={{ color: 'var(--glass-border)', marginBottom: '16px' }} />
          <h3>No experiments found matching your search.</h3>
        </div>
      )}
    </PageWrapper>
  );
};

export default LabsPage;
