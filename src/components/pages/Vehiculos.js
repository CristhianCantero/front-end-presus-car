import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export default function Vehiculos() {
  const [listadoVehiculos, setlistadoVehiculos] = useState([]);

  useEffect(() => {
    axios.get(`/api/vehiculos`)
      .then(res => setlistadoVehiculos(res.data))
      .catch(err => console.log(`Error: ${err}`));
  }, []);

  const verVehiculos_HTMLTABLE = listadoVehiculos.map((item) => {
    return (
      <tr key={item.id_vehiculo}>
        <td>{item.id_vehiculo}</td>
        <td>{item.nombreVehiculo}</td>
        <td>{item.nombreMarca}</td>
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
        <h1 className='name'>Administración de Vehiculos</h1>
      </div>
      <div className="d-flex justify-content-center">
        <table className="marcaTable table table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID Vehiculo</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th colSpan={2}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {verVehiculos_HTMLTABLE}
          </tbody>
        </table>
      </div>
    </>
  );
}
