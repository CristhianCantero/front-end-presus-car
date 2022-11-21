import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

export default function Presupuestos() {
    const [listadoPresupuestos, setlistadoPresupuestos] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/presupuestos`)
            .then(res => setlistadoPresupuestos(res.data.presupuestos))
            .catch(err => console.log(`Error: ${err}`));
    }, []);

    const generarPresupuestoPDF = data => {
        var dataPresupuesto = data.presupuesto;
        const doc = new jsPDF();
        var objFecha = dataPresupuesto.fecha;
        // var arrayFecha = objFecha.split("-");
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
        doc.text("Numero de Presupuesto - " + dataPresupuesto.id_presupuesto, 200, 22, null, null, "right");
        doc.setFontSize(15)
        doc.setFont("helvetica", "bold");
        // doc.text("Fecha de Emision: " + arrayFecha[2] + "/" + arrayFecha[1] + "/" + arrayFecha[0], 200, 30, null, null, "right");
        doc.text("Fecha de Emision: " + objFecha, 200, 30, null, null, "right");

        doc.line(2, 35, doc.internal.pageSize.width - 2, 35); // horizontal line
        doc.setFontSize(20)
        doc.setFont("helvetica", "bold");
        doc.text("DATOS PRESUPUESTO", 105, 45, "center");
        doc.setFontSize(15)
        doc.setFont("helvetica", "normal");
        doc.text("Interesado: ", 10, 55, null, null, "left");
        if (dataPresupuesto.nombre_apellido_interesado === null) {
            doc.text("", 40, 55, null, null, "left");
        } else {
            doc.text(dataPresupuesto.nombre_apellido_interesado, 40, 55, null, null, "left");
        }
        doc.text("Aseguradora: ", 10, 65, null, null, "left");
        if (dataPresupuesto.nombreAseguradora === null) {
            doc.text("", 45, 65, null, null, "left");
        } else {
            doc.text(dataPresupuesto.nombreAseguradora, 45, 65, null, null, "left");
        }
        doc.text("Nro de Siniestro: ", 115, 65, null, null, "left");
        if (dataPresupuesto.nro_siniestro === null) {
            doc.text("", 155, 65, null, null, "left");
        } else {
            doc.text(dataPresupuesto.nro_siniestro, 155, 65, null, null, "left");
        }
        doc.text("Vehiculo: ", 10, 75, null, null, "left");
        doc.text(dataPresupuesto.nombreVehiculo, 35, 75, null, null, "left");
        doc.text("Año: ", 115, 75, null, null, "left");
        if (dataPresupuesto.anio_vehiculo === null) {
            doc.text("", 130, 75, null, null, "left");
        } else {
            doc.text("" + dataPresupuesto.anio_vehiculo, 130, 75, null, null, "left");
        }
        doc.text("Patente: ", 10, 85, null, null, "left");
        if (dataPresupuesto.patente === null) {
            doc.text("", 35, 85, null, null, "left");
        } else {
            doc.text(dataPresupuesto.patente, 35, 85, null, null, "left");
        }
        doc.text("Chasis: ", 70, 85, null, null, "left");
        if (dataPresupuesto.chasis === null) {
            doc.text("", 88, 85, null, null, "left");
        } else {
            doc.text(dataPresupuesto.chasis, 88, 85, null, null, "left");
        }
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

        var objetoRepuestos = data.repuestos;
        var rows = []
        var subtotal = 0
        for (let index = 0; index < objetoRepuestos.length; index++) {
            var repuesto = objetoRepuestos[index];
            var dataTabla = {
                "repuesto": repuesto.codigo_repuesto,
                "descripcion": repuesto.nombre,
                "precio_unitario": repuesto.precio,
                "unidades": repuesto.unidades
            };
            subtotal = subtotal + (repuesto.precio * repuesto.unidades)
            rows.push(dataTabla)
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
        var nombrePdf = "Presupuesto - " + dataPresupuesto.nombreVehiculo + " - " + dataPresupuesto.patente + ".pdf";
        doc.save(nombrePdf);
    }

    const generarRemitoPDF = async (data) => {
        var dataOrden = data.ordenCompra;
        console.log(data)
        const doc = new jsPDF();
        // var arrayFecha = objFecha.split("-");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12)
        doc.addImage("./RS-AUTOPARTES-LOGO1.png", 'png', 12, 0);
        doc.text("Virgilio Amarante 4548 - Neuquén Capital", 55, 14, null, null, "left");
        doc.text("Cel: 2994196885", 55, 22, null, null, "left");
        doc.text("Mail: canterrepuestos@gmail.com", 55, 30, null, null, "left");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18)
        doc.text("REMITO - X", 200, 15, null, null, "right");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12)
        doc.text("REMITO - " + dataOrden.id_orden_compra, 200, 22, null, null, "right");
        doc.setFontSize(15)
        doc.setFont("helvetica", "bold");
        doc.text("Fecha de Entrega: " + dataOrden.fecha, 200, 30, null, null, "right");
        doc.line(2, 35, doc.internal.pageSize.width - 2, 35); // horizontal line
        doc.setFontSize(20)
        doc.setFont("helvetica", "bold");
        doc.text("REMITO DE ENTREGA", 105, 45, "center");
        doc.setFontSize(15)
        doc.setFont("helvetica", "normal");
        doc.text("TALLER: ", 10, 55, null, null, "left");
        doc.text(dataOrden.nombreTaller, 70, 55, null, null, "left");
        doc.text("DIRECCION: ", 10, 65, null, null, "left");
        doc.text(dataOrden.direccion, 70, 65, null, null, "left");
        doc.text("ASEGURADORA: ", 10, 75, null, null, "left");
        if (dataOrden.aseguradora_cuit === null) {
            doc.text("", 60, 75, null, null, "left");
        } else {
            const responseAseguradora = await axios.get(`/api/aseguradoras/` + dataOrden.aseguradora_cuit);
            var aseguradora = responseAseguradora.data.data;
            doc.text(aseguradora.nombre, 60, 75, null, null, "left");
        }
        doc.text("SINIESTRO: ", 130, 75, null, null, "left");
        if (dataOrden.nro_siniestro === null) {
            doc.text("", 165, 75, null, null, "left");
        } else {
            doc.text(dataOrden.nro_siniestro, 165, 75, null, null, "left");
        }
        doc.text("VEHICULO: ", 10, 85, null, null, "left");
        doc.text(dataOrden.nombreVehiculo, 50, 85, null, null, "left");
        doc.text("MODELO: ", 130, 85, null, null, "left");
        if (dataOrden.anio_vehiculo === null) {
            doc.text("", 160, 85, null, null, "left");
        } else {
            doc.text("" + dataOrden.anio_vehiculo, 160, 85, null, null, "left");
        }
        doc.text("PATENTE: ", 10, 95, null, null, "left");
        if (dataOrden.patente === null) {
            doc.text("", 50, 95, null, null, "left");
        } else {
            doc.text(dataOrden.patente, 50, 95, null, null, "left");
        }
        doc.line(2, 100, doc.internal.pageSize.width - 2, 100); // horizontal line
        doc.setFontSize(20)
        doc.setFont("helvetica", "bold");
        doc.text("REPUESTOS", 105, 110, "center");

        var columns = [
            { title: "REPUESTOS", dataKey: "descripcion" },
            { title: "CANTIDAD", dataKey: "unidades" },
        ];

        var objetoRepuestos = data.repuestos;
        var rows = []
        for (let index = 0; index < objetoRepuestos.length; index++) {
            var repuesto = objetoRepuestos[index];
            var dataTabla = {
                "descripcion": repuesto.nombre,
                "unidades": repuesto.unidades
            };
            rows.push(dataTabla)
        }

        doc.autoTable(columns, rows, {
            theme: 'striped',
            startY: 115,
            tableWidth: 'wrap',
            margin: { left: 25 },
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
        doc.setFontSize(15)
        doc.text("*IMPORTANTE* POR FAVOR CONTROLAR LA MERCADERIA QUE RECIBE", 10, doc.internal.pageSize.height - 14, null, null, "left");
        doc.text("PARA EVITAR INCONVENIENTES. GRACIAS", 10, doc.internal.pageSize.height - 7, null, null, "left");

        doc.rect(2, 2, doc.internal.pageSize.width - 4, doc.internal.pageSize.height - 4, 'S');
        var nombrePdf = "REMITO DE ENTREGA - " + dataOrden.nombreVehiculo + " - " + dataOrden.patente + ".pdf";
        doc.save(nombrePdf);
    }

    const aprobarPresupuesto = (e) => {
        navigate('/orden-compra-presupuesto/' + e.target.value);
    }

    const descargarOrdenCompra = (e) => {

    }

    const actualizarPresupusto = (e) => {
        navigate('/actualizar-presupuesto/' + e.target.value);
    }

    const generarRemito = async (idPresupuesto) => {
        // var idPresupuesto = e.target.value;
        var data = {
            id_presupuesto: idPresupuesto
        }
        const responseOrdenCompra = await axios.post(`/api/orden-compra/generar-remito`, data);

        var ordenCompra = {
            ordenCompra: responseOrdenCompra.data.orden,
            repuestos: responseOrdenCompra.data.repuestos
        }
        generarRemitoPDF(ordenCompra)
    }

    const generarPresupuesto = async (e) => {
        var idPresupuesto = e.target.value;
        var data = {
            idPresupuesto: idPresupuesto
        }
        const responsePresupuesto = await axios.get(`/api/presupuestos/` + idPresupuesto);
        const responseRepuestos = await axios.post(`/api/presupuestos/repuestos`, data);
        var presupuesto = {
            presupuesto: responsePresupuesto.data.data,
            repuestos: responseRepuestos.data
        }
        // console.log(presupuesto)
        generarPresupuestoPDF(presupuesto)
    }

    const entregarOrden = (e) => {
        var idPresupuesto = e.target.value;
        const data = {
            id_presupuesto: idPresupuesto
        }
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`/api/orden-compra/remito-entrega`, data).then(res => {
                if (res.data.status === 200) {
                    swal("Todos los repuestos en stock!", res.data.message + " ¿Desea realizar la entrega?", "success", {
                        buttons: {
                            cancel: "Cancelar entrega.",
                            confirm: {
                                text: "Si, generar remito de entrega.",
                                value: "confirm"
                            }
                        },
                    }).then((value) => {
                        switch (value) {
                            case "confirm":
                                generarRemito(idPresupuesto)
                                break;
                            default:
                                axios.get('/sanctum/csrf-cookie').then(response => {
                                    axios.post(`/api/orden-compra/cancelar-remito-entrega`, data).then(res => {
                                        if (res.data.status === 200) {
                                            swal("Exito!", res.data.message, "success");
                                        }
                                    });
                                });
                                break;
                        }
                    });
                } else {
                    swal("Falta stock!", res.data.message, "warning");
                }
            });
        });
    }



    return (
        <>
            <div className="d-flex justify-content-center p-4">
                <h1 className='name'>Administración de Presupuestos</h1>
            </div>

            <div className="d-flex justify-content-center">
                <table className="presupuestosTable table table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Nro Presupuesto</th>
                            <th>Aseguradora</th>
                            <th>Nro Siniestro</th>
                            <th>Vehiculo</th>
                            <th>Patente</th>
                            <th>Status</th>
                            <th colSpan={3}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listadoPresupuestos.map(presupuesto => (
                            <tr key={presupuesto.id_presupuesto}>
                                <td>{presupuesto.id_presupuesto}</td>
                                <td>{presupuesto.nombreAseguradora}</td>
                                <td>{presupuesto.nro_siniestro}</td>
                                <td>{presupuesto.nombreVehiculo}</td>
                                <td>{presupuesto.patente}</td>
                                <td>{presupuesto.status}</td>
                                {/* <td><span class="badge rounded-pill bg-success">{presupuesto.status}</span></td> */}
                                <td hidden={presupuesto.status === 'Enviado'}>
                                    <button type='button' className='btn btn-primary' value={presupuesto.id_presupuesto} onClick={(e) => entregarOrden(e)}>Entregar</button>
                                </td>
                                <td hidden={presupuesto.status === 'Aprobado'}>
                                    <button type='button' className='btn btn-primary' value={presupuesto.id_presupuesto} onClick={(e) => aprobarPresupuesto(e)}>Aprobar</button>
                                </td>
                                <td hidden={presupuesto.status === 'Aprobado'}>
                                    <button type='button' className='btn btn-secondary' value={presupuesto.id_presupuesto} onClick={(e) => actualizarPresupusto(e)}>Actualizar</button>
                                </td>
                                <td hidden={presupuesto.status === 'Enviado'}>
                                    <button type='button' className='btn btn-info' value={presupuesto.id_presupuesto} onClick={(e) => descargarOrdenCompra(e)}>Imprimir Orden</button>
                                </td>
                                <td>
                                    <button type='button' className='btn btn-warning' value={presupuesto.id_presupuesto} onClick={(e) => generarPresupuesto(e)}>Imprimir Presupuesto</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
