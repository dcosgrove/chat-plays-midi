import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthRedirect from './AuthRedirect';
import AuthProvider from './context/Auth';
import TwitchEventsProvider from './context/TwitchEvents';
import Browser from './Browser';
import LoginGate from './LoginGate';
import NotFound from './NotFound';
import {
  Container,
  Navbar,
  Nav
} from 'react-bootstrap';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import LoginStatus from './LoginStatus';

function App() {
  return (
    <AuthProvider>
      <TwitchEventsProvider>
        <div className="App"> 
          <Navbar bg="light" expand="sm">
            <Container>
              <Navbar.Brand>Chat Plays MIDI</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link href="#setup">Setup Guide</Nav.Link>
                <Nav.Link href="#contact">Contact</Nav.Link>
              </Nav>
              <Nav.Item className="justify-content-md-center">
                <Container>
                  <LoginStatus />
                </Container>
              </Nav.Item>
            </Container>
          </Navbar>
          <Container>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
              <Routes>
                <Route path="/" element={
                  <Container>
                    <LoginGate>
                      <Browser>
                      </Browser>
                    </LoginGate>
                  </Container>
                } />
              <Route path="/authorize" element={
                <AuthRedirect />
              } />
              <Route path="/*" element={
                <NotFound />
              } />
              </Routes>
            </BrowserRouter>
          </Container>
        </div>
      </TwitchEventsProvider>
    </AuthProvider>
  );
}

export default App;
