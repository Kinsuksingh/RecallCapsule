import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding-top: 100px;
  text-align: center;
`;

const Content = styled.div`
  max-width: 800px;
  width: 100%;
`;

const Title = styled(motion.h1)`
  font-size: 4.5rem;
  margin-bottom: 24px;
  background: linear-gradient(180deg, #000000 0%, #64748B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
`;

const PrimaryBtn = styled(motion.button)`
  background: var(--primary);
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const ArrowWrapper = styled(motion.span)`
  display: inline-flex;
  align-items: center;
`;

const arrowVariants = {
  initial: { x: 0 },
  hover: { x: 6 }
};

const Hero = () => {
  return (
    <HeroSection id="home">
      <Content>
          <Title
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Master Any Subject with AI Precision...
          </Title>
          <Description
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Unlock your full potential with RecallCapsule. Our AI-driven curriculum adapts to your pace, ensuring you retain knowledge forever.
          </Description>
          <ButtonGroup>
            <Link to="/capsules">
              <PrimaryBtn
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                whileHover="hover"
                whileTap={{ scale: 0.96 }}
              >
                Start Learning
                <ArrowWrapper
                  variants={arrowVariants}
                  transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                >
                  <ArrowRight size={18} />
                </ArrowWrapper>
              </PrimaryBtn>
            </Link>
          </ButtonGroup>
      </Content>
    </HeroSection>
  );
};


export default Hero;
