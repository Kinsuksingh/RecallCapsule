import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import Navbar from './components/Navbar';
import BottomBar from './components/BottomBar';
import LandingPage from './pages/LandingPage';
import CapsulesPage from './pages/CapsulesPage';
import CallsPage from './pages/CallsPage';
import LabsPage from './pages/LabsPage';

import ProtectedRoute from './components/ProtectedRoute';


const PageContainer = styled.div`
  padding-bottom: 80px;
  @media (min-width: 769px) {
    padding-bottom: 0;
  }
`;

function App() {
  return (
    <Router>
      <GlobalStyles />
      <Navbar />
      <PageContainer>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/capsules" element={<ProtectedRoute><CapsulesPage /></ProtectedRoute>} />

          <Route path="/calls" element={<ProtectedRoute><CallsPage /></ProtectedRoute>} />
          <Route path="/labs" element={<ProtectedRoute><LabsPage /></ProtectedRoute>} />
        </Routes>
      </PageContainer>
      <BottomBar />
    </Router>
  );
}

export default App;
