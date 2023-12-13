import constantes from './constantes.js';
import gerarCaminho from './encontrarCaminho.js';
export default desenhar;

const EnumValoresCampo = {
    espaco: 'espaco',
    parede: 'parede',
    caminho: 'caminho',
    fechado: 'fechado',
    aberto: 'aberto'
};

const valoresCampo = Object.values(EnumValoresCampo);

const grade = document.getElementById('grid');
const botaoGerarCampo = document.getElementById('botaoGerarCampo');
const botaoGerarCaminho = document.getElementById('botaoGerarCaminho');

let campoAtual;

function criarCampoAleatorio() {
    const matriz = [];
    for (let i = 0; i < 20; i++) {
        matriz[i] = [];
        for (let j = 0; j < 20; j++) {
            const indiceAleatorio = getNumeroAleatorio(2);
            const valorEnumAleatorio = valoresCampo[indiceAleatorio];
            matriz[i][j] = valorEnumAleatorio;
        }
    }
    return matriz;
}

function getNumeroAleatorio(max) {
    return Math.floor(Math.random() * max);
}

function desenhar(matriz) {
    grade.innerHTML = '';
    const gridContainer = document.getElementById('grid');

    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            const celula = document.createElement('div');
            celula.className = `grid-item ${matriz[i][j]}`;
            gridContainer.appendChild(celula);
        }
    }
}

function criarCampoPadrao() {
    
    const campo = [];

    const linhas = constantes.padraoString.split("n");

    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];
        campo[i] = [];

        for (let j = 0; j < linha.length; j++) {
            const caractere = linha.charAt(j);
            campo[i][j] = valoresCampo[parseInt(caractere)];
        }
    }

    return campo;
}

function iniciarCampo() {
    campoAtual = Array(20).fill().map(() => Array(20).fill(EnumValoresCampo.espaco));
    desenhar(campoAtual);
}

botaoGerarCampo.onclick = () => {

    botaoGerarCaminho.style.display = 'inline-block';

    campoAtual = criarCampoPadrao();

    desenhar(campoAtual);
}

botaoGerarCaminho.onclick = () => {
    gerarCaminho(campoAtual);
}

iniciarCampo();