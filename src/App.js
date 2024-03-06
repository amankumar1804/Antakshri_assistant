import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartPage from  './component/Start'
import Room from './component/room'
import NoPage from './component/Nopage'
import Online from './component/online';
import Notifications from './component/notificatons';
import Game from './component/game';
import About from './component/about';
function App() {


  return (
    <BrowserRouter>
      <Routes>
        
          <Route index element={<StartPage />} />
          <Route path="room" element={<Room />} />
          <Route path='online' element={<Online />} />
          <Route path='notifications' element={<Notifications />} />
          <Route path='game' element={<Game />} />
          <Route path='about' element={<About />} />
          <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
