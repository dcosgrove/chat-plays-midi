import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Browser from './Browser';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="App"> 
      <header className="App-header">
        <p>
          Twitch - MIDI Adapter
        </p>
      </header>
      <Container>
        <Browser>
        </Browser>
      </Container>
    
    </div>
  );
}

export default App;