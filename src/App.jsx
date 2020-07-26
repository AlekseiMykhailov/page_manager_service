import React from 'react';
import './App.scss';
import { Routes } from './routes';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Routes />
      <Footer />
    </div>
  );
};

export default App;
