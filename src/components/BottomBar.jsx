import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { Home, FlaskConical, PhoneCall } from 'lucide-react';
import { BsCapsule } from 'react-icons/bs';

const BarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55px;
  background: white;
  display: none;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.03);
  z-index: 1000;
  padding: 0 20px;
  border-top: 1px solid #F8FAFC;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const NavItem = styled(Link).withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: ${props => props.active ? '#191919ff' : '#94A3B8'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.active ? 'rgba(79, 70, 229, 0.1)' : 'transparent'};

  &:active {
    transform: scale(0.9);
  }
`;


const BottomBar = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/capsules/details')) {
    return null;
  }

  return (
    <BarContainer>
      <NavItem to="/" active={location.pathname === '/'}>
        <Home size={18} />
      </NavItem>

      <NavItem to="/capsules" active={location.pathname === '/capsules'}>
        <BsCapsule size={18} />
      </NavItem>

      <NavItem to="/calls" active={location.pathname === '/calls'}>
        <PhoneCall size={18} />
      </NavItem>

      <NavItem to="/labs" active={location.pathname === '/labs'}>
        <FlaskConical size={18} />
      </NavItem>
    </BarContainer>
  );
};


export default BottomBar;



