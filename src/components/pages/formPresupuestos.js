import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import Loading from '../Loading';

export default function Presupuestos() {
    const navigate = useNavigate();
    // PRIMERO INICIALIZAMOS LOS LISTADOS
    const [loading, setLoading] = useState(false);
    const [subtotal, setSubtotal] = useState("0");
    const [subtotalSinIva, setSubtotalIva] = useState("0");
    const [iva, setIva] = useState("0");
    const [inputList, setInputList] = useState([]);
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
        if (e.target.name === "aseguradora") {
            setNombreAseguradora(e.target.options[e.target.selectedIndex].text);
        } else if (e.target.name === "id_vehiculo") {
            setNombreVehiculo(e.target.options[e.target.selectedIndex].text);
        }
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
    const [nombreAseguradora, setNombreAseguradora] = useState("");
    const [nombreVehiculo, setNombreVehiculo] = useState("");
    const [codigoRepuesto, setAgregarRepuesto] = useState();
    const [descripcionRepuesto, setDescripcionRepuesto] = useState();
    const [paso, setPasos] = useState(0);

    // Consultas SOAP
    var XMLParser = require('react-xml-parser');

    function sumaSOAP(subtotalActual, valorRepuesto) {
        return new Promise((resolve) => {
            const options = {
                method: 'POST',
                url: 'http://www.dneonline.com/calculator.asmx',
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    SOAPAction: 'http://tempuri.org/Add'
                },
                data: `<?xml version="1.0" encoding="utf-8"?>\n<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  <soap:Body>\n    <Add xmlns="http://tempuri.org/">\n     <intA>${subtotalActual}</intA>\n      <intB>${valorRepuesto}</intB>\n    </Add>\n  </soap:Body>\n</soap:Envelope>`
            };

            axios.request(options).then(function (response) {
                var jsonResponse = new XMLParser().parseFromString(response.data);
                var responseNumber = Number(jsonResponse.children[0].children[0].children[0].value);
                resolve(responseNumber);
            })
        })
    }

    function restaSOAP(subtotal, iva) {
        return new Promise((resolve) => {
            const options = {
                method: 'POST',
                url: 'http://www.dneonline.com/calculator.asmx',
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    SOAPAction: 'http://tempuri.org/Subtract'
                },
                data: `<?xml version="1.0" encoding="utf-8"?>\n<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  <soap:Body>\n    <Subtract xmlns="http://tempuri.org/">\n     <intA>${subtotal}</intA>\n      <intB>${iva}</intB>\n    </Subtract>\n  </soap:Body>\n</soap:Envelope>`
            };

            axios.request(options).then(function (response) {
                var jsonResponse = new XMLParser().parseFromString(response.data);
                var responseNumber = Number(jsonResponse.children[0].children[0].children[0].value);
                resolve(responseNumber);
            })
        })
    }

    function multiplicarRepuestoSOAP(repuesto) {
        return new Promise((resolve) => {
            const options = {
                method: 'POST',
                url: 'http://www.dneonline.com/calculator.asmx',
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    SOAPAction: 'http://tempuri.org/Multiply'
                },
                data: `<?xml version="1.0" encoding="utf-8"?>\n<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  <soap:Body>\n    <Multiply xmlns="http://tempuri.org/">\n      <intA>${repuesto.precio_unitario}</intA>\n      <intB>${repuesto.unidades}</intB>\n    </Multiply>\n  </soap:Body>\n</soap:Envelope>`
            };

            axios.request(options).then(function (response) {
                var jsonResponse = new XMLParser().parseFromString(response.data);
                var responseNumber = Number(jsonResponse.children[0].children[0].children[0].value);
                resolve(responseNumber);
            })
        })
    }

    function calcularIvaMultiSOAP(subtotal) {
        return new Promise((resolve) => {
            const options = {
                method: 'POST',
                url: 'http://www.dneonline.com/calculator.asmx',
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    SOAPAction: 'http://tempuri.org/Multiply'
                },
                data: `<?xml version="1.0" encoding="utf-8"?>\n<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  <soap:Body>\n    <Multiply xmlns="http://tempuri.org/">\n      <intA>${subtotal}</intA>\n      <intB>21</intB>\n    </Multiply>\n  </soap:Body>\n</soap:Envelope>`
            };

            axios.request(options).then(function (response) {
                var jsonResponse = new XMLParser().parseFromString(response.data);
                var responseNumber = Number(jsonResponse.children[0].children[0].children[0].value);
                resolve(responseNumber);
            })
        })
    }

    function calcularIvaDivisionSOAP(iva) {
        return new Promise((resolve) => {
            const options = {
                method: 'POST',
                url: 'http://www.dneonline.com/calculator.asmx',
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    SOAPAction: 'http://tempuri.org/Divide'
                },
                data: `<?xml version="1.0" encoding="utf-8"?>\n<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  <soap:Body>\n    <Divide xmlns="http://tempuri.org/">\n      <intA>${iva}</intA>\n      <intB>100</intB>\n    </Divide>\n  </soap:Body>\n</soap:Envelope>`
            };

            axios.request(options).then(function (response) {
                var jsonResponse = new XMLParser().parseFromString(response.data);
                var responseNumber = Number(jsonResponse.children[0].children[0].children[0].value);
                resolve(responseNumber);
            })
        })
    }

    // Calcular y asignar subtotal
    const calcularSubtotal = async (callback) => {
        const list = [...inputList];
        var subtotalInicial = 0;
        for (let index = 0; index < list.length; index++) {
            var repuestoActual = list[index];
            var multiplicacion = "";
            multiplicacion = await multiplicarRepuestoSOAP(repuestoActual);
            subtotalInicial = await sumaSOAP(subtotalInicial, multiplicacion);
        }
        var ivaMulti = await calcularIvaMultiSOAP(subtotalInicial);
        var ivaFinal = await calcularIvaDivisionSOAP(ivaMulti);
        var subtotalSinIva = await restaSOAP(subtotalInicial, ivaFinal);
        var arrayDatos = {
            subtotal: subtotalInicial,
            subtotalSinIVA: subtotalSinIva,
            iva: ivaFinal,
        }
        callback(arrayDatos)
    }

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
        calcularSubtotal(function (response) {
            setSubtotalIva(response.subtotalSinIVA)
            setIva(response.iva)
            setSubtotal(response.subtotal)
        })
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
                    unidades: 1
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
                        unidades: 1
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
        calcularSubtotal(function (response) {
            setSubtotalIva(response.subtotalSinIVA)
            setIva(response.iva)
            setSubtotal(response.subtotal)
        })
    };

    const generarPDF = dataPresupuesto => {
        const doc = new jsPDF();
        var objFecha = dataPresupuesto.fecha;
        var arrayFecha = objFecha.split("-");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12)
        doc.addImage("./RS-AUTOPARTES-LOGO1.png", 'png', 12, 0);
        doc.text("Virgilio Amarante 4548 - Neuquén Capital", 55, 14, null, null, "left");
        doc.text("Cel: 2994196885", 55, 22, null, null, "left");
        doc.text("Mail: canterrepuestos@gmail.com", 55, 30, null, null, "left");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18)
        doc.text("PRESUPUESTO - X", 200, 15, null, null, "right");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12)
        doc.text("Numero de Presupuesto - " + dataPresupuesto.nroPresupuesto, 200, 22, null, null, "right");
        doc.setFontSize(15)
        doc.setFont("helvetica", "bold");
        doc.text("Fecha de Emision: " + arrayFecha[2] + "/" + arrayFecha[1] + "/" + arrayFecha[0], 200, 30, null, null, "right");
        doc.line(2, 35, doc.internal.pageSize.width - 2, 35); // horizontal line
        doc.setFontSize(20)
        doc.setFont("helvetica", "bold");
        doc.text("DATOS PRESUPUESTO", 105, 45, "center");
        doc.setFontSize(15)
        doc.setFont("helvetica", "normal");
        doc.text("Interesado: ", 10, 55, null, null, "left");
        doc.text(dataPresupuesto.interesado, 40, 55, null, null, "left");
        doc.text("Aseguradora: ", 10, 65, null, null, "left");
        doc.text(nombreAseguradora, 45, 65, null, null, "left");
        doc.text("Nro de Siniestro: ", 115, 65, null, null, "left");
        doc.text(dataPresupuesto.nro_siniestro, 155, 65, null, null, "left");
        doc.text("Vehiculo: ", 10, 75, null, null, "left");
        doc.text(nombreVehiculo, 35, 75, null, null, "left");
        doc.text("Año: ", 100, 75, null, null, "left");
        doc.text(dataPresupuesto.anio_vehiculo, 112, 75, null, null, "left");
        doc.text("Patente: ", 10, 85, null, null, "left");
        doc.text(dataPresupuesto.patente, 35, 85, null, null, "left");
        doc.text("Chasis: ", 70, 85, null, null, "left");
        doc.text(dataPresupuesto.chasis, 88, 85, null, null, "left");
        doc.line(2, 90, doc.internal.pageSize.width - 2, 90); // horizontal line
        doc.setFontSize(20)
        doc.setFont("helvetica", "bold");
        doc.text("REPUESTOS", 105, 100, "center");

        var columns = [
            { title: "Codigo", dataKey: "repuesto" },
            { title: "Repuesto", dataKey: "descripcion" },
            { title: "Precio x Unidad", dataKey: "precio_unitario" },
            { title: "Unidades", dataKey: "unidades" },
        ];

        var objetoRepuestos = Object.entries(dataPresupuesto.repuestos);
        var rows = []
        var subtotal = 0
        for (let index = 0; index < objetoRepuestos.length; index++) {
            var repuesto = objetoRepuestos[index][1];
            var data = {
                "repuesto": repuesto.repuesto,
                "descripcion": repuesto.descripcion,
                "precio_unitario": repuesto.precio_unitario,
                "unidades": repuesto.unidades
            };
            subtotal = subtotal + (repuesto.precio_unitario * repuesto.unidades)
            rows.push(data)
        }

        doc.autoTable(columns, rows, {
            theme: 'striped',
            startY: 105,
            tableWidth: 'wrap',
            margin: { left: 5 },
            styles: {
                overflow: 'linebreak',
                columnWidth: 'auto',
                font: 'arial',
                fontSize: 12,
                overflowColumns: 'linebreak',
                textColor: [0, 0, 0],
            },
            columnStyles: {
                repuesto: {
                    halign: "center"
                },
                descripcion: {
                    halign: "left",
                    cellWidth: 120
                },
                precio_unitario: {
                    halign: "center"
                },
                unidades: {
                    halign: "center"
                }
            },
            headerStyles: {
                theme: 'grid',
                fillColor: [208, 208, 208]
            }
        });
        doc.setDrawColor(0, 0, 0);
        var iva = subtotal * 0.21;
        iva = iva.toFixed(2)
        var subtotalSinIVA = subtotal - iva;
        doc.setFontSize(15)
        doc.setFont("helvetica", "normal");
        doc.text("Subtotal (sin IVA): $" + subtotalSinIVA + ".-", 200, 250, null, null, "right");
        doc.text("IVA (21%): $" + iva + ".-", 200, 260, null, null, "right");
        doc.line(125, 263, doc.internal.pageSize.width - 5, 263); // horizontal line
        doc.text("TOTAL (con IVA): $" + subtotal + ".-", 200, 270, null, null, "right");
        doc.text("*IMPORTANTE* Este presupuesto es valido por 15 días.", 15, doc.internal.pageSize.height - 8, null, null, "left");

        doc.rect(2, 2, doc.internal.pageSize.width - 4, doc.internal.pageSize.height - 4, 'S');
        var nombrePdf = "Presupuesto - " + nombreVehiculo + " - " + dataPresupuesto.patente + ".pdf";
        doc.save(nombrePdf);
    }

    const presupuestoSubmit = (e) => {
        e.preventDefault();
        const list = [...inputList];
        var infoFormulario = { ...informacionFormulario };
        infoFormulario['repuestos'] = { ...inputList };
        infoFormulario['fecha'] = date;
        if (list.length === 0) {
            swal("Error!", "No se puede generar un presupuesto SIN repuestos. Favor de agregar los repuestos pertinentes.", "warning");
        } else {
            swal("Atencion!", "Esta a punto de generar un presupuesto, revisó los datos ingresados?.", "warning", {
                buttons: {
                    cancel: "Deseo verificar el formulario.",
                    confirm: {
                        text: "Si, generar presupuesto.",
                        value: "confirm",
                    }
                },
            }).then((value) => {
                switch (value) {
                    case "confirm":
                        setLoading(true);
                        axios.get('/sanctum/csrf-cookie').then(response => {
                            axios.post(`/api/presupuestos`, infoFormulario).then(res => {
                                if (res.data.status === 200) {
                                    var responsePresupuesto = res.data.datosPresupuesto;
                                    infoFormulario['nroPresupuesto'] = responsePresupuesto.id;
                                    generarPDF(infoFormulario);
                                    navigate('/');
                                    swal("Exito!", res.data.message, "success");
                                } else {
                                    setInformacionFormulario({ ...informacionFormulario, error_list: res.data.validation_errors });
                                }
                            });
                        });
                        break;
                    default:
                        break;
                }
            });
        }
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
                                                <input type="number" className="form-control" min={1} name='precio_unitario' onChange={e => handleInputChange(e, i)} />
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
                            <div className='row d-flex justify-content-end'>
                                <table className='tablaValores table' hidden={paso === 0}>
                                    <tbody>
                                        <tr>
                                            <td>Subtotal S/IVA: </td>
                                            <td>${subtotalSinIva}</td>
                                        </tr>
                                        <tr>
                                            <td>IVA (21%): </td>
                                            <td>${iva}</td>
                                        </tr>
                                        <tr>
                                            <td>Subtotal C/IVA: </td>
                                            <td>${subtotal}</td>
                                        </tr>
                                    </tbody>
                                </table>
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
}