import axios from 'axios';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';


function Navbar() {
  const navigate = useNavigate();
  const logoutSubmit = (e) => {
    e.preventDefault();
    axios.post(`/api/logout`).then(res => {
      if (res.data.status === 200) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_usuario');
        navigate('/login');
        swal("Exito!", res.data.message, "success");
      } else {

      }
    });
  }

  var AuthButtons = '';
  if (!localStorage.getItem('auth_token')) {
    AuthButtons = (
      <li className="nav-item">
        <Link className="nav-link text-white" to="/login">Iniciar Sesion</Link>
      </li>
    )
  } else {
    AuthButtons = (
      <li className="nav-item">
        <button type='button' onClick={logoutSubmit} className='nav-link btn btn-danger text-white'>Cerrar Sesion</button>
      </li>
    )
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">PRESUS-CAR</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/alta-presupuesto">Alta Presupuesto</Link>
              </li>
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle text-white" to="/#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Administrar
                </Link>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><Link className="dropdown-item" to="/aseguradoras">Aseguradoras</Link></li>
                  <li><Link className="dropdown-item" to="/talleres">Talleres</Link></li>
                  <li><Link className="dropdown-item" to="/marcas">Marcas</Link></li>
                  <li><Link className="dropdown-item" to="/vehiculos">Vehiculos</Link></li>
                  <li><Link className="dropdown-item" to="/repuestos">Repuestos</Link></li>
                </ul>
              </li>
              {AuthButtons}
            </ul>
          </div>
        </div>
      </nav>
    );
  }

}

export default Navbar;
