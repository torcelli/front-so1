import React, { useEffect, useRef, useState } from "react";
import "./simulacion.css";
import VisNetwork from "./VisNetwork";

const Simulacion = () => {

    const [dot, setDot] = useState("");
    const [pid, setPid] = useState(0);

    //funcion para hacer el fetch que se utilizará en newGraph y crear un pid
    const HandlerhNew = async () => {
        const response = await fetch("/frontend-app/start", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        setPid(data.pid);
        console.log(data);
    };

    //funcion para hacer el fetch de todas las demás señales
    const HandlerSignal = async (instruction) => {
        const response = await fetch("/frontend-app/" + instruction + "?pid=" + pid, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log(data);
    };




    //funcion para el boton new
    const newGraph = () => {
        //getPid();
        console.log("New");
        // Se crean los nodos new, ready y running
        let nodos = `
          digraph {
            rankdir=LR;
            1 [label="New"];
            2 [label="Ready"];
            3 [label="Running", color="green",fontcolor="white",];
            1 -> 2 [dir=none];
            2 -> 3 [dir=none];
          }`;
        setDot(nodos);
        HandlerhNew();
    }


    const stopGraph = () => {
        console.log("Stop");
        //substraer el ultimo corchete y agregar el nodo stop
        let nodos = `
        digraph {
            rankdir=LR;
        1 [label="New"];
        2 [label="Ready", color="green",fontcolor="white",];
        3 [label="Running"];
        1->2 [dir=none];
        2->3 [dir=none];
        3->2}`
        setDot(nodos);
        HandlerSignal("stop");
    }

    const readyGraph = () => {
        console.log("Ready");
        //substraer el ultimo corchete y agregar el nodo ready
        let nodos = `
        digraph {
            rankdir=LR;
        1 [label="New"];
        2 [label="Ready"];
        3 [label="Running", color="green",fontcolor="white",];
        1->2 [dir=none];
        2->3 ;
        3->2[dir=none]
    }`
        setDot(nodos);
        HandlerSignal("resume");
    }

    const killGraph = () => {
        console.log("Kill");
        //substraer el ultimo corchete y agregar el nodo kill
        let nodos = `
        digraph {
            rankdir=LR;
        1 [label="New"];
        2 [label="Ready"];
        3 [label="Running"];
        4 [label="Terminated", color="red",fontcolor="white",];
        1->2 [dir=none];
        2->3 [dir=none];
        3->2[dir=none];
        3->4;
    }`
        setDot(nodos);
        HandlerSignal("kill");
    }

    const getPid = () => {
        //crear un pid aleatorio
        let pid = Math.floor(Math.random() * 1000);
        setPid(pid);
    }

    return (
        <section className='container'>
            <h1>Simulacion</h1>
            <hr></hr>
            <div className="simu">

                <label>PID: {pid}</label>
                <section className="panel-btn">
                    <button className="bnew" onClick={newGraph}>New</button>
                    <button className="bstop" onClick={stopGraph}>Stop</button>
                    <button className="bready" onClick={readyGraph}>Ready</button>
                    <button className="bkill" onClick={killGraph}>Kill</button>
                </section>

                <VisNetwork dot={dot} />

            </div>
        </section>
    );
};

export default Simulacion;