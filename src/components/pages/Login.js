import React, { useState } from 'react';
import '../../App.css';

import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

export default function Login() {

  const navigate = useNavigate();

  const [loginInput, setLogin] = useState({
    nombre_usuario: '',
    contrasenia: '',
    error_list: []
  });

  const handleInput = (e) => {
    e.persist();
    setLogin({ ...loginInput, [e.target.name]: e.target.value });
  }

  const loginSubmit = (e) => {
    e.preventDefault();

    const data = {
      nombre_usuario: loginInput.nombre_usuario,
      contrasenia: loginInput.contrasenia
    }
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.post(`/api/login`, data).then(res => {
        if (res.data.status === 200) {
          localStorage.setItem('auth_token', res.data.access_token);
          localStorage.setItem('auth_usuario', res.data.auth_usuario);
          swal("Success", res.data.message, "success");
          navigate('/');
        } else if (res.data.status === 401) {
          swal("Warning", res.data.message, "warning");
        } else {
          setLogin({ ...loginInput, error_list: res.data.validation_errors });
        }
      });
    });
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={loginSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Bienvenido a Presus-Car</h3>
          <div className="form-group mt-3">
            <label>Nombre de Usuario</label>
            <input type="text" name='nombre_usuario' placeholder="Ingrese su nombre de usuario" onChange={handleInput} value={loginInput.nombre_usuario} className="form-control mt-1" />
            <span>{loginInput.error_list.nombre_usuario}</span>
          </div>
          <div className="form-group mt-3">
            <label>Contraseña</label>
            <input type="password" name='contrasenia' placeholder="Ingrese su contraseña" onChange={handleInput} value={loginInput.contrasenia} className="form-control mt-1" />
            <span>{loginInput.error_list.contrasenia}</span>
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Iniciar Sesión
            </button>
          </div>
          {/* <p className="forgot-password text-right mt-2">
            Se olvido la<a href="#">contraseña?</a>
          </p> */}
        </div>
      </form>
    </div>
  )
}
