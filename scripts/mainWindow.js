
const electron = require('electron')
const ipc = electron.ipcRenderer
const fs = require('fs');

setTimeout(()=>{
    ipc.send('anyEvent',{
        show: true
    })
},3000)

//le todos os botos do arquivo buttons.json
function loadButtons(){
    let htmlButtons = ''
    let buttons = fs.readFileSync('./interface/buttons/buttons.json')
    buttons = JSON.parse(buttons)
    buttons.forEach(button => {//gera o html de todos os botoes
        htmlButtons += `<button 
                        class="${button.context}" 
                        type="button"
                        onclick="${button.onclick}"
                        >${button.name}</button>`
    });
    document.getElementById("side_tab_menu").innerHTML = htmlButtons
    console.log(htmlButtons)
}

function loadPage(){
    var duracao = Date.now()//pega o horario atual
    loadButtons()
    duracao = Date.now() - duracao//pega a duracao do load
    duracao = (duracao > 3000)? 0: 3000-duracao //testa se foram mais de 3 segundos
    setTimeout(()=>{//caso n tenha sido espera o gif terminar para chamar a janela principal
        ipc.send('mainLoadCompleto',{
            show: true
        })
    },duracao)
}

window.onload = loadPage
