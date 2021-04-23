MATRIZES

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

FUNÇÕES

//Inicia a matriz mapeamento com zeros 
function Init_Matriz_Map()

//Inicia a matriz mapeamento com O´s
function Init_Matriz_Map_ASV()

//Inicia a matriz da area de funcionamento do ASV 
//com as respetivas coordenadas e grava em ficheiro
function Init_Matriz_Coord()
//lê do ficheiro a matriz da area de funcionamento do ASV 
//com as respetivas coordenadas reais
function Ler_Ficheiro_Init_Matriz_Coord()

// 1 - Viu, 2 - Bloco, 3 - Poluida, 4 -- ambos
function ASV_Mapping()