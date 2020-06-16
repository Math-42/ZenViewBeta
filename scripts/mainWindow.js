
const electron = require('electron')
const ipc = electron.ipcRenderer
const fs = require('fs')
class MainWindow{
    constructor(){
        this.buttons = [];
        this.popupOptions = [];
        this.onLoadFunctions = []
        this.tabs = []
    }
    addOnLoadFunction(onLoadFunction){
        this.onLoadFunctions.push(onLoadFunction);
    }
    loadStorageFunctions(){
        this.onLoadFunctions.forEach( onLoadFunction =>{
            onLoadFunction();
        })
        this.loadPage();
    }
    loadButtons(){
        let htmlButtons = ''
        this.buttons = fs.readFileSync('./interface/buttons/buttons.json')
        this.buttons = JSON.parse(this.buttons)
        this.buttons.forEach(button => {//gera o html de todos os botoes
            htmlButtons += `<button 
                            class="${button.context}" 
                            type="button"
                            onclick="${button.onclick}"
                            >${button.name}</button>`
        });
        document.getElementById("side_tab_menu").innerHTML = htmlButtons
    }
    loadPopupOptions(){
        let htmlPopupOptions = ''
        this.popupOptions = fs.readFileSync('./interface/popup/popupOptions.json')
        this.popupOptions = JSON.parse(this.popupOptions)
        this.popupOptions.forEach(option => {//gera o html de todos os botoes
            htmlPopupOptions += `<button 
                            class="${option.context}" 
                            type="button"
                            onclick="${option.onclick}"
                            id = "${option.id}"
                            >${option.name}</button>`
        });
        document.getElementById("optionTab").innerHTML = htmlPopupOptions
    }
    loadPopupMenus(){
        
    }
    loadPage(){
        var duracao = Date.now()//pega o horario atual
        this.loadButtons()
        this.loadPopupOptions()
        duracao = Date.now() - duracao//pega a duracao do load
        duracao = (duracao > 3000)? 0: 3000-duracao //testa se foram mais de 3 segundos
        setTimeout(()=>{//caso n tenha sido espera o gif terminar para chamar a janela principal
            ipc.send('mainLoadCompleto',{
                show: true
            })
        },duracao)
    }
}

const mainwindow = new MainWindow()
