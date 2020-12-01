/*Seleciono o botao que vai dar inicio a requisição*/
let botaoClick = document.querySelector("#botao"); 
/*Pego o valor do campo de input*/
let input = document.querySelector("#fname");

let corpo = document.querySelector("body")

/* Classe Responsável por fazer a primeira requisição */
class Model {
  constructor (){
    this._arrayFilmes = [];
  }
  //primeira requisição para buscar os filmes do texto do input
  requisicaoNovoFilme(idFilme, funcaoExecutadaAposResposta) {
    let busca = input.value;
        let separa = busca.split(' ')
        var junta = separa.join("+")
        let request = new XMLHttpRequest();

    request.addEventListener ("load" , () =>{
      if (request.status == 200 && request.readyState == 4) {
        console.log("Encontrei...vou mostrar");
        // passo para o processaDados a resposta da requisicao e retorno um JSON, que será parametro para o
        //o método atualizaDados direcionar os respectivos atributos
        this._processaDados(request.responseText);
        funcaoExecutadaAposResposta();
      }
      
    });

    request.open("GET",`http://www.omdbapi.com/?apikey=167350f2&s=${junta}&page=1`);
    request.send();
  }

  _processaDados(filmeDados) {
    let dadosProcessados = JSON.parse(filmeDados);

     if (dadosProcessados.Response == 'True'){ 
    /* A cada incremento do aarray retornado, o array da classe receberá o elemento correspondente*/
     dadosProcessados.Search.forEach(element => {
     this._arrayFilmes.push(element)
    }); 
    return this._arrayFilmes;
  
}
    else if (dadosProcessados.Response == "False"){
      let divNotFound = document.createElement("div");
      document.body.appendChild(divNotFound);
      divNotFound.innerHTML= ` 
                          <h3> Unfortunately, the title you're looking for is not avaliable. </h3>
                              <img src="https://media1.tenor.com/images/aa5ad7ceb09b65f48169895d78ff2f9b/tenor.gif?itemid=5652747" alt = "sad_jon">
                              <h3>Please, try another title.</h3>` 
} 
  }
  

}


/* Classe Responsável por fazer a requisição utilizando paramento =i, do filme clicado após a exibição*/
class FilmModel {
  /* Função que corresponde a função setinha da controller, só cria a view após o "load" da requisição*/
  requisicaobyID(id, funcaoExecutadaAposResposta){
    let request = new XMLHttpRequest();
    request.addEventListener ("load" , () =>{
      if (request.status == 200 && request.readyState == 4) {
        console.log("Encontrei...vou mostrar");
        /*passo para o processaDados a resposta da requisicao e retorno um JSON, que será parametro para o
        o método atualizaDados direcionar os respectivos atributos*/
        this._atualizaDados(JSON.parse((request.responseText)));
        funcaoExecutadaAposResposta();
      }
      
    });
    /* Requisição é feita utilizando o parâmetro do idmbID do filme, pego na primeira requisição*/
    request.open("GET",`http://www.omdbapi.com/?apikey=167350f2&i=${id}&plot=full`);
    request.send();
  }
  _atualizaDados(dadosAtualizados) {
    //atualizo os dados baseado no JSON retornado >>>> adicionar mais informações
    this._nome = dadosAtualizados.Title;
    this._ano = dadosAtualizados.Year;
    this._duracao = dadosAtualizados.Runtime;
    this._sinopse =dadosAtualizados.Plot;
    this._resposta = dadosAtualizados.Response;
} 
  get filme() {
    this._nome;
    this._ano;
    this._duracao;
    this._sinopse;
    this._resposta;
  }

}

/* Classe Responsável por mostrar os conteúdos na tela*/
class View {
  constructor(modelo){
    /*Após a primeira requisição o array da classe, receberá o modelo de filmes que foi retornado na primeira requisição*/
    this._FilmesSelecionados = modelo;
  }FilmesSelecionados
  /* Método invocado após a primeira requisição*/
  mostrarNovoFilme() {
    /*O atributo FilmesSelecionados é um array retornado após a primeira requisição, logo podemos percorrer com forEach() */
      let poteDeImagem = document.getElementById("html_class");
      let grid = document.getElementById("grid-de-filmes");
      /* Estilização da grid de*/
      grid.style.padding = "50px"
      poteDeImagem.style.padding = "10px";
      poteDeImagem.style.paddingTop = "30px";
      /* Método invocado após a primeira requisição*/
      poteDeImagem.innerHTML = ``
      this._FilmesSelecionados._arrayFilmes.forEach(function(element,index) {
        /* A cada elemento do array retornado, eu adiciono na minha div criada uma imagem com uma âncora nela*/
        poteDeImagem.innerHTML +=  `
        <a  id ="click-de-busca" class="btn m-3" data-toggle="modal" data-target="#exibir-filme"><img id ="filme-pesquisado"src =${element.Poster}></a>
        `
        });
      }

  apagarInput(){
    console.log("aqui")
    let input= document.querySelector("#fname");
    input.value = "";
    console.log(input)
  }    

  get arrayDeFilmes() {
    return this._FilmesSelecionados;
  }
  
  modalFilmes(modelodeFilme) {
    let tituloModal = document.querySelector(".modal-title");
    tituloModal.innerHTML = `${modelodeFilme._nome}`;
    let corpoModal = document.querySelector(".modal-body");
    corpoModal.innerHTML = `<b>Year</b>: ${modelodeFilme._ano} <br>
    <b>Runtime: </b>${modelodeFilme._duracao} <br>
    <b>Synopsis:</b> ${modelodeFilme._sinopse}
                            `

  }
}
   
/*Classe Controler com método static que não precisa de instância */
class  Controller {
  constructor(){
  }
  static adicionaNovoFilme(nomeFilme) {
    let novoFilme = new Model();
    /*chamo o método da model passando o id do filme que foi clicado e uma funcao setinha como parametro*/
    novoFilme.requisicaoNovoFilme(nomeFilme, ()=>{ 
      /*so instancio a classe View após o carregamento das inf do filme
      através da funcaoQueExecutaAposResposta, que é chamada após o "load"*/
      let exibirNovoFilme = new View(novoFilme);
      exibirNovoFilme.mostrarNovoFilme();

      /*Após a primeira requisição e a adição das imagens com o id="click-de-busca", eu seleciono todas as
        as ocorrências desse id, pra saber qual o usuário clicou*/
        /*querySelectorAll >> me retorna um array*/
      let clickar = document.querySelectorAll("#click-de-busca");
      /*Percorro esse array procurando qual elemento foi clicado para fazer a segunda requisição*/
         clickar.forEach((element, index) => {
            element.addEventListener("click", () =>{
              /*Quando eu encontro o elemento, eu crio um nova View para exibir através do modal*/
              let novoFilmeClicado = new FilmModel();
              /*Envio para a segunda requisição exatamente o ID da posição que foi pega com o addEventListener, parâmetro do forEach()*/
              let id = exibirNovoFilme._FilmesSelecionados._arrayFilmes[index].imdbID;
              novoFilmeClicado.requisicaobyID(id, ()=> {
                let visuFilm = new View();
                /*Passo pro método da View as informações do filme que foi pego durante o click*/
                visuFilm.modalFilmes(novoFilmeClicado);

              
              
              });
            }); 
          }); 
      }); 
  }
}

/*Crio um evento de click, que ao ser clicado vai chamar o método AddNovoFilme da classe Controller, passando o valor de input*/
 botaoClick.addEventListener("click",function (event){ 
   Controller.adicionaNovoFilme(input.value);
   input.value = "";
  }); 



  