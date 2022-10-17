import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export default function Talleres() {
  const [listadoTalleres, setlistadoTalleres] = useState([]);

  useEffect(() => {
    axios.get(`/api/talleres`)
      .then(res => setlistadoTalleres(res.data.data))
      .catch(err => console.log(`Error: ${err}`));
  }, []);

  const verTalleres_HTMLTABLE = listadoTalleres.map((item) => {
    return (
      <tr key={item.id_taller}>
        <td>{item.id_taller}</td>
        <td>{item.nombre}</td>
        <td>{item.direccion}</td>
        <td>
          <button type='button' className='btn btn-primary'>Actualizar</button>
        </td>
        <td>
          <button type='button' className='btn btn-danger'>Desactivar</button>
        </td>
      </tr>
    );
  });

  return (
    <>
      <div className="d-flex justify-content-center p-4">
        <h1 className='name'>Administración de Talleres</h1>
      </div>

      <div className="d-flex justify-content-center">
        <table className="marcaTable table table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID Taller</th>
              <th>Nombre</th>
              <th>Dirección</th>
              {/* <th>Ubicación</th> */}
              <th colSpan={2}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {verTalleres_HTMLTABLE}
          </tbody>
        </table>
      </div>
    </>
  );
}
