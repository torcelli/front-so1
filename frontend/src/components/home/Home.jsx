import React from "react";
import "./home.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Home = () => {
  return (
    <div className="jumbotron jumbotron-fluid mt-5">
      <div className="container" id="home">
        <h1 className="display-4" id="title">
          SO1-PROYECTO1
        </h1>
        <p className="lead">
         Primer proyecto de Sistemas Operativos 1
        </p>
        <p>Angel Torcelli - 201801169</p>
      </div>
    </div>
  );
};

export default Home;
