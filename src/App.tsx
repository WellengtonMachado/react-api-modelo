import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProdutoListar from "./components/Produto/ProdutoListar";
import Navbar from "./components/NavBar/Navbar";
import Home from "./components/Home/Home";
import { ToastContainer } from "react-toastify";
import ClienteListar from "./components/Cliente/ClienteListar";
import TarefaListar from "./components/Tarefa/TarefaListar";
import UsuarioListar from "./components/Usuario/UsuarioListar";


const App: React.FC = function () {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Produto" element={<ProdutoListar />} />
        <Route path="/Cliente" element={<ClienteListar />} />
        <Route path="/Usuario" element={<UsuarioListar />} />
        <Route path="/Tarefa" element={<TarefaListar />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
