import constantes from './constantes.js';

const EnumValoresCampo = {
    espaco: 'espaco',
    parede: 'parede',
    caminho: 'verde',
    fechado: 'fechado',
    aberto: 'aberto'
};

function Node(f, g, h, dx, dy, valor) {
    this.f = f;
    this.g = g;
    this.h = h;
    this.valor = valor;
    this.dx = dx;
    this.dy = dy;
}

function Posicao(x, y) {
    this.x = x;
    this.y = y;
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
let abertos = [];
let fechados = [];

botaoGerarCaminho.onclick = () => {

    destX = 20, destY = 1;

    let posAtual = new Posicao(0, 18);
    abertos.push(posAtual);

    let g = 0;
    let h = calc_h(posAtual.x, posAtual.y);
    let f = g + h;
    
    let campoAnalise = inicializarCampoAnalise(posAtual, f, g, h);

    gerarCaminho(campoAnalise, posAtual);
}

function esperaUmSegundo() {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

async function gerarCaminho(campoAnalise, posAtual) {

    let indiceMenorF = 0;

    while (posAtual.x !== destX || posAtual.y !== destY) {
        open(campoAnalise, indiceMenorF, posAtual);
        indiceMenorF = getIndiceMenorF(campoAnalise);
        posAtual = abertos[indiceMenorF];
        desenharCampoAnalise(campoAnalise);
        await esperaUmSegundo();
    }

    desenhar(campoAtual);
}

function desenharCampoAnalise(campoAnalise) {
    let campo = Array.from(Array(campoAtual.length), () => []);
    for (let i=0; i<campoAnalise.length; i++) {
        for(let j=0; j<campoAnalise[i].length; j++) {
            campo[i][j] = campoAnalise[i][j].valor;
        }
    }

    desenhar(campo);
}

function open(campoAnalise, indiceMenorF, posAtual) {
    let fCentral = campoAnalise[posAtual.y][posAtual.x].f;

    for(let i = -1; i<=1; i++) {
        for(let j = -1; j<=1; j++) {
            if(i === 0 && j === 0) {
                campoAnalise[posAtual.y][posAtual.x].valorCampo = EnumValoresCampo.fechado;
                fechados.push(posAtual);
                abertos.splice(indiceMenorF, 1);
            }
            else if(indiceValido(posAtual, i, j) && campoValido(posAtual)) {

                let g = calc_g(fCentral, j, i);
                let h = calc_h(posAtual, j, i);
                let f = g + h;

                campoAnalise[posAtual.y + i][posAtual.x + j] = new Node(f, g, h, j, i, EnumValoresCampo.aberto);
                abertos.push(new Posicao(posAtual.x + j, posAtual.y + i));
            }
        }
    }
}

function getIndiceMenorF(campoAnalise){
    let menorF = 0;
    let indiceMenorF = 0;

    for(let i=1; i<abertos.length; i++) {
        let posicao = abertos[i];
        if(menorF === 0 || campoAnalise[posicao.y][posicao.x].f < menorF) {
            menorF = campoAnalise[posicao.y][posicao.x].f;
            indiceMenorF = i;
        }
    }

    return indiceMenorF;
}

function indiceValido(posicao, i, j) {
    return (posicao.x + j >= 0 && posicao.x + j<campoAtual.length && posicao.y + i>= 0 && posicao.y + i <campoAtual[0].length);
}

function campoValido(posicao) {
    return campoAtual[posicao.y][posicao.x] === EnumValoresCampo.aberto || campoAtual[posicao.y][posicao.x] === EnumValoresCampo.espaco;
}

function calc_g(f, dx, dy) {
    return f + calc_dist(0, 0, dx, dy);
}

function calc_h(posicao) {
    return calc_dist(posicao.x, destX, posicao.y, destY);
}

function calc_dist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1)**2  + (y2 - y1)**2);
}

function inicializarCampoAnalise(posAtual, f, g, h) {
    let campoAnalise = Array.from(Array(campoAtual.length), () => []);

    for (let i=0; i<campoAtual.length; i++) {
        for(let j=0; j<campoAtual[i].length; j++) {
            campoAnalise[i][j] = new Node(0, 0, 0, 0, 0, campoAtual[i][j]);
        }
    }

    campoAnalise[posAtual.y][posAtual.x] = new Node(f, g, h, 0, 0, EnumValoresCampo.aberto);

    return campoAnalise;
}

iniciarCampo();