import React, { useEffect, useState, useRef } from 'react';
import "./mtreal.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const MTreal = () => {
    const [resultText, setResultText] = useState("");
    const isMounted = useRef(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/frontend-app/getram");
                const data = await response.json();

                if (isMounted) {
                    setResultText(data);
                }
            } catch (error) {
                console.error("Error al obtener CPU:", error);
            }
        };

        const interval = setInterval(fetchData, 1000);

        return () => {
            clearInterval(interval);
            isMounted.current = false;
        };

    }, []);

    // Verificar que resultText se actualice
    useEffect(() => {
        console.log("Nuevo valor de resultText:", resultText);
        console.log("Nuevo valor de resultText.cpu:", resultText.cpu);
    }, [resultText]);
    try {
        const ramData = resultText.ram;
        const cpuData = resultText.cpu;
        console.log("cpu porcentaje: ", cpuData.cpu_porcentaje);

        const chartData = {
            labels: ["Usado", "Libre"],
            datasets: [
                {
                    label: "Utilización de RAM",
                    data: [ramData.libre, ramData.memoriaEnUso],
                    backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
                    borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
                    borderWidth: 1,
                },
            ],

        };

        const chartDataCpu = {

            labels: ["Usado", "Libre"],
            datasets: [
                {
                    label: "Utilización del CPU",
                    data: [cpuData.cpu_porcentaje / 100000, 100 - (cpuData.cpu_porcentaje / 100000)],
                    backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
                    borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
                    borderWidth: 1,
                },
            ],

        };




        return (
            <div id="App" >


                <section className='container'>
                    <h1>Monitoreo en tiempo real</h1>
                    <hr></hr>
                    <div className='row'>
                        <div className='chart-container'>
                            <h2>RAM</h2>
                            <Doughnut
                                data={chartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: true,
                                    cutout: '50%',
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'top',
                                        },
                                    },
                                }}
                            />
                        </div>
                        <div className='chart-container'>
                            <h2>CPU</h2>
                            <Doughnut
                                data={chartDataCpu}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: true,
                                    cutout: '50%',
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'top',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </section>
            </div>
        );
    } catch (error) {
        console.error("Error al parsear el resultado JSON:", error);
        return (
            <div id="App">
                <section className='container'>
                    <h1>Monitoreo en tiempo real</h1>
                    <hr></hr>
                    <div id="result" className="result">Error al procesar los datos de RAM</div>
                </section>
            </div>
        );
    }
}
export default MTreal;
