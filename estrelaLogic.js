import constantes from './constantes.js';
import gerarCaminho from './encontrarCaminho.js';
export default desenharNos;

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
const unidade = 10;

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

function desenharNos(matriz) {
    grade.innerHTML = '';
    const gridContainer = document.getElementById('grid');

    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            const celula = document.createElement('div');
            celula.className = `grid-item ${matriz[i][j].valor}`;
            celula.style.fontSize = '10px';

            if(matriz[i][j].f !== 0) {
                const f = Math.floor(matriz[i][j].f * unidade);
                const g = Math.floor(matriz[i][j].g * unidade);
                const h = Math.floor(matriz[i][j].h * unidade);
    
                celula.innerHTML = `F: ${f}<br>G: ${g}<br>H: ${h}`;
            }

            gridContainer.appendChild(celula);
        }
    }
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