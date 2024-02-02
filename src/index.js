import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.scss';
import Menu from './Menu/Menu.jsx';
import Room from './Room/Room.jsx';
import { socket } from './socket.js';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
const { NODE_ENV } = process.env;

if( NODE_ENV === 'production') disableReactDevTools();

function App() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      socket.emit('appClosing');
    };
    // Add the beforeunload event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />}/>
        <Route path="room" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <App />
);
