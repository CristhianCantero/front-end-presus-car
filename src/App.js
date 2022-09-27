import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Servicios from './components/pages/Servicios';
import Vehiculos from './components/pages/Vehiculos';
import Marcas from './components/pages/Marcas';
import Login from './components/pages/Login';
import Repuestos from './components/pages/Repuestos';
import Talleres from './components/pages/Talleres';
import Aseguradoras from './components/pages/Aseguradoras';
import Usuarios from './components/pages/Usuarios';
import axios from 'axios';

// Defino defaults para las consultas axios y no repetirlas en todos los archivos.
axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('auth_token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
})

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element = {< Home />}  />
        <Route path='/servicios' element = {< Servicios />}  />
        <Route path='/vehiculos' element = {< Vehiculos />}  />
        <Route path='/marcas' element = {< Marcas />}  />
        <Route path='/login' element = {< Login />}  />
        <Route path='/repuestos' element = {< Repuestos />}  />
        <Route path='/talleres' element = {< Talleres />}  />
        <Route path='/aseguradoras' element = {< Aseguradoras />}  />
        <Route path='/usuarios' element = {< Usuarios />}  />
      </Routes>
    </Router>
  );
}

export default App;
