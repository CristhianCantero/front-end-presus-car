import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export default function Repuestos() {
  const [listadoRepuestos, setlistadoRepuestos] = useState([]);

  useEffect(() => {
    axios.get(`/api/repuestos`)
      .then(res => setlistadoRepuestos(res.data.data))
      .catch(err => console.log(`Error: ${err}`));
  }, []);

  const verRepuestos_HTMLTABLE = listadoRepuestos.map((item) => {
    return (
      <tr key={item.codigo_repuesto}>
        <td>{item.codigo_repuesto}</td>
        <td>{item.nombre}</td>
        <td>{item.stock}</td>
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
        <h1 className='name'>Administracion de Repuestos</h1>
      </div>
    </>
  );
}
