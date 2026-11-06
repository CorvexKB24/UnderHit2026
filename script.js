let puntos = 1000;
let registro = [];
let bloqueados = [];
var suma = new Audio("snd/maspuntos.mp3");
var resta = new Audio("snd/menospuntos.mp3");
var actualizar = new Audio("snd/actualizar.mp3");
resta.volume = 0.15;
suma.volume = 0.25;

const botones = [
    // PENALIZACIONES
    { id: "#golpe", puntos: 30, tipo: "resta", src: "img/puntos/hit.png" },
    { id: "#objeto", puntos: 60, tipo: "resta", src: "img/puntos/item.png" },
    { id: "#muerte", puntos: 150, tipo: "resta", src: "img/puntos/death.png" },

    // RONDA 1
    { id: "#maniqui", puntos: 40, tipo: "suma", src: "img/puntos/dummy.png" },
    { id: "#donuts", puntos: 30, tipo: "suma", src: "img/puntos/donut.png" },
    { id: "#ciders", puntos: 60, tipo: "suma", src: "img/puntos/cider.png" },
    { id: "#vegetoid", puntos: 50, tipo: "suma", src: "img/puntos/vegetoid.png" },
    { id: "#dulces", puntos: 20, tipo: "suma", src: "img/puntos/candy.png" },
    { id: "#flores", puntos: 40, tipo: "suma", src: "img/puntos/trap.png" },
    { id: "#napstablook", puntos: 100, tipo: "suma", src: "img/puntos/napsta.png" },
    { id: "#toriel", puntos: 200, tipo: "suma", src: "img/puntos/toriel.png" },

    // RONDA 2

    // RONDA 3

    // RONDA 4

    // RONDA 5

    // RONDA 6

]

const tabs = document.querySelectorAll(".tabs div");
const contenidos = document.querySelectorAll(".tabcontents > div");

tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
        document.querySelector(".tabs .activa").classList.remove("activa");
        document.querySelector(".tabcontents .activa").classList.remove("activa");

        tab.classList.add("activa");
        contenidos[i].classList.add("activa");
    });
});

const contador = document.querySelector("#cantidad");
const imagen = document.querySelector("#puntos img");
const historial = document.querySelector("#historial");
let temporizador;

function guardar() {
    localStorage.setItem("underhit", JSON.stringify({
        puntos: puntos,
        registro: registro,
        bloqueados: bloqueados
    }));
}

function mostrarPuntos() {
    contador.textContent = puntos + " PUNTOS";

    if (puntos <= 0) {
        contador.classList.add("perdido");
        document.querySelector("#reiniciar").classList.add("perdido")
    } else {
        contador.classList.remove("perdido");
        document.querySelector("#reiniciar").classList.remove("perdido");
    }
}

function crearArticle(tipo, nombre, cantidad) {
    const article = document.createElement("article");
    article.classList.add(tipo);
    article.innerHTML = '<span class="nombre">' + nombre + '</span><span class="cantidad">' + cantidad + '</span>';
    return article;
}

function pulsar(boton, datos) {
    if (datos.tipo == "suma") {
        puntos = puntos + datos.puntos;
        suma.currentTime = 0;
        suma.play();
    } else {
        puntos = puntos - datos.puntos;
        resta.currentTime = 0;
        resta.play();
    }
    mostrarPuntos();

    clearTimeout(temporizador);

    imagen.style.opacity = 0;

    temporizador = setTimeout(function () {
        imagen.src = datos.src;
        imagen.style.opacity = 1;

        temporizador = setTimeout(function () {
            imagen.style.opacity = 0;

            temporizador = setTimeout(function () {
                imagen.src = 'img/puntos/underhit.png';
                imagen.style.opacity = 1;
            }, 500);

        }, 2000);

    }, 300);

    let nombre = boton.value.split(" (")[0];
    let cantidad;
    if (datos.tipo == "suma") {
        cantidad = "+" + datos.puntos;
    } else {
        cantidad = "-" + datos.puntos;
        nombre = nombre.charAt(0) + nombre.slice(1).toLowerCase();
    }

    historial.prepend(crearArticle(datos.tipo, nombre, cantidad));
    registro.push({ tipo: datos.tipo, nombre: nombre, cantidad: cantidad });

    if (datos.tipo == "suma") {
        boton.disabled = true;
        bloqueados.push(datos.id);
    }

    guardar();
}

const guardado = localStorage.getItem("underhit");
if (guardado) {
    const datosGuardados = JSON.parse(guardado);
    puntos = datosGuardados.puntos;
    registro = datosGuardados.registro;
    bloqueados = datosGuardados.bloqueados;

    mostrarPuntos();

    for (let i = 0; i < registro.length; i++) {
        historial.prepend(crearArticle(registro[i].tipo, registro[i].nombre, registro[i].cantidad));
    }

    for (let i = 0; i < bloqueados.length; i++) {
        document.querySelector(bloqueados[i]).disabled = true;
    }
}

for (let i = 0; i < botones.length; i++) {
    const datos = botones[i];
    const boton = document.querySelector(datos.id);

    boton.addEventListener("click", function () {
        pulsar(boton, datos);
    });
}

function reiniciar() {
    localStorage.removeItem("underhit");
    actualizar.currentTime = 0;
    actualizar.play()

    puntos = 1000;
    registro = [];
    bloqueados = [];

    historial.innerHTML = "";
    mostrarPuntos();

    for (let i = 0; i < botones.length; i++) {
        document.querySelector(botones[i].id).disabled = false;
    }
}

document.querySelector("#reiniciar").addEventListener("click", function () {
    if (confirm("¿Seguro que quieres reiniciar? Se perderán los puntos y el historial.")) {
        reiniciar();
    }
});