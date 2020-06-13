
const electron = require('electron')
const ipc = electron.ipcRenderer

setTimeout(()=>{
    ipc.send('anyEvent',{
        show: true
    })
},3000)

function loadPage(){
    var duracao = Date.now()//pega o horario atual
    duracao = Date.now() - duracao//pega a duracao do load
    duracao = (duracao > 3000)? 0: 3000-duracao //testa se foram mais de 3 segundos
    setTimeout(()=>{//caso n tenha sido espera o gif terminar para chamar a janela principal
        ipc.send('mainLoadCompleto',{
            show: true
        })
    },duracao)
}

window.onload = loadPage
