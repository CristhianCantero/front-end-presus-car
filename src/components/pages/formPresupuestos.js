import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

export default function Presupuestos() {
    const navigate = useNavigate();
    // PRIMERO INICIALIZAMOS LOS LISTADOS
    const [listadoAseguradoras, setListadoAseguradoras] = useState([]);
    const [listadoMarcas, setListadoMarcas] = useState([]);
    const [listadoVehiculos, setListadoVehiculos] = useState([]);
    const [listadoRepuestos, setListadoRepuestos] = useState([]);
    const [informacionFormulario, setInformacionFormulario] = useState({
        interesado: "",
        aseguradora: "",
        fecha: "",
        id_vehiculo: "",
        anio_vehiculo: "",
        nro_siniestro: "",
        patente: "",
        chasis: "",
        repuestos: inputList,
        error_list: []
    })

    const handleInput = (e) => {
        e.persist();
        setInformacionFormulario({ ...informacionFormulario, [e.target.name]: e.target.value });
    }

    // HACEMOS LA CONSULTA DE LOS REPUESTOS (ESTA CONFIGURADO PARA QUE CUANDO SE CARGUE LA PANTALLA SE INICIALICE CON EL VEHICULO 50)
    // SE DEBE CAMBIAR PARA QUE SEA EN UNA FUNCION ONCHANGE DE LA PRIMERA INSTANCIA DEL FORMULARIO

    useEffect(() => {
        axios.get(`/api/aseguradoras`)
            .then(res => setListadoAseguradoras(res.data.data))
            .catch(err => console.log(`Error: ${err}`));
        axios.get(`/api/marcas`)
            .then(res => setListadoMarcas(res.data.data))
            .catch(err => console.log(`Error: ${err}`));
    }, []);

    const date = new Date().toISOString().substring(0, 10)
    const [inputList, setInputList] = useState([]);
    const [codigoRepuesto, setAgregarRepuesto] = useState();
    const [descripcionRepuesto, setDescripcionRepuesto] = useState();
    const [paso, setPasos] = useState(0);

    const handleMarca = e => {
        var inputData = { id_marca: e.target.value };
        axios.post(`/api/vehiculos/vehiculos-marca`, inputData)
            .then(res => setListadoVehiculos(res.data))
            .catch(err => console.log(`Error: ${err}`));
    };

    const handleVehiculo = e => {
        setInputList([])
        var inputData = { idVehiculo: e.target.value };
        axios.post(`/api/repuestos/repuestos-vehiculo`, inputData)
            .then(res => setListadoRepuestos(res.data))
            .catch(err => console.log(`Error: ${err}`));
        handleInput(e)
    };

    const handleRepuesto = e => {
        if (e.target.options[e.target.selectedIndex].text) {
            var text = e.target.options[e.target.selectedIndex].text;
            var arrayTexto = text.split("- ");
            var descripcion = arrayTexto[0];
        }
        setAgregarRepuesto(e.target.value)
        setDescripcionRepuesto(descripcion)
    };

    const handleInputChange = (e, index) => {
        const { value } = e.target;
        var inputName = e.target.name;
        const list = [...inputList];
        switch (inputName) {
            case 'precio_unitario':
                list[index]['precio_unitario'] = value;
                break;
            case 'unidades':
                list[index]['unidades'] = value;
                break;
            default:
                break;
        }
        setInputList(list);
    };

    const handleAddClick = () => {
        const list = [...inputList];
        var existe = false;
        if (codigoRepuesto !== "") {
            if (list.length === 0) {
                setInputList([...inputList, {
                    repuesto: codigoRepuesto,
                    descripcion: descripcionRepuesto,
                    precio_unitario: '',
                    unidades: ''
                }])
                setAgregarRepuesto("")
                setDescripcionRepuesto("")
            } else {
                for (let index = 0; index < list.length; index++) {
                    var listado = list[index];
                    var codigoListado = listado.repuesto;
                    if (codigoListado === codigoRepuesto) {
                        existe = true;
                    }
                }
                if (!existe) {
                    setInputList([...inputList, {
                        repuesto: codigoRepuesto,
                        descripcion: descripcionRepuesto,
                        precio_unitario: '',
                        unidades: ''
                    }])
                    setAgregarRepuesto("")
                    setDescripcionRepuesto("")
                } else {
                    swal("Error!", "El repuesto ingresado ya existe en el listado, elegir otro", "warning");
                    setAgregarRepuesto("")
                    setDescripcionRepuesto("")
                }
            }
        } else {
            swal("Error!", "No se puede ingresar un repuesto vacio/duplicado", "warning");
        }
    };

    const handleRemove = index => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    const presupuestoSubmit = (e) => {
        e.preventDefault();
        const list = [...inputList];
        var infoFormulario = {...informacionFormulario};
        infoFormulario['repuestos'] = { ...inputList };
        infoFormulario['fecha'] = date;
        if (list.length === 0) {
            swal("Error!", "No se puede generar un presupuesto SIN repuestos. Favor de agregar los repuestos pertinentes.", "warning");
        } else {
            axios.get('/sanctum/csrf-cookie').then(response => {
                axios.post(`/api/presupuestos`, infoFormulario).then(res => {
                    if (res.data.status === 200) {
                        navigate('/');
                        swal("Exito!", res.data.message, "success");
                    } else {
                        setInformacionFormulario({ ...informacionFormulario, error_list: res.data.validation_errors });
                    }
                });
            });
        }
    }

    return (
        <>
            <div className='container'>
                <div className="d-flex justify-content-center p-3">
                    <h1 className='name'>Alta repuestos de presupuestos</h1>
                </div>
                <div className="formulario-presupuesto">
                    <form className="row g-3" onSubmit={presupuestoSubmit}>
                        <div className='primerPaso' hidden={paso !== 0}>
                            <div className="d-flex justify-content-center m-2">
                                <h2 className='name'>Paso 1: Informacion basica</h2>
                            </div>
                            <div className='row g-3 mb-3'>
                                <div className="form-group col-md-7">
                                    {/* Nombre y apellido del interesado */}
                                    <label>Nombre y Apellido del Interesado</label>
                                    <input type="text" className="form-control" name='interesado' onChange={(e) => { handleInput(e) }} />
                                </div>
                                <div className="form-group col-3">
                                    {/* Aseguradora */}
                                    <label>Aseguradora</label>
                                    <select className="form-select" name='aseguradora' onChange={(e) => { handleInput(e) }}>
                                        <option value=''>---Elija una aseguradora---</option>
                                        {listadoAseguradoras.map(aseguradora => (
                                            <option key={aseguradora.cuit} value={aseguradora.cuit} >
                                                {aseguradora.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group col-2">
                                    {/* Fecha del Presupuesto de hoy*/}
                                    <label>Fecha</label>
                                    <input type="date" className="form-control" name='fecha' value={date} readOnly />
                                </div>
                            </div>
                            <div className='row g-3 mb-3'>
                                <div className="form-group col-4">
                                    {/* Marca */}
                                    <label>Marca</label>
                                    <select className="form-select" name='marca' onChange={e => handleMarca(e)}>
                                        <option value=''>---Elija la marca del vehiculo---</option>
                                        {listadoMarcas.map(marca => (
                                            <option key={marca.id_marca} value={marca.id_marca} >
                                                {marca.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group col-4">
                                    {/* Vehiculo */}
                                    <label>Vehiculo</label>
                                    <select className="form-select" name='id_vehiculo' onChange={e => handleVehiculo(e)} disabled={listadoVehiculos.length === 0}>
                                        <option value=''>---Elija un vehiculo---</option>
                                        {listadoVehiculos.map(vehiculo => (
                                            <option key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo} >
                                                {vehiculo.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group col-2">
                                    {/* Año del Vehiculo */}
                                    <label>Año</label>
                                    <input type="number" className="form-control" name='anio_vehiculo' onChange={(e) => { handleInput(e) }} />
                                </div>
                                <div className="form-group col-2">
                                    {/* Nro de Siniestro*/}
                                    <label>Nro de Siniestro</label>
                                    <input type="text" className="form-control" name='nro_siniestro' onChange={(e) => { handleInput(e) }} />
                                </div>
                            </div>
                            <div className='row d-flex justify-content-center'>
                                <div className="form-group col-3">
                                    {/* Patente */}
                                    <label>Patente</label>
                                    <input type="text" className="form-control" name='patente' onChange={(e) => { handleInput(e) }} />
                                </div>
                                <div className="form-group col-3">
                                    {/* Chasis */}
                                    <label>Chasis</label>
                                    <input type="text" className="form-control" name='chasis' onChange={(e) => { handleInput(e) }} />
                                </div>
                            </div>
                        </div>
                        <div className='segundoPaso' hidden={paso === 0}>
                            <div className="d-flex justify-content-center m-2">
                                <h2 className='name'>Paso 2: Listado de Repuestos</h2>
                            </div>
                            <label>Repuesto</label>
                            <div className="input-group">
                                <select className="form-select" name='repuesto' onChange={e => handleRepuesto(e)}>
                                    <option value=''>---Elija un vehiculo---</option>
                                    {listadoRepuestos.map(repuestos => (
                                        <option key={repuestos.codigo_repuesto} value={repuestos.codigo_repuesto} >
                                            {repuestos.nombre} - {repuestos.codigo_repuesto}
                                        </option>
                                    ))}
                                </select>
                                <button type="button" onClick={handleAddClick} className="btn btn-secondary">
                                    Agregar Repuesto
                                </button>
                            </div>
                            {inputList.map((x, i) => {
                                return (
                                    <div className="row g-3 mt-1">
                                        <div className="form-group col-md-2">
                                            <label>Codigo</label>
                                            <input type="text" className="form-control" name='codigo_repuesto' value={x.repuesto} readOnly />
                                        </div>
                                        <div className="form-group col-md-5">
                                            <label>Descripcion</label>
                                            <input type="text" className="form-control" name='descripcion' value={x.descripcion} readOnly />
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label>Precio Unitario</label>
                                            <input type="number" className="form-control" name='precio_unitario' onChange={e => handleInputChange(e, i)} />
                                        </div>
                                        <div className="form-group col-md-1">
                                            <label>Unidades</label>
                                            <input type="number" className="form-control" name='unidades' defaultValue={1} onChange={e => handleInputChange(e, i)} />
                                        </div>
                                        <div className="col-md-2">
                                            <label>Quitar Repuesto</label>
                                            <br />
                                            <button type="button" onClick={() => handleRemove(i)} className="btn btn-danger">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="btn-group p-1">
                            <button type="button" className="btn btn-primary" disabled={paso === 0} onClick={() => { setPasos((paso) => paso - 1) }}>
                                Paso Anterior
                            </button>
                            <button type="button" className="btn btn-primary" disabled={paso === 1} onClick={() => { setPasos((paso) => paso + 1) }}>
                                Siguiente Paso
                            </button>
                        </div>
                        <button type="submit" hidden={paso !== 1} className="btn btn-success">
                            Generar Presupuesto
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
