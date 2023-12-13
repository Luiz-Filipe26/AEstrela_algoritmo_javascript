import desenhar from './estrelaLogic.js';
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

let destX, destY;
let abertos = [];
let fechados = [];
let campoAtual;

async function gerarCaminho(campo) {
    
    campoAtual = campo;
    let posAtual = new Posicao(0, 18);

    destX = 20, destY = 1;
    abertos.push(posAtual);


    let g = 0;
    let h = calc_h(posAtual.x, posAtual.y);
    let f = g + h;
    
    let campoAnalise = inicializarCampoAnalise( posAtual, f, g, h);

    while (posAtual.x !== destX || posAtual.y !== destY) {
        let indiceMenorF = getIndiceMenorF(campoAnalise);
        posAtual = abertos[indiceMenorF];
        open(campoAnalise, indiceMenorF, posAtual);
        desenhar(converterCampo(campoAnalise));

        await esperar(200);
    }

    desenhar(campoAtual);
}

function open(campoAnalise, indiceMenorF, posCentral) {
    let fCentral = campoAnalise[posCentral.y][posCentral.x].f;

    for(let i = -1; i<=1; i++) {
        for(let j = -1; j<=1; j++) {
            let posAtual = new Posicao(posCentral.x + j, posCentral.y + i);
            if(i === 0 && j === 0) {
                campoAnalise[posCentral.y][posCentral.x].valor = EnumValoresCampo.fechado;
                fechados.push(posCentral);
                abertos.splice(indiceMenorF, 1);
            }
            else if(indiceValido(posAtual, i, j) && campoValido(campoAnalise, posAtual)) {

                let g = calc_g(fCentral, j, i);
                let h = calc_h(posCentral, j, i);
                let f = g + h;

                const posIndex = abertos.findIndex(p => p.x === posAtual.x && p.y === posAtual.y);
                
                if (posIndex >= 0) {
                    const valorCampo = campoAnalise[posAtual.y][posAtual.x].valorCampo;
                    if (f < campoAnalise[posAtual.y][posAtual.x].f) {
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

function campoValido(campoAnalise, posicao) {
    return campoAnalise[posicao.y][posicao.x].valor === EnumValoresCampo.aberto || campoAnalise[posicao.y][posicao.x].valor === EnumValoresCampo.espaco;
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

function esperar(milisegundos) {
    return new Promise(resolve => setTimeout(resolve, milisegundos));
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


function converterCampo(campoAnalise) {
    let campo = Array.from(Array(campoAnalise.length), () => []);
    for (let i=0; i<campoAnalise.length; i++) {
        for(let j=0; j<campoAnalise[i].length; j++) {
            campo[i][j] = campoAnalise[i][j].valor;
        }
    }

    return campo;
}