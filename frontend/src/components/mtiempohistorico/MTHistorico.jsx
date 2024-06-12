import React, { useEffect, useState, useRef } from 'react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
};

const MTHistorico = () => {
    const [dataset1Data, setData1] = useState([0])
    const [dataset2Data, setData2] = useState([0])

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];


    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset CPU',
                data: dataset1Data,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },

        ],
    };

    const data2 = {
        labels,
        datasets: [
            {
                label: 'Dataset RAM',
                data: dataset2Data,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },

        ],
    };


    const HandlerGetData = async () => {
        console.log('Obteniendo data');
        const response = await fetch("/frontend-app/getHistoricos");
        const data = await response.json();
        console.log(data);
        const listCPU = [];
        const listRAM = [];
        for (let i = 0; i < data.length; i++) {
            console.log(data[i].cpu);
            listCPU.push(data[i].cpu);
            listRAM.push(data[i].ram);
        }
        setData1(listCPU);
        setData2(listRAM);
    }


    return (
        <section className='container'>
            <h1>Historico de tiempo</h1>
            <hr />
            <button className='btn' onClick={HandlerGetData}>Obtener data</button>

            <div className="row">
                <div className='chart-container'>

                    <Line options={options} data={data} />
                </div>
                <div className='chart-container'>
                    <Line options={options} data={data2} />
                </div>

            </div>
        </section>
    );
}

export default MTHistorico;