import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthRedirect from './AuthRedirect';
import AuthProvider from './context/Auth';
import TwitchEventsProvider from './context/TwitchEvents';
import Browser from './Browser';
import LoginGate from './LoginGate';
import NotFound from './NotFound';
import { Container } from 'react-bootstrap';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

function App() {
  
  return (
    <AuthProvider>
      <TwitchEventsProvider>
        <div className="App"> 
          <header className="App-header">
            <p>
              Twitch - MIDI Adapter
            </p>
          </header>
          <BrowserRouter>
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
        </div>
      </TwitchEventsProvider>
    </AuthProvider>
  );
}

export default App;
