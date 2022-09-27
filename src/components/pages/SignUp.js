import React from 'react';
import '../../App.css';


export default function SignUp(props) {
  return (
    <div className="Auth-form-container">
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Bienvenido a Presus-Car</h3>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Ingrese su correo electrónico"
            />
          </div>
          <div className="form-group mt-3">
            <label>Contraseña</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Ingrese su contraseña"
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Iniciar Sesión
            </button>
          </div>
          <p className="forgot-password text-right mt-2">
            Se olvido la<a href="#">contraseña?</a>
          </p>
        </div>
      </form>
    </div>
  )
}
