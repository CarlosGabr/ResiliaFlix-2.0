class CepController {

  static informacep(cepinformado){
    console.log(cepinformado);
    let formularioCep = new CepModel;
    formularioCep.buscacep(cepinformado, ()=> {
      let visualizar = new CepView();
      console.log(formularioCep._rua)
      visualizar.mostrarEndereco(formularioCep);
    });

  }
}

class CepModel {

  buscacep (cepQueQueroBuscar, funcaoExecutadaAposResposta) {
    console.log(cepQueQueroBuscar);
    let request = new XMLHttpRequest();
    request.addEventListener ("load" , () =>{
        if (request.status == 200) {
          this._atualizaDados(this._processaDados(request.responseText));
          funcaoExecutadaAposResposta();
        }

        else{
          alert ("CARALHOOOOOOOOO")
        }
        
    });
    request.open("GET",`https://viacep.com.br/ws/${cepQueQueroBuscar}/json/`);
    request.send();
  }

  _processaDados(cepDados){
      let dadosProcessados = JSON.parse(cepDados);
    return dadosProcessados;
  }
  _atualizaDados(enderecoCompleto) {
    this._rua = enderecoCompleto.logradouro;
    this._cidade = enderecoCompleto.localidade;
    this._estado =  enderecoCompleto.uf;
  }
}


class CepView {

  mostrarEndereco(formCep) {
    document.getElementById('input-rua').value=(formCep._rua);
    document.getElementById('input-cidade').value=(formCep._cidade);
    document.getElementById('input-cidade').value=(formCep._estado);
  }
  static cadastroEfetuado() {
    let cadastroModal = document.querySelector(".modal-body");
    let tituloModal = document.querySelector(".modal-title");
    cadastroModal.id = "textoModal";
    tituloModal.innerHTML = `<img id="logoExibicao" src="../img/logoResilia2.png">`;
    cadastroModal.innerHTML = "Your registration has been successfully completed"
  }
  static errorCadastro(){
    let cadastroModal = document.querySelector(".modal-body");
    let tituloModal = document.querySelector(".modal-title");
    cadastroModal.id = "textoModal";
    tituloModal.innerHTML = `<img id="logoExibicao" src="../img/logoResilia2.png">`;
    cadastroModal.innerHTML = "Something went wrong. Please fill in all fields correctly and try again."
  }
  static limpaCampos(){
    document.getElementById('input-name').value= "";
    document.getElementById('input-rg').value= "";
    document.getElementById('input-uf').value= "";
    document.getElementById('input-email').value= "";
    document.getElementById('input-password').value = "";
    document.getElementById('input-password2').value = "";
    document.getElementById('input-cep').value = "";
    document.getElementById('input-cidade').value ="";
    document.getElementById('input-rua').value ="";
    document.getElementById('input-uf').value = "";
  }
}

/*Verifico se os campos estão todos preenchidos*/
let contador = 0;
let inputs =  document.querySelectorAll(".form-control");
let botaoDeEnviar = document.querySelector(".botao-enviar");

botaoDeEnviar.addEventListener("click", () => {
  inputs.forEach((input)=>{
    if (input.value == ""){
      console.log(input.value)
      console.log("aqui")
      contador++;
      console.log(contador)
    }
});

let inputCEP = document.getElementById("input-cep")
let input1 = inputCEP.value;
console.log(input1.length)
let inputCity = document.getElementById("input-cidade")
let inputCityValue = inputCity.value;
  if (contador == 0 && input1.length == 8) {
    CepView.cadastroEfetuado();  
    CepView.limpaCampos();
    contador = 0;
  }

  else if (inputCityValue == undefined){
    CepView.errorCadastro();
    CepView.limpaCampos();
    contador = 0;
  }
  
  else {
    CepView.errorCadastro();
    CepView.limpaCampos();
    contador = 0;
  }
});