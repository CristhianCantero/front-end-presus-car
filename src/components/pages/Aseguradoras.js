import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export default function Aseguradoras() {
  const [listadoAseguradoras, setListadoAseguradoras] = useState([]);

  useEffect(() => {
    axios.get(`/api/aseguradoras`)
      .then(res => setListadoAseguradoras(res.data.data))
      .catch(err => console.log(`Error: ${err}`));
  }, []);

  const verAseguradoras_HTMLTABLE = listadoAseguradoras.map((item) => {
    return (
      <tr key={item.id_aseguradora}>
        <td>{item.id_aseguradora}</td>
        <td>{item.nombre}</td>
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
        <h1 className='name'>Administración de Aseguradoras</h1>
      </div>

      <div className="d-flex justify-content-center">
        <table className="marcaTable table table-hover">
          <thead className="table-dark">
            <tr>
              <th>Cuit</th>
              <th>Nombre</th>
              <th colSpan={2}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {verAseguradoras_HTMLTABLE}
          </tbody>
        </table>
      </div>
    </>
  );
}
