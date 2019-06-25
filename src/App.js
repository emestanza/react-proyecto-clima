import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Formulario from "./components/Formulario";
import Clima from "./components/Clima";
import Error from "./components/Error";

import "./index.css";

function App() {
    // State princial
    // ciudad = state, guardarCiudad = this.setState()
    const [ciudad, guardarCiudad] = useState("");
    const [pais, guardarPais] = useState("");
    const [error, guardarError] = useState(false);
    const [resultado, guardarResultado] = useState({});

    //useEffect
    //realiza el codigo dentro en caso que los states pasados por array, se actualicen
    //https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {

        // prevenir ejecución
        if (ciudad === "") return;

        const consultarAPI = async () => {

            const appId = "cdbe21c66f7fe8b82356e7eab49b3d08";
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

            // consultar la URL
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            console.log(resultado);
            guardarResultado(resultado);
        };

        consultarAPI();
    }, [ciudad, pais]);

    /**
     * Funcion que verifica los valores enviados por el componente <Formulario>
     * Realiza guardados que vienen siendo actualizaciones en el state
     * @param {object} datos 
     */
    const datosConsulta = datos => {
        
        // Validar que ambos campos estén
        if (datos.ciudad === "" || datos.pais === "") {
            guardarError(true);
            return;
        }

        // Ciudad y pais existen, agregarlos al state
        guardarCiudad(datos.ciudad);
        guardarPais(datos.pais);
        guardarError(false);
    };

    // Cargar un componente Condicionalmente
    let componente;
    if (error) {
        // Hay un error, mostrarlo
        componente = <Error mensaje="Ambos campos son obligatorios" />;
    } else if (resultado.cod === "404") {
        componente = (
            <Error mensaje="La ciudad no existe en nuestro registro" />
        );
    } else {
        // Mostrar el Clima
        componente = <Clima resultado={resultado} />;
    }

    return (
        <div className="App">
            <Header titulo="React Clima app" />

            <div className="contenedor-form">
                <div className="container">
                    <div className="row">
                        <div className="col s12 m6">
                            <Formulario datosConsulta={datosConsulta} />
                        </div>
                        <div className="col s12 m6">{componente}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
