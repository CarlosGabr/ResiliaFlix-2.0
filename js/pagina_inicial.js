class  Controller {
  constructor(){
  }
  static adicionaNovoFilme(idFilme) {
    console.log(idFilme)
    let novoFilme = new Model ();
    //chamo o método da model passando o id do filme que foi clicado
    novoFilme.requisicaoNovoFilme(idFilme); 
    //chamo o método da View passando o modelo de objeto criado na model
    let exibirNovoFilme = new View ();
    exibirNovoFilme.mostrarNovoFilme(novoFilme);
  }
}

class Model {
  constructor (){
    //vou criar um objeto com esses atributos
    console.log("Cheguei na model...");
    this._nome = "";
    this._ano = "";
    this._tempo = "";
    this._sinopse = "";
    this._genero = ""
  }
  requisicaoNovoFilme(idFilme) {
    let request = new XMLHttpRequest();
    request.addEventListener ("load" , () =>{
      if (request.status == 200) {
        console.log("Encontrei...vou mostrar");
        // passo para o processaDados a resposta da requisicao e retorno um JSON, que será parametro para o
        //o método atualizaDados direcionar os respectivos atributos
        this._atualizaDados(this._processaDados(request.responseText));
      }

      else{
        erro(request.status)
    }



    });
    request.open("GET",`http://www.omdbapi.com/?apikey=167350f2&i=${idFilme}&plot=full`,false);
    request.send();
  }
  _processaDados(filmeDados) {
    let dadosProcessados = JSON.parse(filmeDados);
    return dadosProcessados;
  }
  _atualizaDados(dadosAtualizados) {
    //atualizo os dados baseado no JSON retornado
    this._arrayFilmes = dadosAtualizados; 
    this._nome = dadosAtualizados.Title;
    this._ano = dadosAtualizados.Year;
    this._tempo = dadosAtualizados.Runtime;
    this._sinopse = dadosAtualizados.Plot; 
    this._genero = dadosAtualizados.Genre;
    console.log(this._sinopse);
    console.log(this._nome);
  }
}


class View {
  constructor (){
    console.log("Entrei na view...");
  }
  mostrarNovoFilme(modelo) {
    //recebendo um modelo de objeto com atributos, seleciono o titulo e o corpo do modal 
    //e insiro os dados do objeto novoFilme nele
    let tituloModal = document.querySelector(".modal-title");
    tituloModal.innerHTML = modelo._nome;
    let corpoModal = document.querySelector(".modal-body");
    corpoModal.innerHTML = `Year: ${modelo._ano}
                            Time: ${modelo._tempo}
                            Synopsis: ${modelo._sinopse}
                            Genre: ${modelo._genero}`
  }
}
 

//coloco todas imdbID's dos filmes e encaminho pra controller o id respectivo ao item clicado
let imdbID = ["tt0295297","tt4682266","tt0381707","tt2096673","tt2872732","tt2294629", //filmes
              "tt5834204","tt0460649","tt8416494","tt0944947","tt2085059","tt0903747"]; //series
let botoes = document.querySelectorAll("#filme-clicado"); //seleciono todos os botoes, botoes da grid de filmes
botoes.forEach((element, index)=>{ // percorro esse botao, pegando elemento e indice
  // crio um evento de click pra saber qual filme foi clicado
  element.addEventListener("click",()=>{ 
     //quando ele acha, envia o ID respectivo ao indice que esta sendo percorrido pelo forEach
    Controller.adicionaNovoFilme(imdbID[index]);
  })
});
 

function erro(num_erro){

  corpo.innerHTML = ` <h1 id = titulo>Erro ${num_erro}</h1>
    <h3>Unfortunately we couldn't find what you are looking for.</h3>
    <h4>Try again or <a id ="contact" href= '#paginadecontato'>contact our team</a>.</h4>
    <br>
    <img src ="logo_resiliaflix.png" width = 100px height = 60px>
    </div>`
}