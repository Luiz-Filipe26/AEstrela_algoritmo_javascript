import desenharNos from './estrelaLogic.js';
export default gerarCaminho;

const EnumValoresCampo = {
    espaco: 'espaco',
    parede: 'parede',
    caminho: 'caminho',
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

const unidadePassoReto = 10;
const unidadePassoDiagonal = Math.floor(unidadePassoReto * Math.sqrt(2));

let xInicial, yInicial;
let destX, destY;

let abertos = [];
let fechados = [];
let campoAtual;

let continuar = true;

const botaoContinuar = document.getElementById('botaContinuar');

async function gerarCaminho(campo) {
    
    campoAtual = campo;

    xInicial = 0, yInicial = 18;
    destX = 19, destY = 1;


    let posAtual = new Posicao(xInicial, yInicial);
    abertos.push(posAtual);
 

    let g = 0;
    let h = calc_h(posAtual);
    let f = g + h;

    let indiceMenorF;
    
    let campoAnalise = inicializarCampoAnalise();
    campoAnalise[posAtual.y][posAtual.x] = new Node(f, g, h, 0, 0, EnumValoresCampo.aberto);

    while (posAtual.x !== destX || posAtual.y !== destY) {
        indiceMenorF = getIndiceMenorF(campoAnalise);
        posAtual = abertos[indiceMenorF];

        abrir(campoAnalise, indiceMenorF, posAtual);
        desenharNos(campoAnalise);
        //desenharCaminho(campoAnalise);

        await esperarClique();
        continuar = false;
    }

    campoAnalise = [];
    desenharCaminho(campoAnalise);
}

function abrir(campoAnalise, indiceMenorF, posCentral) {
    let noCentral = campoAnalise[posCentral.y][posCentral.x];
    let gCentral = noCentral.g;

    for(let i = -1; i<=1; i++) {
        for(let j = -1; j<=1; j++) {
            let posAtual = new Posicao(posCentral.x + j, posCentral.y + i);

            if(i === 0 && j === 0) {
                noCentral.valor = EnumValoresCampo.fechado;
                fechados.push(posCentral);
                abertos.splice(indiceMenorF, 1);
            }
            else if(indiceValido(posAtual) && campoValido(campoAnalise, posAtual)) {

                let g = calc_g(gCentral, j, i);
                let h = calc_h(posAtual);
                let f = g + h;

                const posIndex = abertos.findIndex(p => p.x === posAtual.x && p.y === posAtual.y);
                
                if (posIndex >= 0) {
                    if (f < abertos[posIndex].f) {
                        campoAnalise[posAtual.y][posAtual.x] = new Node(f, g, h, j, i, EnumValoresCampo.aberto);
                    }
                } else {
                    campoAnalise[posAtual.y][posAtual.x] = new Node(f, g, h, j, i, EnumValoresCampo.aberto);
                    abertos.push(new Posicao(posAtual.x, posAtual.y));
                }
            }
        }
    }
}

function getIndiceMenorF(campoAnalise){
    let posicao = abertos[0];
    let menorF = campoAnalise[posicao.y][posicao.x].f;
    let indiceMenorF = 0;

    for(let i=1; i<abertos.length; i++) {
        posicao = abertos[i];
        if(campoAnalise[posicao.y][posicao.x].f < menorF) {
            menorF = campoAnalise[posicao.y][posicao.x].f;
            indiceMenorF = i;
        }
    }

    return indiceMenorF;
}

function indiceValido(posicao) {
    return (posicao.x >= 0 && posicao.x < campoAtual.length && posicao.y >= 0 && posicao.y <campoAtual[0].length);
}

function campoValido(campoAnalise, posicao) {
    return campoAnalise[posicao.y][posicao.x].valor === EnumValoresCampo.aberto || campoAnalise[posicao.y][posicao.x].valor === EnumValoresCampo.espaco;
}

function calc_g(g, dx, dy) {
    return g + ((dx !== 0 && dy !== 0) ? unidadePassoDiagonal : unidadePassoReto);
}

function calc_h(posicao) {
    const dx = Math.abs(destX - posicao.x);
    const dy = Math.abs(destY - posicao.y);
    const passosDiagonais = Math.min(dx, dy);
    const passosRetos = Math.abs(dx - dy);
    return Math.floor(passosDiagonais * unidadePassoDiagonal + passosRetos * unidadePassoReto);
}

function inicializarCampoAnalise() {
    let campoAnalise = Array.from(Array(campoAtual.length), () => []);

    for (let i=0; i<campoAtual.length; i++) {
        for(let j=0; j<campoAtual[i].length; j++) {
            campoAnalise[i][j] = new Node(0, 0, 0, 0, 0, campoAtual[i][j]);
        }
    }

    return campoAnalise;
}

function desenharCaminho(campoAnalise) {
    let novoCampo = inicializarCampoAnalise();
    let posicao = fechados[fechados.length - 1];

    novoCampo[yInicial][xInicial] = campoAnalise[yInicial][xInicial];
    novoCampo[yInicial][xInicial].valor = EnumValoresCampo.caminho;

    while(posicao.x !== xInicial && posicao.y !== yInicial) {
        novoCampo[posicao.y][posicao.x] = campoAnalise[posicao.y][posicao.x];
        novoCampo[posicao.y][posicao.x].valor = EnumValoresCampo.caminho;
        posicao = new Posicao(posicao.x - campoAnalise[posicao.y][posicao.x].dx, posicao.y - campoAnalise[posicao.y][posicao.x].dy);
    }
    
    desenharNos(novoCampo);
}


botaoContinuar.onclick = () => {
    continuar = true;
}

function esperarClique() {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (continuar) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });
}

function esperarTempo(milisegundos) {
    return new Promise(resolve => setTimeout(resolve, milisegundos));
}