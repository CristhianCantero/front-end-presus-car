import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
// import { Link } from 'react-router-dom';

import '../../App.css';

export default function Marcas() {
  const [listadoMarcas, setListadoMarca] = useState([]);

  useEffect(() => {
    axios.get(`/api/marcas`)
      .then(res => setListadoMarca(res.data.data))
      .catch(err => console.log(`Error: ${err}`));
  }, []);

  const verMarcas_HTMLTABLE = listadoMarcas.map((item) => {
    return (
      <tr key={item.id_marca}>
        <td>{item.id_marca}</td>
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
        <h1 className='name'>Administración de Marcas</h1>
      </div>
      <div className="d-flex justify-content-center">
        <table className="marcaTable table table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID Marca</th>
              <th>Marca</th>
              <th colSpan={2}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {verMarcas_HTMLTABLE}
          </tbody>
        </table>
      </div>
    </>
  );
}
