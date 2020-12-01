/*Seleciono o botao que vai dar inicio a requisição*/
let botaoClick = document.querySelector("#botao"); 
/*Pego o valor do campo de input*/
let input = document.querySelector("#fname");



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
    /* A cada incremento do aarray retornado, o array da classe receberá o elemento correspondente*/
  
     dadosProcessados.Search.forEach(element => {
      this._arrayFilmes.push(element)
    }); 
    return this._arrayFilmes;
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
    this._sinopse =dadosAtualizados.Plot;
} 
  get filme() {
    this._nome;
    this._sinopse;
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

    /* Crio um elemento para abrigar as imagens encontradas na busca*/
    let div = document.createElement("div");
    document.body.appendChild(div);
    /*O atributo FilmesSelecionados é um array retornado após a primeira requisição, logo podemos percorrer com forEach() */
    div.classList.add("resultados")
    this._FilmesSelecionados._arrayFilmes.forEach(function(element,index) {
      /* A cada elemento do array retornado, eu adiciono na minha div criada uma imagem com uma âncora nela*/
      div.innerHTML +=  `
      <a  id ="click-de-busca" class="btn m-5" data-toggle="modal" data-target="#exibir-filme"><img src =${element.Poster}></a>
      `
      });

      }


  

  get arrayDeFilmes() {
    return this._FilmesSelecionados;
  }
  
  modalFilmes(modelodeFilme) {
    let tituloModal = document.querySelector(".modal-title");
    tituloModal.innerHTML = `${modelodeFilme._nome}`;
    let corpoModal = document.querySelector(".modal-body");
    corpoModal.innerHTML = `<b>Synopsis:</b> ${modelodeFilme._sinopse}
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
  }); 


  