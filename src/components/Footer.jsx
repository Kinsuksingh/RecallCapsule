import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BsCapsule } from 'react-icons/bs';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { Copyright } from 'lucide-react';

const FooterContainer = styled.footer`
  padding: 80px 5% 40px;
  background: #0f172a;
  border-top: 1px solid rgba(255,255,255,0.05);
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 568px) {
    grid-template-columns: 1fr;
  }
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Kite One', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #f8fafc;
`;

const Description = styled.p`
  color: #94a3b8;
  line-height: 1.6;
  max-width: 300px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 10px;
`;

const SocialIcon = styled(motion.a)`
  color: #94a3b8;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary);
  }
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h4 {
    font-family: inherit;
    font-size: 1.1rem;
    color: #f8fafc;
  }
`;

const StyledLink = styled(Link)`
  color: #94a3b8;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary);
    padding-left: 4px;
  }
`;

const BottomBar = styled.div`
  max-width: 1400px;
  margin: 60px auto 0;
  padding-top: 30px;
  border-top: 1px solid rgba(255,255,255,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #64748b;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    text-align: center;
    margin-bottom: 60px; /* Space for mobile nav */
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <BrandSection>
          <Logo>
            <BsCapsule size={24} />
            RecallCapsule
          </Logo>
          <Description>
            The world's most advanced AI-driven learning platform. Master subjects faster and retain knowledge forever.
          </Description>
          <SocialLinks>
            <SocialIcon href="https://github.com/Kinsuksingh" target="_blank" rel="noopener noreferrer" whileHover={{ y: -3 }}><FaGithub size={20} /></SocialIcon>
            <SocialIcon href="https://www.linkedin.com/in/kinsuk-singh" target="_blank" rel="noopener noreferrer" whileHover={{ y: -3 }}><FaLinkedinIn size={20} /></SocialIcon>
          </SocialLinks>
        </BrandSection>

        <LinkGroup>
          <h4>Product</h4>
          <StyledLink to="/capsules">Learning Capsules</StyledLink>
          <StyledLink to="/labs">Virtual Labs</StyledLink>
          <StyledLink to="/chats">AI Tutors</StyledLink>
        </LinkGroup>

        <LinkGroup>
          <h4>Company</h4>
          <StyledLink to="#">About Us</StyledLink>
          <StyledLink to="#">Blog</StyledLink>
        </LinkGroup>

        <LinkGroup>
          <h4>Legal</h4>
          <StyledLink to="#">Privacy Policy</StyledLink>
          <StyledLink to="#">Terms of Service</StyledLink>
          <StyledLink to="#">Cookie Policy</StyledLink>
        </LinkGroup>
      </FooterContent>

      <BottomBar>
        <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Copyright size={14} /> 2026 RecallCapsule. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Status: All systems operational</span>
        </div>
      </BottomBar>
    </FooterContainer>
  );
};

export default Footer;
