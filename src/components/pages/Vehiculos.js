import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export default function Vehiculos() {
  const [listadoVehiculos, setlistadoVehiculos] = useState([]);
  const [listadoMarcas, setlistadoMarcas] = useState([]);


  useEffect(() => {
    axios.get(`/api/vehiculos`)
      .then(res => setlistadoVehiculos(res.data.data))
      .catch(err => console.log(`Error: ${err}`));
  }, []);

  useEffect(() => {
    axios.get(`/api/marcas`)
      .then(res => setlistadoMarcas(res.data.data))
      .catch(err => console.log(`Error: ${err}`));
  }, []);

  console.log(listadoMarcas)

  const verVehiculos_HTMLTABLE = listadoVehiculos.map((item) => {
    var indexMarca = listadoMarcas.findIndex((marca) => marca.id_marca == item.id_marca);
    const objMarcaVehiculo = listadoMarcas[indexMarca];
    // console.log(objMarcaVehiculo)
    return (
      <tr key={item.id_vehiculo}>
        <td>{item.id_vehiculo}</td>
        <td>{item.nombre}</td>
        <td>{item.id_marca}</td>
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
