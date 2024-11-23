import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Campaigns from './pages/Campaigns';
import Characters from './pages/Characters';
import Monsters from './pages/Monsters';
import DiceRoller from './pages/DiceRoller';
import Sessions from './pages/Sessions';

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-grow p-6 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Campaigns />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/monsters" element={<Monsters />} />
          <Route path="/dice" element={<DiceRoller />} />
          <Route path="/sessions" element={<Sessions />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
