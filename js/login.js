// Esqueci a senha!
let forgot = document.getElementById("forgotten_password");

forgot.addEventListener("click", ()=>{
    let corpo = document.querySelector(".formulario")
    corpo.innerHTML = `<body>
    <header></header>
    <form id = "recover_password">
        <h2 id = "title">Password recovery</h2>
        <h4 id = "#"> Enter the registered email below to receive password recovery instructions.</h4>
        <input id = "login_input" type = "text">
        <button onclick= "abrirModal()" id = "btn" data-toggle="modal" data-target="#exibir-mensagem"> Send </button>
    </form> 
    <footer></footer>
    <script src ="recuperar_senha.js"></script>
    </body>`
});

function abrirModal (){
  let tituloModal = document.querySelector(".modal-title");
  tituloModal.innerHTML = `<img id="logoExibicao" src="../img/logoResilia2.png">
                            `;
  let corpoModal = document.querySelector(".modal-body");
  corpoModal.innerText = `Email successfully sent!`;
};
// Término


function newModal (){
  let tituloModal = document.querySelector(".modal-title");
  tituloModal.innerHTML = `<img id="logoExibicao" src="../img/logoResilia2.png">
                            `;
  let corpoModal = document.querySelector(".modal-body");
  corpoModal.innerText = `Successfully connected!`;
};

function erroModal(){
  console.log("Não enviei")
  let tituloModal = document.querySelector(".modal-title");
  tituloModal.innerHTML = `<img id="logoExibicao" src="../img/logoResilia2.png">
                            `;
  let corpoModal = document.querySelector(".modal-body");
  corpoModal.innerText = `Unsigned email and password`;
};


let senha = $('#senha');
let olho= $("#olho");

olho.mousedown(function() {
  senha.attr("type", "text");
});

olho.mouseup(function() {
  senha.attr("type", "password");
});

// para evitar o problema de arrastar a imagem e a senha continuar exposta, 
$( "#olho" ).mouseout(function() { 
  $("#senha").attr("type", "password");
});

let botaoEntrar = document.getElementById("btnn");

let email = document.getElementById("email");
let senha1 = document.getElementById("senha");

let email1 = email.value;
let senha2 = senha1.value;
console.log(email1)
console.log(senha2)

if(email1.length == 0 || senha2.length == 0){
  console.log("Não enviado")
 erroModal();
}else {
  newModal();
}