import styles from "@/styles/Home.module.css";
import axios from "axios";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const apiUrl = "https://api-crud-dnla.onrender.com";

export default function Home() {
  const [lista, setLista] = useState([]);
  const [atualiza, setAtualiza] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [abrirEditar, setAbrirEditar] = useState(false);

  const [itemEditar, setItemEditar] = useState({});

  const [loading, setLoading] = useState(false);

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }

  function deletar(id) {
    setLoading(true);
    axios
      .delete(`${apiUrl}/user/${id}`)
      .then((res) => {
        alert("Usuário deletado");
        setAtualiza(!atualiza);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  function abrirModalEditar(data) {
    setItemEditar(data);
    setName(data.name);
    setEmail(data.email);
    setAbrirEditar(!abrirEditar);
  }

  function editar(id) {
    const data = {
      name: name,
      email: email,
    };
    setLoading(true);
    axios
      .put(`${apiUrl}/user/${id}`, data)
      .then((res) => {
        alert("Usuário editado");
        setAtualiza(!atualiza);
        setAbrirEditar(!abrirEditar);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  function adicionar() {
    const data = {
      name: name,
      email: email,
    };
    setLoading(true);
    axios
      .post(`${apiUrl}/user`, data)
      .then((res) => {
        setAtualiza(!atualiza);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  function buscarLista() {
    setLoading(true);
    axios
      .get(`${apiUrl}/users`)
      .then((res) => {
        setLista(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  function renderEditar() {
    return (
      <>
        {loading === true ? renderLoading() : null}
        <div className={styles.modal}>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Nome"
            value={name}
            onChange={handleChangeName}
          />
          <input
            className={styles.input}
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChangeEmail}
          />
          <button
            className={styles.buttonAdicionar}
            onClick={() => editar(itemEditar.id)}
          >
            Adicionar
          </button>
          <button onClick={abrirModalEditar} className={styles.buttonCancelar}>
            Cancelar
          </button>
        </div>
      </>
    );
  }

  function renderLoading() {
    return (
      <div className={styles.loading}>
        <p>Carregando...</p>
      </div>
    );
  }

  useEffect(() => {
    buscarLista();
  }, [atualiza]);

  return (
    <>
      {loading === true ? renderLoading() : null}
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.titulo}>Minha Aplicação</h1>
        <div className={styles.tabela}>
          <div className={styles.header}>
            <h2 className={styles.tituloTabela}>Lista</h2>
            <form>
              <input
                className={styles.input}
                type="text"
                name="name"
                placeholder="Nome"
                onChange={handleChangeName}
              />
              <input
                className={styles.input}
                type="text"
                name="email"
                placeholder="Email"
                onChange={handleChangeEmail}
              />
            </form>
            <button className={styles.buttonAdicionar} onClick={adicionar}>
              Adicionar
            </button>
          </div>
          <div className={styles.items}>
            <p className={styles.item}>Nome</p>
            <p className={styles.item}>Email</p>
            <p className={styles.item}>Opções</p>
          </div>
          {lista.length > 0 && lista !== "No users found" ? (
            lista.map((i) => (
              <div className={styles.items} key={i.id}>
                <p className={styles.item}>{i.name}</p>
                <p className={styles.item}>{i.email}</p>
                <p className={styles.opcoes}>
                  <button
                    className={styles.buttonEditar}
                    onClick={() => abrirModalEditar(i)}
                  >
                    Editar
                  </button>
                  <button
                    className={styles.buttonDeletar}
                    onClick={() => deletar(i.id)}
                  >
                    Deletar
                  </button>
                </p>
              </div>
            ))
          ) : (
            <>Nenhum usuário encontrado</>
          )}
        </div>
        {abrirEditar === true ? renderEditar() : null}
      </main>
    </>
  );
}
