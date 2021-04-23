
//Bibliotecas nodeJS

var readlineSync = require('readline-sync');
let fs = require('fs');

// Declaração de matrizes

//Matriz do resultado dos sensores do ASV
var Matriz_Mapeamento = [];

//Matriz do precurso do ASV
var Matriz_ASV = [];

//Matriz com as coordenadas reais da área de ação do ASV
var M_Coord = [];

//Vetor para controlo da posição real do ASV das linhas e colunas
var Vet_ASV_Pos = [];

//Vetor para controlo da sequência real das posições do ASV das linhas e colunas
var Vet_ASV_Seq_Pos = [];


//Apenas para estrutura ficar idêntica ao C
main();

//Inicia a matriz mapeamento com zeros 
function Init_Matriz_Map() {
    let i, j;

    for (i = 0; i < 11; i++) {
        Matriz_Mapeamento[i] = [];
        for (j = 0; j < 5; j++) {
            Matriz_Mapeamento[i][j] = 0;
        }
        console.log(Matriz_Mapeamento[i]);
    }
}

//Inicia a matriz mapeamento com O´s
function Init_Matriz_Map_ASV() {
    let i, j;
    for (i = 0; i < 11; i++) {
        Matriz_ASV[i] = [];
        for (j = 0; j < 5; j++) {
            Matriz_ASV[i][j] = 'O';
        }
    }
    console.table(Matriz_ASV);
}

//Inicia a matriz da area de funcionamento do ASV 
//com as respetivas coordenadas e grava em ficheiro

function Init_Matriz_Coord() {
    let i, j, x, y;
    x = 39.544845;
    y = 8.317000;

    for (i = 0; i < 11; i++) {
        M_Coord[i] = [];
        for (j = 0; j < 5; j++) {
            if (j != 0) {
                y -= 0.000020;
            }
        M_Coord[i][j] = { asv_Lat: x.toFixed(6), asv_Long: y.toFixed(6) };
        }
        x += 0.000005;
    }
    fs.writeFileSync("./ASV_Coord.json", JSON.stringify(M_Coord));
    console.table(M_Coord);
}

//lê do ficheiro a matriz da area de funcionamento do ASV com as respetivas coordenadas reais

function Ler_Ficheiro_Init_Matriz_Coord(){
    let i, j;

    M_Coord = JSON.parse(fs.readFileSync('./ASV_Coord.json', 'utf8'));
    console.table(M_Coord);
/* 
    for (i = 0; i < 11; i++) 
        for (j = 0; j < 5; j++) 
            console.log(M_Coord[i][j]); */
}

function ASV_Moves(i, j) {

    let x = 0, y = 0;

    if ((i == 1) && (j == 0)) {
        Matriz_ASV[0][y] = '*';//esta pode-se tirar
        Vet_ASV_Seq_Pos.push({CoordX : 0, CoordY : j});//esta pode-se tirar
        Matriz_ASV[i][j] = '*';
        Vet_ASV_Seq_Pos.push({CoordX : i, CoordY : j});
    }
    else if (Math.abs(Vet_ASV_Pos[0] - i) == 0) {
        Matriz_ASV[i][j] = '*';
        Vet_ASV_Seq_Pos.push({CoordX : i, CoordY : j});
    }
    else if (Math.abs(Vet_ASV_Pos[0] - i) > 1) {
        for (x = Vet_ASV_Pos[0] + 1; x <= i; x++) {
            Matriz_ASV[x][j] = '*';
            Vet_ASV_Seq_Pos.push({CoordX : i, CoordY : j});
        }
    }
    Vet_ASV_Pos[0] = i;
    Vet_ASV_Pos[1] = j;
    console.table(Matriz_ASV);
    console.table(Vet_ASV_Seq_Pos[0]);
}

function fill(i, j){
    let aux_x, aux_y, xi, yi, xf, yf;

    console.log(Matriz_Mapeamento.length,Matriz_Mapeamento[i].length)
    //verificar coordenadas iniciais controlando as linhas i
    if (i == 0){
        xi = i;
        xf = i + 1;
    }
    else{
        xi = i - 1;
        if ((i + 1) > Matriz_Mapeamento.length)
            xf = i;
        else
            xf = i + 1;
    }
    //verificar coordenadas iniciais controlando as colunas j
    if (j == 0){
        yi = j;
        yf = j + 1;
    }
    else{
        yi = j - 1;
        if ((j + 1) > Matriz_Mapeamento[i].length)
            yf = j;
        else
            yf = j + 1;
    }
    console.log(i, j, xi, yi, xf, yf);
    for (aux_x = xi; aux_x <= xf; aux_x++)
        for (aux_y = yi; aux_y <= yf; aux_y++)
            Matriz_Mapeamento[aux_x][aux_y] = 3;
    console.table(Matriz_Mapeamento);
}

// 1 - Viu, 2 - Bloco, 3 - Poluida, 4 -- ambos
function ASV_Mapping() {
    let opt1 = true;
    let opt = 1, poluicao, obst, obst1, obst2;
    let i = 1, j = 0, flag = 0;

    while (opt1) {
        poluicao = readlineSync.question('Sensor poluição 0 ou 3 ? ');//ver o que falta
        if (poluicao == 3){
            fill(i, j);
            obst = readlineSync.question('Sensor meio obstaculo 0 ou 2 ? ');0 
        }
        /* obst = readlineSync.question('Sensor meio obstaculo 0 ou 2 ? ');
        if (poluicao == 0 && obst == 0) {
            Matriz_Mapeamento[i + 1][j] = 1;
            Matriz_Mapeamento[i][j] = 1;
            Matriz_Mapeamento[i - 1][j] = 1;
        }
        else if (obst == 2) {
            Matriz_Mapeamento[i][j] = 2;
            obst1 = readlineSync.question('Sensor cima obstaculo 0 ou 2 ? ');
            if (obst1 == 2) {
                Matriz_Mapeamento[i + 1][j] = 2;
            }
            else if (poluicao == 0) {
                Matriz_Mapeamento[i + 1][j] = 1;
            }
            else
                Matriz_Mapeamento[i + 1][j] = 3;
            obst2 = readlineSync.question('Sensor baixo obstaculo 0 ou 2 ? ');
            if (obst2 == 2) {
                Matriz_Mapeamento[i - 1][j] = 2;
            }
            else if (poluicao == 0) {
                Matriz_Mapeamento[i - 1][j] = 1;
            }
            else
                Matriz_Mapeamento[i - 1][j] = 3;
        }
        else if (poluicao == 3) {
            Matriz_Mapeamento[i + 1][j] = 3;
            Matriz_Mapeamento[i][j] = 3;
            Matriz_Mapeamento[i - 1][j] = 3;
        }
        else {
            Matriz_Mapeamento[i][j] = 4;
        } */
        console.clear();
        console.table(Matriz_Mapeamento);
        ASV_Moves(i, j);
        if ((j < 4) && (flag == 0))
            j++;
        else if ((j == 4) && (flag == 0)) {
            i += 3;
            flag = 1;
        }
        else if ((j > 0) && (flag == 1)) {
            j--;
        }
        else if ((j == 0) && (flag == 1)) {
            i += 3;
            flag = 0;
        }
        //printf("\n i == %d ", i);
        //printf("\n j == %d ", j);
        if (i >= 11)
            opt = 0;
        else {
            opt = readlineSync.question('Sair 0 ou 1 ?');
        }
    }
}

//função callback
function teste(name, cb) {
    console.log(name);
    name = name + "1";
    cb(name);
}

function main() {
    /*      teste("teste", function(name){
            console.log(name);
        })  */

    Init_Matriz_Map();
    //Init_Matriz_Coord();
    //Ler_Ficheiro_Init_Matriz_Coord()
    Init_Matriz_Map_ASV();
    ASV_Mapping();

}
