import React from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import PrivateRoutes from './components/PrivateRoutes';
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
import AltaPresupuesto from './components/pages/formPresupuestos';
import ConsultaStock from './components/pages/ConsultasStock';
import AprobarOrdenCompra from './components/pages/AprobarPresupuesto';
import ActualizarPresupuesto from './components/pages/ActualizarPresupuesto';
import Presupuestos from './components/pages/Presupuestos';

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
        <Route path='/login' element={< Login />} />
        <Route element={< PrivateRoutes />}>
          <Route path='/' element={< Home />} />
          <Route path='/servicios' element={< Servicios />} />
          <Route path='/vehiculos' element={< Vehiculos />} />
          <Route path='/marcas' element={< Marcas />} />
          <Route path='/repuestos' element={< Repuestos />} />
          <Route path='/talleres' element={< Talleres />} />
          <Route path='/aseguradoras' element={< Aseguradoras />} />
          <Route path='/usuarios' element={< Usuarios />} />
          <Route path='/presupuestos' element={< Presupuestos />} />
          <Route path='/alta-presupuesto' element={< AltaPresupuesto />} />
          <Route path='/consulta-stock' element={< ConsultaStock />} />
          <Route path='/orden-compra-presupuesto/:id_presupuesto' element={< AprobarOrdenCompra />} />
          <Route path='/actualizar-presupuesto/:id_presupuesto' element={< ActualizarPresupuesto />} />
          <Route path='*' element={<p>No hay nada aqui! Error 404</p>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;