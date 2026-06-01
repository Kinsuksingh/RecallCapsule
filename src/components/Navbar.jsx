import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BsCapsule } from 'react-icons/bs';
import { Menu, Home, FlaskConical, PhoneCall } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5%;
  background: var(--glass);
  backdrop-filter: blur(10px);
  z-index: 1000;
  border-bottom: 1px solid var(--glass-border);
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 1.5rem;
  color: var(--primary);
  text-decoration: none;

  span {
    font-family: 'Kite One', sans-serif;
  }
`;


const NavLinks = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link).withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: ${props => props.active ? '#191919ff' : 'var(--text-light)'};
  background: ${props => props.active ? 'rgba(79, 70, 229, 0.1)' : 'transparent'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;

  &:hover {
    background: rgba(79, 70, 229, 0.05);
    color: ${props => props.active ? '#323235ff' : 'var(--primary)'};
  }
`;


const MobileMenuBtn = styled.button`
  display: none;
  color: var(--text);
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const location = useLocation();

  const handleHamburgerClick = () => {
    console.log("feature coming soon");
  };

  return (
    <Nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Desktop Logo: /home | Mobile Logo: /capsule */}
      <LogoLink to={"/"}>
        <BsCapsule size={18} />
        <span style={{ fontSize: '1.2rem' }}>RecallCapsule</span>
      </LogoLink>


      {/* Desktop Navigation */}
      <NavLinks>
        <NavLink to="/" active={location.pathname === '/'}>
          <Home size={18} />
        </NavLink>
        <NavLink to="/capsules" active={location.pathname === '/capsules'}>
          <BsCapsule size={18} />
        </NavLink>
        <NavLink to="/calls" active={location.pathname === '/calls'}>
          <PhoneCall size={18} />
        </NavLink>
        <NavLink to="/labs" active={location.pathname === '/labs'}>
          <FlaskConical size={18} />
        </NavLink>
      </NavLinks>


      {/* Mobile Hamburger */}
      <MobileMenuBtn onClick={handleHamburgerClick}>
        <Menu size={24} />
      </MobileMenuBtn>
    </Nav>
  );
};

export default Navbar;


