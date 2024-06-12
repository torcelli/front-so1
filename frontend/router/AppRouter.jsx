import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../src/components/home/Home";
import Simulacion from "../src/components/simulacion/Simulacion";
import MTreal from "../src/components/mtiemporeal/MTreal";
import MTHistorico from "../src/components/mtiempohistorico/MTHistorico";
import ArbolProcesos from "../src/components/arbolprocesos/ArbolProcesos";

const AppRouter = () => {
  return (
    <Routes>
      <Route index path="/home" element={<Home />} />
      <Route path="/simulacion" element={<Simulacion />} />
      <Route path="/mtreal" element={<MTreal />} />
      <Route path="/mthistorico" element={<MTHistorico />} />
      <Route path="/arbolprocesos" element={<ArbolProcesos />} />
      //Comodin
      <Route path="*" element={<Home />} />

    </Routes>
  );
};

export default AppRouter;
