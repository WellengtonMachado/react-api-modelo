import React, { useState, useEffect } from "react";
import { Tarefa } from "../../interfaces/Tarefa/Tarefa";
import { AxiosResponse } from "axios";

import "./TarefaListar.css";
import ModalTarefa from "./modal/ModalTarefa";
import ModalTarefaDelete from "./modal/ModalTarefaDelete";
import tarefaService from "../../services/TarefaService";
import ModalTarefaEdit from "./modal/ModalTarefaEdit";
import { toast, Bounce } from "react-toastify";

function getStatus(status: number) {
  switch (status) {
    case 1:
      return "To Do";
    case 2:
      return "Em Progresso";
    case 3:
      return "Bloqueado";
    case 4:
      return "Completo";
    default:
      return "Status desconhecido";
  }
}

const TarefaListar: React.FC = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [modalExclusaoAberta, setModalExclusaoAberta] = useState(false);
  const [tarefaSelecionado, setTarefaSelecionado] = useState<Tarefa | null>(
    null
  );
  const [modalAberta, setModalAberta] = useState(false);
  const [modalEdicaoAberta, setModalEdicaoAberta] = useState(false);
  const [tarefaEditado, setTarefaEditado] = useState<Tarefa | null>(null);
  const [nomePesquisado, setNomePesquisado] = useState("");

  useEffect(() => {
    recarregarTarefas();
  }, []);

  const recarregarTarefas = async () => {
    try {
      const tarefas = await tarefaService.getAll();
      setTarefas(tarefas);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  const abrirModalExclusao = (tarefa: Tarefa) => {
    setTarefaSelecionado(tarefa);
    setModalExclusaoAberta(true);
  };

  const fecharModalExclusao = () => {
    setTarefaSelecionado(null);
    setModalExclusaoAberta(false);
  };

  const handleConfirmarExclusao = async () => {
    if (tarefaSelecionado) {
      try {
        // Chama o serviço de exclusão da tarefa
        await tarefaService.delete(tarefaSelecionado.id.toString());

        // Ações após a exclusão bem-sucedida
        await recarregarTarefas();
        fecharModalExclusao();

        toast.success("Tarefa excluída com sucesso!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } catch (error: any) {
        console.error("Erro ao excluir uma Tarefa:", error);

        const errorMessage =
          error.response?.data?.message ||
          "Ocorreu um erro ao excluir a Tarefa";

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    }
  };

  const abrirModal = () => {
    setModalAberta(true);
  };

  const fecharModal = () => {
    setModalAberta(false);
  };

  const abrirModalEdicao = (tarefa: Tarefa) => {
    setTarefaEditado(tarefa);
    setModalEdicaoAberta(true);
  };

  const fecharModalEdicao = () => {
    setTarefaEditado(null);
    setModalEdicaoAberta(false);
  };

  const handleTarefaEditado = async (tarefa: Tarefa) => {
    try {
      await tarefaService.update(tarefa.id.toString(), tarefa);
      await recarregarTarefas();
      fecharModalEdicao();

      toast.success("Tarefa atualizada com sucesso.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Erro ao editar a Tarefa:", error);

      toast.error("Ocorreu um erro ao atualizar a tarefa", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleTarefaCadastrado = async (tarefa: Tarefa) => {
    setTarefas((prevTarefas) => [...prevTarefas, tarefa]);

    await recarregarTarefas();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nomePesquisado.trim() === "") {
      toast.error("Nome da Tarefa não pode estar vazio.");
      return;
    }
    try {
      const tarefaPesquisada = await tarefaService.getName(nomePesquisado);
      if (tarefaPesquisada) {
        setTarefas([tarefaPesquisada]);
        toast.success("Tarefa encontrada com sucesso!");
      } else {
        toast.warning("Nenhuma tarefa encontrada.");
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      toast.error("Erro ao buscar tarefas.");
    }
  };

  return (
    <div className="tarefa-Container">
      <h3>Cadastro de Tarefas</h3>
      <header className="header">
        <div>
          <button className="btn btn-success" onClick={abrirModal}>
            Cadastrar
          </button>
        </div>
        <div className="botao_pesquisa">
          <form className="form-inline" onSubmit={handleSubmit}>
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Pesquisar"
              aria-label="Pesquisar"
              value={nomePesquisado}
              onChange={(e) => setNomePesquisado(e.target.value)}
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
            >
              Pesquisar
            </button>
          </form>
        </div>
      </header>
      {tarefas.length > 0 ? (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Nome Projeto</th>
              <th scope="col">Nome Tarefa</th>
              <th scope="col">Data Inicial</th>
              <th scope="col">Data Entrega</th>
              <th scope="col">Prioridade</th>
              <th scope="col">Status</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tarefas.map((tarefa) => (
              <tr key={tarefa.id}>
                <td>{tarefa.nomeProjeto}</td>
                <td>{tarefa.nomeTarefa}</td>
                <td>
                  {new Date(tarefa.dataInicial).toLocaleDateString("pt-BR")}
                </td>
                <td>
                  {new Date(tarefa.dataEntrega).toLocaleDateString("pt-BR")}
                </td>
                <td>{tarefa.prioridade}</td>
                <td>{getStatus(tarefa.status)}</td>

                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => abrirModalEdicao(tarefa)}
                  >
                    Visualizar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => abrirModalExclusao(tarefa)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhuma tarefa encontrada.</p>
      )}
      <ModalTarefa
        isOpen={modalAberta}
        onClose={fecharModal}
        onTarefaCadastrado={handleTarefaCadastrado}
        recarregarTarefas={recarregarTarefas}
      />
      <ModalTarefaDelete
        isOpen={modalExclusaoAberta}
        onClose={fecharModalExclusao}
        tarefa={tarefaSelecionado || undefined}
        onConfirm={handleConfirmarExclusao}
      />
      <ModalTarefaEdit
        isOpen={modalEdicaoAberta}
        onClose={fecharModalEdicao}
        tarefa={tarefaEditado}
        onTarefaEditado={handleTarefaEditado}
      />
    </div>
  );
};

export default TarefaListar;
