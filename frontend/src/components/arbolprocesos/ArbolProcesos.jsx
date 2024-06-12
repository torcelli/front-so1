import React, { useEffect, useState, useRef } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "./arbolprocesos.css";
import Graphviz from "graphviz-react";

const ArbolProcesos = () => {
    const [arbol, setArbol] = useState([]);
    const [pidPadres, setPidPadres] = useState([]);
    const [selectedPid, setSelectedPid] = useState(null);
    const [dotGraph, setDotGraph] = useState(null);
    const [error, setError] = useState(null);
    const [printedPid, setPrintedPid] = useState(null); // Nuevo estado para almacenar el PID impreso



    const HandlerGetArbol = async () => {
        try {
            const response = await fetch("/frontend-app/getcpu", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setArbol(data.processes);

            // Obtener todos los PID padres
            const padres = data.processes.map((proceso) => proceso.pid);
            setPidPadres(padres);

            setError(null);
        } catch (error) {
            console.error("Error al obtener el arbol de procesos:", error);
            setError("Error al obtener el árbol de procesos");
        }
    };

    const HandlePostPid = async (pid) => {
        try {
            // Modificar la URL para incluir el PID como query parameter
            const response = await fetch(`/frontend-app/getpid?pid=${pid}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }

            const data = await response.text();
            console.log(data)
            setDotGraph(data);
            console.log("Dot del pid:", data);
            setError(null);
        } catch (error) {
            console.error("Error al obtener el dot del pid:", error.message);
            setError("Error al obtener el dot del pid");
        }
    };



    const handlePidChange = (e) => {
        const selectedPid = parseInt(e.target.value, 10);
        setSelectedPid(selectedPid);
    };

    const handlePidClick = () => {
        if (selectedPid !== null) {
            console.log("PID padre seleccionado:", selectedPid);
            setPrintedPid(selectedPid);
            //hacer una petición al backend para obtener el árbol con el PID seleccionado
            HandlePostPid(selectedPid);

        }
    };


    const handleDownloadClick = () => {
        if (dotGraph) {
            // Crear un elemento <a> para descargar la imagen
            const link = document.createElement("a");
            link.href = `data:image/png;base64,${dotGraph}`;
            link.download = "arbol_procesos.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);


        }
    };


    return (
        <section className='container'>
            <h1>Árbol de procesos</h1>
            <hr />



            <div className='container' >
                <div className='row'>
                    <button onClick={HandlerGetArbol} id='btn-arbol'>Obtener árbol</button>
                    <label htmlFor="pidPadre">Seleccionar PID Padre:</label>
                    <select id="pidPadre" onChange={handlePidChange}>
                        <option value={null}>Todos</option>
                        {pidPadres.map((pid) => (
                            <option key={pid} value={pid}>
                                {pid}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='row'>
                    <button onClick={handlePidClick} className='btn'>Mostrar árbol</button>
                    <button onClick={handleDownloadClick} className='btn'>Descargar árbol</button>
                </div>
            </div>

            {//si el dot no es null, mostrar el árbol   
                dotGraph && (
                    <TransformWrapper defaultScale={1}>
                        <TransformComponent>
                            <Graphviz dot={dotGraph} options={{ width: '100%' }} />
                        </TransformComponent>
                    </TransformWrapper>
                )
            }

        </section>
    );
};

export default ArbolProcesos;
