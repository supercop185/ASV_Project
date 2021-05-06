
//Bibliotecas nodeJS

var readlineSync = require('readline-sync');
let fs = require('fs');
const { Console } = require('console');

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
        //console.log(Matriz_Mapeamento[i]);
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
    //console.table(Matriz_ASV);
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

//const nome = require("./ASV_Coord.json");

function Ler_Ficheiro_Init_Matriz_Coord() {
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
    let Vet_ASV_Dir = [024, 025, 026, 027]

    if ((i == 1) && (j == 0)) {
        Matriz_ASV[0][y] = '*';//esta pode-se tirar
        Vet_ASV_Seq_Pos.push({ CoordX: 0, CoordY: j });//esta pode-se tirar
        Matriz_ASV[i][j] = '*';
        Vet_ASV_Seq_Pos.push({ CoordX: i, CoordY: j });
    }
    else if (Math.abs(Vet_ASV_Pos[0] - i) == 0) {
        Matriz_ASV[i][j] = '*';
        Vet_ASV_Seq_Pos.push({ CoordX: i, CoordY: j });
    }
    else if (Math.abs(Vet_ASV_Pos[0] - i) > 1) {
        for (x = Vet_ASV_Pos[0] + 1; x <= i; x++) {
            Matriz_ASV[x][j] = '*';
            Vet_ASV_Seq_Pos.push({ CoordX: i, CoordY: j });
        }
    }
    Vet_ASV_Pos[0] = i;
    Vet_ASV_Pos[1] = j;
    /*     var ss = String.fromCharCode(Vet_ASV_Dir[0]);
        console.log("sentido", ss); */
    //console.table(Vet_ASV_Seq_Pos[0]);
}

//função experimental preenchimento obstaculos
//Com Head´s
//O Retorno dos J tem de se ler invertido
function direction(i, j, head) {

    let auxIJ = [];

    if (head == 'R' || head == 'L') {
        if (i - 1 >= 0)
            auxIJ[0] = i - 1;
        else
            auxIJ[0] = i;
        auxIJ[1] = i;
        if (i + 1 <= Matriz_Mapeamento.length)
            auxIJ[2] = i + 1;
        else
            auxIJ[2] = i;
        if (head == 'R') {
            if (j + 1 <= Matriz_Mapeamento[i].length)
                auxIJ[3] = j + 1;
            else
                auxIJ[3] = j;
        }
        else {
            if (j - 1 >= 0)
                auxIJ[3] = j - 1;
            else
                auxIJ[3] = j;

        }
        return (auxIJ);
    }
    else {
        if (j - 1 >= 0)
            auxIJ[0] = j - 1;
        else
            auxIJ[0] = j;
        auxIJ[1] = j;
        if (j + 1 <= Matriz_Mapeamento[i].length)
            auxIJ[2] = j + 1;
        else
            auxIJ[2] = j;
        if (head == 'D') {
            if (i + 1 <= Matriz_Mapeamento.length)
                auxIJ[3] = i + 1;
            else
                auxIJ[3] = i;
        }
        else {
            if (i - 1 >= 0)
                auxIJ[3] = i - 1;
            else
                auxIJ[3] = i;
        }
        return (auxIJ);
    }

}

//Função que controla o preenchimento com os obstaculos encontrados
function fill_Obst(auxIJ, head, obst_d, obst_m, obst_u) {

    //let aux_x, aux_y, xi, yi, xf, yf;
    //console.log(auxIJ, head, obst_d, obst_m, obst_u);
    if (head == 'R' || head == 'L') {
        if (obst_m == 2) {
            if (Matriz_Mapeamento[auxIJ[1]][auxIJ[3]] == 3)
                Matriz_Mapeamento[auxIJ[1]][auxIJ[3]] = 4;
            else if (Matriz_Mapeamento[auxIJ[1]][auxIJ[3]] == 0)
                Matriz_Mapeamento[auxIJ[1]][auxIJ[3]] = obst_m;
        }
        else {
            if (Matriz_Mapeamento[auxIJ[1]][auxIJ[3]] == 0)
                Matriz_Mapeamento[auxIJ[1]][auxIJ[3]] = 1;
        }
        if (obst_u == 2) {
            if (Matriz_Mapeamento[auxIJ[0]][auxIJ[3]] == 3)
                Matriz_Mapeamento[auxIJ[0]][auxIJ[3]] = 4;
            else if (Matriz_Mapeamento[auxIJ[0]][auxIJ[3]] == 0)
                Matriz_Mapeamento[auxIJ[0]][auxIJ[3]] = obst_u;
        }
        else {
            if (Matriz_Mapeamento[auxIJ[0]][auxIJ[3]] == 0)
                Matriz_Mapeamento[auxIJ[0]][auxIJ[3]] = 1;
        }
        if (obst_d == 2) {
            if (Matriz_Mapeamento[auxIJ[2]][auxIJ[3]] == 3)
                Matriz_Mapeamento[auxIJ[2]][auxIJ[3]] = 4;
            else if (Matriz_Mapeamento[auxIJ[2]][auxIJ[3]] == 0)
                Matriz_Mapeamento[auxIJ[2]][auxIJ[3]] = obst_d;
        }
        else {
            if (Matriz_Mapeamento[auxIJ[2]][auxIJ[3]] == 0)
                Matriz_Mapeamento[auxIJ[2]][auxIJ[3]] = 1;
        }
    }
    else {
        if (obst_m == 2) {
            if (Matriz_Mapeamento[auxIJ[3]][auxIJ[1]] == 3)
                Matriz_Mapeamento[auxIJ[3]][auxIJ[1]] = 4;
            else if (Matriz_Mapeamento[auxIJ[3]][auxIJ[1]] == 0)
                Matriz_Mapeamento[auxIJ[3]][auxIJ[1]] = obst_m;
        }
        else if (Matriz_Mapeamento[auxIJ[3]][auxIJ[1]] == 0) {
            Matriz_Mapeamento[auxIJ[3]][auxIJ[1]] = 1;
        }
        if (obst_u == 2) {
            if (Matriz_Mapeamento[auxIJ[3]][auxIJ[0]] == 3)
                Matriz_Mapeamento[auxIJ[3]][auxIJ[0]] = 4;
            else if (Matriz_Mapeamento[auxIJ[3]][auxIJ[0]] == 0)
                Matriz_Mapeamento[auxIJ[3]][auxIJ[0]] = obst_u;
        }
        else if (Matriz_Mapeamento[auxIJ[3]][auxIJ[0]] == 0) {
            Matriz_Mapeamento[auxIJ[3]][auxIJ[0]] = 1;
        }
        if (obst_d == 2) {
            if (Matriz_Mapeamento[auxIJ[3]][auxIJ[2]] == 3)
                Matriz_Mapeamento[auxIJ[3]][auxIJ[2]] = 4;
            else if (Matriz_Mapeamento[auxIJ[3]][auxIJ[2]] == 0)
                Matriz_Mapeamento[auxIJ[3]][auxIJ[2]] = obst_d;
        }
        else if (Matriz_Mapeamento[auxIJ[3]][auxIJ[2]] == 0) {
            Matriz_Mapeamento[auxIJ[3]][auxIJ[2]] = 1;
        }
    }
    //console.table(Matriz_Mapeamento);
}

//Função que controla o preenchimento com a poluição encontrada
function fill_Pol(i, j, pol1) {
    let aux_x, aux_y, xi, yi, xf, yf;

    //console.log(Matriz_Mapeamento.length, Matriz_Mapeamento[i].length)
    //verificar coordenadas iniciais controlando as linhas i
    if (i == 0) {
        xi = i;
        xf = i + 1;
    }
    else {
        xi = i - 1;
        if ((i + 1) > Matriz_Mapeamento.length)
            xf = i;
        else
            xf = i + 1;
    }
    //verificar coordenadas iniciais controlando as colunas j
    if (j == 0) {
        yi = j;
        yf = j + 1;
    }
    else {
        yi = j - 1;
        if ((j + 1) > Matriz_Mapeamento[i].length)
            yf = j;
        else
            yf = j + 1;
    }
    console.log("i ", "j ", "xi ", "yi ", "xf ", "yf ");
    console.log(i, j, xi, yi, xf, yf);
    for (aux_x = xi; aux_x <= xf; aux_x++)
        for (aux_y = yi; aux_y <= yf; aux_y++)
            if (pol1 != 3)
                Matriz_Mapeamento[i][j] = 1;
            else
                Matriz_Mapeamento[aux_x][aux_y] = pol1;

    //console.table(Matriz_Mapeamento);
}

function sensors(i, j, head) {
    console.log("leitura :", i, j, head, Matriz_Mapeamento[i][j]);
    if (Matriz_Mapeamento[i][j] != 2 && Matriz_Mapeamento[i][j] != 3 && Matriz_Mapeamento[i][j] != 4) {
        poluicao = readlineSync.question('Sensor poluição 0 ou 3 ? ');
        fill_Pol(i, j, poluicao);
    } 
    auxIJ = direction(i, j, head);
    console.log(auxIJ, head);
    if (!(i == Matriz_Mapeamento.length && head == 'D') && !(i == 0 && head == 'U') && 
            !(j == 0 && head == 'L') && !(j + 1 == Matriz_Mapeamento[i].length && head == 'R')) {
        console.log("entrei");
        if (head == 'R' || head == 'L'){
            if (Matriz_Mapeamento[auxIJ[1]][auxIJ[3]] == 0 || Matriz_Mapeamento[auxIJ[1]][auxIJ[3]] == 3)
                obst_m = readlineSync.question('Sensor meio obstaculo 0 ou 2 ? ');
            if (Matriz_Mapeamento[auxIJ[0]][auxIJ[3]] == 0 || Matriz_Mapeamento[auxIJ[0]][auxIJ[3]] == 3)
                obst_u = readlineSync.question('Sensor cima obstaculo 0 ou 2 ? ');
            if (Matriz_Mapeamento[auxIJ[2]][auxIJ[3]] == 0 || Matriz_Mapeamento[auxIJ[2]][auxIJ[3]] == 3)
                obst_d = readlineSync.question('Sensor baixo obstaculo 0 ou 2 ? ');
        }
        else{
            if (Matriz_Mapeamento[auxIJ[3]][auxIJ[1]] == 0 || Matriz_Mapeamento[auxIJ[3]][auxIJ[1]] == 3)
                obst_m = readlineSync.question('Sensor meio obstaculo 0 ou 2 ? ');
            if (Matriz_Mapeamento[auxIJ[3]][auxIJ[0]] == 0 || Matriz_Mapeamento[auxIJ[3]][auxIJ[0]] == 3)
                obst_u = readlineSync.question('Sensor cima obstaculo 0 ou 2 ? ');
            if (Matriz_Mapeamento[auxIJ[3]][auxIJ[2]] == 0 || Matriz_Mapeamento[auxIJ[3]][auxIJ[2]] == 3)
                obst_d = readlineSync.question('Sensor baixo obstaculo 0 ou 2 ? ');
        }
        //auxIJ = direction(i, j, head);
        console.log(auxIJ, head, obst_d, obst_m, obst_u);
        fill_Obst(auxIJ, head, obst_d, obst_m, obst_u);
    }
}

// 1 - Viu, 2 - Bloco, 3 - Poluida, 4 -- ambos
function ASV_Mapping() {
    let auxIJ = [];
    let opt1 = true;
    let opt = 1, poluicao, obst_m, obst_u, obst_d;
    let i = 1, j = 0, aux_i, aux_j, flag = 0, flag_h = 0; head = 'R';

    ASV_Moves(i, j);
    sensors(i, j, head);
    console.table(Matriz_ASV);
    console.table(Matriz_Mapeamento);
    while (opt1) {

        //head = 'R' - Dir, 'L' - Esq, 'U' - Cim, 'D' - Bx
        if ((head == 'R') && (j + 1 < Matriz_Mapeamento[i].length) && (Matriz_Mapeamento[i][j + 1] != 2) && (Matriz_Mapeamento[i][j + 1] != 4)) {
            j++;
            console.log("Caminho livre incremento a coluna", j);
            ASV_Moves(i, j);
            sensors(i, j, head);
            console.table(Matriz_ASV);
            console.table(Matriz_Mapeamento);
        }
        else if ((head == 'R') && ((j + 1 >= Matriz_Mapeamento[i].length) || (Matriz_Mapeamento[i][j + 1] == 2 || Matriz_Mapeamento[i][j + 1] == 4))) {
            head = 'D';
            console.log("Caminho impedido mudei direção :", i, j, head);
            /*             if (Matriz_Mapeamento[i+1][j] != 2 && Matriz_Mapeamento[i+1][j] == 4) {
                            flag = 1;
                            aux_i = i;
                            for (aux_j = j; aux_j < Matriz_Mapeamento[i].length; aux_j++)
                                if ((Matriz_Mapeamento[i][j + 1] != 2) && (Matriz_Mapeamento[i][j + 1] != 2))
                                    break;
            
                        } */
            //if (Matriz_Mapeamento[i + 1][j] != 1 && Matriz_Mapeamento[i + 1][j] != 1)
            sensors(i, j, head);
            console.table(Matriz_Mapeamento);
        }
        /********/
        if ((head == 'D') && (Matriz_Mapeamento[i + 1][j] != 2) && (Matriz_Mapeamento[i + 1][j] != 4) && (i + 1 < Matriz_Mapeamento.length)) {
            i++;
            console.log("Caminho desimpedido incremento a linha :", i, j, head);
            ASV_Moves(i, j);
            sensors(i, j, head);
            head = 'R';
            console.table(Matriz_ASV);
            console.table(Matriz_Mapeamento);
        }
        else if ((head == 'D') && ((Matriz_Mapeamento[i + 1][j] == 2) || (Matriz_Mapeamento[i + 1][j] == 4) || (i + 1 >= Matriz_Mapeamento.length))) {
            head = 'U';
            console.log("Caminho impedido mudei direção :", i, j, head);
            sensors(i, j, head);
            console.table(Matriz_Mapeamento);
        }
        /********/
        if ((head == 'U') && (Matriz_Mapeamento[i - 1][j] != 2) && (Matriz_Mapeamento[i - 1][j] != 4) && (i - 1 >= 0)) {
            i--;
            console.log("Caminho livre decremento a linha", i);
            ASV_Moves(i, j);
            sensors(i, j, head);
            head = 'R'
            console.table(Matriz_ASV);
            console.table(Matriz_Mapeamento);
        }
        else if ((head == 'U') && ((Matriz_Mapeamento[i - 1][j] == 2) || (Matriz_Mapeamento[i - 1][j] == 4) || (i - 1 < 0))) {
            head = 'L';
            console.log("Caminho impedido mudei direção :", i, j, head);
            sensors(i, j, head);
            console.table(Matriz_Mapeamento);
        }
        /***********/
        if ((head == 'L') && (j - 1 >= 0) && (Matriz_Mapeamento[i][j - 1] != 2) && (Matriz_Mapeamento[i][j - 1] != 4)) {
            j--;
            console.log("Caminho livre decremento a coluna", j);
            ASV_Moves(i, j);
            sensors(i, j, head);
            head = 'D';
            console.table(Matriz_ASV);
            console.table(Matriz_Mapeamento);
        }
        else if ((head == 'L') && ((j - 1 < 0) || (Matriz_Mapeamento[i][j - 1] == 2 || Matriz_Mapeamento[i][j - 1] == 4))) {
            head = 'D';
            console.log("Caminho impedido mudei direção :", i, j, head);
            sensors(i, j, head);
            console.table(Matriz_Mapeamento);
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
