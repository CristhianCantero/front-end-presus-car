import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import swal from 'sweetalert';
import Loading from '../Loading';

export default function ConsultaStock() {

    const [listadoRepuestos, setListadoRepuestos] = useState([]);
    const [listadoMarcas, setListadoMarcas] = useState([]);
    const [listadoVehiculos, setListadoVehiculos] = useState([]);
    const [busquedaRapida, setBusquedaRapida] = useState("");
    const [idVehiculo, setVehiculo] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        axios.get(`/api/marcas`)
            .then(res => setListadoMarcas(res.data.data))
            .catch(err => console.log(`Error: ${err}`));
    }, []);

    const handleMarca = e => {
        var inputData = { id_marca: e.target.value };
        axios.post(`/api/vehiculos/vehiculos-marca`, inputData)
            .then(res => setListadoVehiculos(res.data))
            .catch(err => console.log(`Error: ${err}`));
    };

    const handleVehiculo = e => {
        setVehiculo(e.target.value)
    };

    const handleBusquedaRapida = (e) => {
        setBusquedaRapida(e.target.value)
    }

    const consultarStock = (e) => {
        e.preventDefault();
        setListadoRepuestos([]);
        var data = {
            descripcionRepuesto: busquedaRapida,
            idVehiculo: idVehiculo
        }
        if ((busquedaRapida === "") && (idVehiculo === "")) {
            swal("Error!", "Cargar algun dato para realizar la consulta.", "warning");
        } else {
            // swal("Bien!", "Consulta bien hecha.", "success");
            setLoading(true)
            axios.get('/sanctum/csrf-cookie').then(response => {
                axios.post(`/api/consulta-stock`, data).then(res => {
                    if (res.data.status === 200) {
                        var responseRepuestos = res.data.repuestos;
                        setListadoRepuestos(responseRepuestos);
                    }
                    setLoading(false)
                    setVehiculo("")
                    setBusquedaRapida("")
                });
            });
        }
    }

    const verRepuestos_HTMLTABLE = listadoRepuestos.map((item) => {
        var semaforo = "";
        var alt = "";
        if (item.stock === 0) {
            semaforo = "./semaforo-stock-rojo.jpg";
            alt = "Consultar stock";
        } else if (item.stock >= 1 && item.stock <= 3) {
            semaforo = "./semaforo-stock-amarillo.jpg";
            alt = "Poco stock";
        } else {
            semaforo = "./semaforo-stock-verde.jpg";
            alt = "En stock";
        }
        return (
            <tr key={item.codigo}>
                <td>{item.codigo}</td>
                <td>{item.nombre}</td>
                <td><img src={semaforo} alt={alt} title={alt} width="70" /></td>
            </tr>
        );
    });

    if (loading) {
        return (
            <Loading />
        )
    } else {
        return (
            <>
                <div className='container'>
                    <div className="d-flex justify-content-center p-3">
                        <h1 className='name'>Consulta de Stock</h1>
                    </div>
                    <div className='consulta-stock' onSubmit={consultarStock}>
                        <form className="row g-3">
                            <div className='row g-3 mb-3'>
                                <div className="form-group col-md">
                                    <label>Busqueda Rapida</label>
                                    <input type="text" className="form-control form-control-lg" name='busqueda-rapida' onChange={(e) => handleBusquedaRapida(e)} />
                                </div>
                            </div>
                            <div className='row g-3 mb-3'>
                                <div className="form-group col-6">
                                    {/* Marca */}
                                    <label>Marca</label>
                                    <select className="form-select" name='marca' onChange={(e) => handleMarca(e)}>
                                        <option value=''>---Elija la marca del vehiculo---</option>
                                        {listadoMarcas.map(marca => (
                                            <option key={marca.id_marca} value={marca.id_marca} >
                                                {marca.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group col-6">
                                    {/* Vehiculo */}
                                    <label>Vehiculo</label>
                                    <select className="form-select" name='id_vehiculo' onChange={(e) => handleVehiculo(e)} disabled={listadoVehiculos.length === 0}>
                                        <option value=''>---Elija un vehiculo---</option>
                                        {listadoVehiculos.map(vehiculo => (
                                            <option key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo} >
                                                {vehiculo.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                            </div>
                            <button type="submit" className="btn btn-success">
                                Consultar stock
                            </button>
                        </form>
                        <table className="repuestosTable table table-hover mt-4" hidden={verRepuestos_HTMLTABLE.length === 0}>
                            <thead className="table-dark">
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {verRepuestos_HTMLTABLE}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    }
}