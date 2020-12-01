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
      try {
        if (request.status == 200) {
          this._atualizaDados(this._processaDados(request.responseText));
          funcaoExecutadaAposResposta();
        }
      }catch {
        console.log("t aq")
        setTimeout(()  => {
          window.location.href = `https://viacep.com.br/ws/${cepQueQueroBuscar}/json/`
        },1000);
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
    document.getElementById('rua').value=(formCep._rua);
    document.getElementById('cidade').value=(formCep._cidade);
    document.getElementById('uf').value=(formCep._estado);
  }

}

let botaoDeEnviar = document.querySelector(".botao");
botaoDeEnviar.addEventListener("click", () => {
  document.getElementById('rua').value= "";
    document.getElementById('cidade').value= "";
    document.getElementById('uf').value= "";
});