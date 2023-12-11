import constantes from './constantes.js';

const EnumValoresCampo = {
    espaco: 'espaco',
    parede: 'parede',
    caminho: 'verde',
    fechado: 'fechado',
    aberto: 'aberto'
};

function Node(f, g, h, valorCampo) {
    this.f = f;
    this.g = g;
    this.h = h;
    this.valor = valorCampo;
}

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



let destX, destY;

botaoGerarCaminho.onclick = () => {

    destX = 20, destY = 1;
    let xAtual = 0, yAtual = 19;

    let g = 0;
    let h = calc_h(xAtual, yAtual);
    let f = g + h;
    
    let campoAnalise = inicializarCampoAnalise(xAtual, yAtual, f, g, h);

    while (xAtual !== destX || yAtual !== destY) {
        break;
    }

    desenhar(campoAtual);
}

function inicializarCampoAnalise(xAtual, yAtual, f, g, h) {
    let campoAnalise = Array.from(Array(campoAtual.length), () => []);

    for (let i=0; i<campoAtual.length; i++) {
        for(let j=0; j<campoAtual[i].length; j++) {
            campoAnalise[i][j] = new Node(0, 0, 0, campoAtual[i][j]);
        }
    }

    campoAnalise[xAtual][yAtual] = new Node(f, g, h, EnumValoresCampo.fechado);

    return campoAnalise;
}

function calc_h(xAtual, yAtual) {
    return Math.sqrt((destX - xAtual)**2  + (destY - yAtual)**2);
}

iniciarCampo();