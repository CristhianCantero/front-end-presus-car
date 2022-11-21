import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import swal from 'sweetalert';
import Loading from '../Loading';
import { useNavigate, useParams } from 'react-router-dom';

export default function AprobarOrdenCompra() {
    const navigate = useNavigate();

    const [listadoRepuestos, setListadoRepuestos] = useState([]);
    const [listadoTalleres, setListadoTalleres] = useState([]);
    const [listadoRepuestosAprobados, setListadoAprobados] = useState([]);
    const [idTaller, setIdTaller] = useState([]);
    const [loading, setLoading] = useState(false);

    const { id_presupuesto } = useParams();

    useEffect(() => {
        var data = {
            idPresupuesto: id_presupuesto,
        }
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`/api/presupuestos/repuestos`, data).then(res => {
                setListadoRepuestos(res.data)
            });
        });
        axios.get(`/api/talleres`)
            .then(res => setListadoTalleres(res.data.data))
            .catch(err => console.log(`Error: ${err}`));
    }, []);

    const handleTaller = e => {
        setIdTaller(e.target.value)
    };

    const handleRepuestosAprobados = (e) => {
        var codigoRepuesto = e.target.value;
        var repuestosAprobados = [...listadoRepuestosAprobados];
        if (repuestosAprobados.length === 0) {
            repuestosAprobados.push(codigoRepuesto)
        } else {
            var existe = false;
            for (let index = 0; index < repuestosAprobados.length; index++) {
                var repuesto = repuestosAprobados[index]
                if (repuesto === codigoRepuesto) {
                    existe = true;
                    var posicion = index;
                }
            }
            if (existe) {
                repuestosAprobados.splice(posicion, 1)
            } else {
                repuestosAprobados.push(codigoRepuesto)
            }
        }
        setListadoAprobados(repuestosAprobados)
    };

    const subirOrdenCompra = (e) => {
        e.preventDefault();
        var datosOrden = {
            id_presupuesto: id_presupuesto,
            id_taller: idTaller,
            repuestos: listadoRepuestosAprobados
        }
        swal("Atencion!", "Esta a punto de aprobar una orden de compra, revisó los datos ingresados?.", "warning", {
            buttons: {
                cancel: "Deseo verificar los datos de la orden.",
                confirm: {
                    text: "Si, aprobar orden.",
                    value: "confirm",
                }
            },
        }).then((value) => {
            switch (value) {
                case "confirm":
                    setLoading(true);
                    axios.get('/sanctum/csrf-cookie').then(response => {
                        axios.post(`/api/orden-compra`, datosOrden).then(res => {
                            if (res.data.status === 200) {
                                // console.log(res.data.datosOrden)
                                navigate('/presupuestos');
                                swal("Exito!", res.data.message, "success");
                            } else {
                                setLoading(false)
                            }
                        });
                    });
                    break;
                default:
                    break;
            }
        });
    }

    if (loading) {
        return (
            <Loading />
        )
    } else {
        return (
            <>
                <div className='container'>
                    <div className="d-flex justify-content-center p-3">
                        <h1 className='name'>Asignacion de Orden de Compra</h1>
                    </div>
                    <div className='orden-compra'>
                        <form className="row g-3" onSubmit={subirOrdenCompra}>
                            <div className="form-group col-6">
                                <div className="mb-3">
                                    <label for="formFile" className="form-label">Seleccionar la orden de compra</label>
                                    <input className="form-control" type="file" id="formFile" accept="application/pdf" />
                                </div>
                            </div>
                            <div className='form-group col-6'>
                                <label className="form-label">Talleres</label>
                                <select className="form-select" name='taller' onChange={handleTaller}>
                                    <option value=''>---Elija el taller de la orden---</option>
                                    {listadoTalleres.map(taller => (
                                        <option key={taller.id_taller} value={taller.id_taller} >
                                            {taller.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <h3>Listado repuestos</h3>
                            <div className='listado-repuestos-orden form-group col'>
                                {listadoRepuestos.map(repuesto => (
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value={repuesto.id_repuesto_presupuesto} id={repuesto.id_repuesto_presupuesto} onChange={(e) => handleRepuestosAprobados(e)} />
                                        <label className="form-check-label" for={repuesto.id_repuesto_presupuesto}>
                                            {repuesto.codigo_repuesto} - {repuesto.nombre}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <button type="submit" className="btn btn-success">
                                Aprobar Presupuesto
                            </button>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}