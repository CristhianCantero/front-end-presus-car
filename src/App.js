import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Servicios from './components/pages/Servicios';
import Vehiculos from './components/pages/Vehiculos';
import Marcas from './components/pages/Marcas';
import SignUp from './components/pages/SignUp';
import Repuestos from './components/pages/Repuestos';
import Talleres from './components/pages/Talleres';
import Aseguradoras from './components/pages/Aseguradoras';
import Usuarios from './components/pages/Usuarios';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element = {< Home />}  />
        <Route path='/servicios' element = {< Servicios />}  />
        <Route path='/vehiculos' element = {< Vehiculos />}  />
        <Route path='/marcas' element = {< Marcas />}  />
        <Route path='/sign-up' element = {< SignUp />}  />
        <Route path='/repuestos' element = {< Repuestos />}  />
        <Route path='/talleres' element = {< Talleres />}  />
        <Route path='/aseguradoras' element = {< Aseguradoras />}  />
        <Route path='/usuarios' element = {< Usuarios />}  />
      </Routes>
    </Router>
  );
}

export default App;
