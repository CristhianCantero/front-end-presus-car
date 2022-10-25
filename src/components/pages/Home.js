import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <div className='container'>
        <div className="d-flex justify-content-center p-5">
          <h1 className='name'>Bienvenido a PRESUS-CAR!</h1>
        </div>
        <div className='row d-flex justify-content-center'>
          <div className="card col-md-3 m-1">
            <h5 className="card-header">Alta de Presupuestos</h5>
            <div className="card-body">
              <p className="card-text">Aqui podran realizar presupuesto tanto particulares como para asegurados/aseguradoras.</p>
              <div class="d-grid gap-2">
                <Link to="/alta-presupuesto" className="btn btn-primary">Realizar Presupuesto</Link>
              </div>
            </div>
          </div>
          <div className="card col-md-3 m-1">
            <h5 className="card-header">Consulta de Stock</h5>
            <div className="card-body">
              <p className="card-text">Verificar stock de repuestos.</p>
              <div class="d-grid gap-2">
                <Link to="/consulta-stock" className="btn btn-primary">Consultar Stock</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
