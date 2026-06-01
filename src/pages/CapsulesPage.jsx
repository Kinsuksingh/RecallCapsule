import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BookOpen, GraduationCap, Tag } from 'lucide-react';
import Loader from '../components/Loader';
import CapsuleModal from '../components/CapsuleModal';
import dummyCapsules from '../data/capsules.json';

const PageWrapper = styled.div`
  padding: 100px 5% 50px;
  max-width: 1400px;
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

const Controls = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const SearchBar = styled.div`
  flex: 1;
  position: relative;
  min-width: 300px;

  input {
    width: 100%;
    padding: 14px 20px 14px 50px;
    border-radius: 12px;
    border: 1px solid var(--glass-border);
    background: var(--glass);
    backdrop-filter: blur(10px);
    font-family: inherit;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
    }
  }

  svg {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-light);
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Select = styled.select`
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  background: var(--glass);
  backdrop-filter: blur(10px);
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const CapsuleGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const CapsuleCard = styled(motion.div)`
  background: var(--white);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CapsuleTag = styled.div`
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

const CapsuleTitle = styled.h3`
  font-size: 1.4rem;
  color: var(--text);
  margin: 0;
`;

const CapsuleDescription = styled.p`
  font-size: 0.95rem;
  color: var(--text-light);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CapsuleMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: auto;
`;



const CapsulesPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [selectedGrade, setSelectedGrade] = useState('All Grades');
  const [selectedCapsule, setSelectedCapsule] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const topics = useMemo(() => ['All Topics', ...new Set(dummyCapsules.map(c => c.topic))], []);
  const grades = useMemo(() => ['All Grades', ...new Set(dummyCapsules.map(c => c.grade))].sort(), []);

  const filteredCapsules = useMemo(() => {
    return dummyCapsules.filter(capsule => {
      const matchesSearch = capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           capsule.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTopic = selectedTopic === 'All Topics' || capsule.topic === selectedTopic;
      const matchesGrade = selectedGrade === 'All Grades' || capsule.grade === selectedGrade;
      return matchesSearch && matchesTopic && matchesGrade;
    });
  }, [searchQuery, selectedTopic, selectedGrade]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)' }}>
        <Loader message="Synthesizing digital brain capsules..." />
      </div>
    );
  }

  return (
    <PageWrapper>
      <Header>
        <div>
          <h3 style={{ marginBottom: '10px', fontSize: '2.0rem'}}>Learning Capsules</h3>
          <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>
            Explore our collection of AI-crafted educational modules.
          </p>
        </div>
        <Controls>
          <SearchBar>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search topic, title, or keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>

          <FilterGroup>
            <Select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
              {topics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
            </Select>
            <Select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
              {grades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
            </Select>
          </FilterGroup>
        </Controls>
      </Header>

      <CapsuleGrid layout>
        <AnimatePresence mode='popLayout'>
          {filteredCapsules.map((capsule) => (
            <CapsuleCard
              key={capsule.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedCapsule(capsule)}
            >
              <CapsuleTag $accentColor={capsule.color}><Tag size={12} /> {capsule.topic}</CapsuleTag>
              <CapsuleTitle>{capsule.title}</CapsuleTitle>
              <CapsuleDescription>{capsule.description}</CapsuleDescription>
              <CapsuleMeta>
                <CapsuleTag><GraduationCap size={12} /> {capsule.grade}</CapsuleTag>
                <CapsuleTag><BookOpen size={12} /> {capsule.book}</CapsuleTag>
              </CapsuleMeta>
            </CapsuleCard>
          ))}
        </AnimatePresence>
      </CapsuleGrid>

      {filteredCapsules.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <h3>No capsules found matching your criteria.</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}

      {selectedCapsule && (
        <CapsuleModal 
          capsule={selectedCapsule} 
          onClose={() => setSelectedCapsule(null)} 
        />
      )}
    </PageWrapper>
  );
};

export default CapsulesPage;
