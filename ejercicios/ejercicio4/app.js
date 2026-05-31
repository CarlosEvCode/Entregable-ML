let clasificador;
let video;
let flippedVideo;
let valorConfianza = 0;
let ultimoObjetoHablado = ""; // Evitar repetición constante en bucle

// Cargar modelo
function preload() {
    clasificador = ml5.imageClassifier("../../assets/models/model.json");
}

function setup() {
    let lienzo = createCanvas(640, 480);
    lienzo.parent("canvas-container");
    
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();
    
    flippedVideo = ml5.flipImage(video);
    
    clasificarVideo();
}

function draw() {
    // Dibujar video invertido en el canvas
    if (flippedVideo) {
        image(flippedVideo, 0, 0, width, height);
    }
}

// Iniciar clasificacion
function clasificarVideo() {
    flippedVideo = ml5.flipImage(video);
    clasificador.classify(flippedVideo, gotResult);
}

function gotResult(error, resultados) {
    if (error) {
        console.error(error);
        return;
    }
    
    let etiqueta = resultados[0].label;
    valorConfianza = resultados[0].confidence * 100;
    
    let etiquetaHTML = document.getElementById("resultado-etiqueta");
    let confianzaHTML = document.getElementById("resultado-confianza");
    
    // Evaluar si supera el 50%
    if (valorConfianza > 50) {
        etiquetaHTML.innerHTML = "Objeto: " + etiqueta;
        confianzaHTML.innerHTML = "Confianza: " + valorConfianza.toFixed(2) + "%";
        
        // Alarma de voz
        if (etiqueta !== ultimoObjetoHablado) {
            // Cancelar cola de voz anterior
            speechSynthesis.cancel();
            
            let mensaje = new SpeechSynthesisUtterance(etiqueta);
            mensaje.lang = "es-ES";
            speechSynthesis.speak(mensaje);
            
            console.log("Voz: " + etiqueta);
            ultimoObjetoHablado = etiqueta;
        }
    } else {
        // Limpiar
        etiquetaHTML.innerHTML = "Buscando objetos...";
        confianzaHTML.innerHTML = "";
        ultimoObjetoHablado = "";
    }
    
    clasificarVideo();
}
