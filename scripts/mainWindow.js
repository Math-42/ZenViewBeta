

const electron = require('electron')
const ipc = electron.ipcRenderer
const fs = require('fs')
const menus = require('../../scripts/imports.js')
const classes = require('../../scripts/classes.js')
const SideMenu = require('../../scripts/sideMenu.js')
const popUpMenu = require('../../scripts/popup.js')
const Tabs = require('../../scripts/tabs.js')

class MainWindow{
    constructor(){
        this.buttons = {};
        this.onLoadFunctions = [];
        this.tabs = new Tabs();
        this.sideMenu = new SideMenu();
        this.popUpMenu = new popUpMenu();
    }
    addOnLoadFunction(onLoadFunction){
        this.onLoadFunctions.push(onLoadFunction);
    }
    contextChangeStyle(newContext){
        let elements = document.getElementsByClassName("variable_context")
        for (let i = 0; i < elements.length; i++) {
            let styleClasses = elements[i].className.split(" ");
            if(!(styleClasses.includes("all_show") || styleClasses.includes(newContext))){
                elements[i].style.display = "none";
            }else{
                elements[i].style.display = "block";
            }
        }
    }
    loadEvents(){
        window.addEventListener('ChangeSideMenu',(evt)=>{
            console.log("Menu lateral foi alterado")
            this.sideMenu.changeSideMenu();
        })
        window.addEventListener('ClosePopupMenu',(evt)=>{
            console.log("Menu popup foi fechado")
            this.popUpMenu.closePopup();
        })
        window.addEventListener('OpenPopupMenu',(evt)=>{
            console.log("Menu popup foi aberto")
            this.popUpMenu.openPopup(evt.detail.menuName);
        })
        window.addEventListener('LoadNewTab',(evt)=>{
            console.log("Nova aba foi carregada")
            this.tabs.openNewTab(evt.detail.name,evt.detail.context);
        })
        window.addEventListener('ContextChange',(evt)=>{
            console.log("Contexto da aba foi alterado")
            this.contextChangeStyle(evt.detail.context);
        })
        window.addEventListener('EditInputs',(evt)=>{
            console.log("Lendo lista de inputs")
        })
        console.log("Os eventos foram carregados")
    }
    loadStorageFunctions(){
        this.onLoadFunctions.forEach( onLoadFunction =>{
            onLoadFunction();
        })
        this.loadPage();
    }
    loadButtons(){
        let htmlButtons = ''
        let buttons = fs.readFileSync('./interface/buttons/buttons.json')
        buttons = JSON.parse(buttons)
        buttons.forEach(button => {//gera o html de todos os botoes
            this.buttons[button.id] = button;
            htmlButtons += `<button 
                            class="variable_context ${button.context}" 
                            type="button"
                            onclick=`
            button.events.forEach(event => {
                htmlButtons +=`'mainwindow.dispatchEvent(${JSON.stringify(event.name)},${JSON.stringify(event.details)})'`
            });
            htmlButtons +=  `>${button.name}</button>`
        });
        document.getElementById("side_tab_menu").innerHTML = htmlButtons
        console.log("Os botões foram carregados")
    }
    loadPopupOptions(){
        let htmlPopupOptions = ''
        let popupOptions = {};
        let popupOptionsReader = fs.readFileSync('./interface/popup/popupOptions.json')
        popupOptionsReader = JSON.parse(popupOptionsReader)
        popupOptionsReader.forEach(option => {//gera o html de todos os botoes do menu
            popupOptions[option.id] = option
            htmlPopupOptions += `<button 
                            class="variable_context ${option.context}" 
                            type="button"
                            id = "${option.id}"
                            onclick=`
            option.events.forEach(event => {
                htmlPopupOptions +=`'mainwindow.dispatchEvent(${JSON.stringify(event.name)},${JSON.stringify(event.details)})'`
            });
            htmlPopupOptions +=  `>${option.name}</button>`
        });
        this.popUpMenu.setTablinks(popupOptions);
        document.getElementById("optionTab").innerHTML = htmlPopupOptions
        console.log("As opções do menu foram carregadas")
    }
    loadPopupMenus(){
        let htmlPopupMenus = ''
        let popupMenus = {};
        let popupMenusReader = fs.readFileSync('./interface/popupMenus/popupMenus.json')
        popupMenusReader = JSON.parse(popupMenusReader);
        popupMenusReader.forEach(menu => {//gera o html de todos os menus
            popupMenus[menu] = new menus[menu]();
            htmlPopupMenus += popupMenus[menu].htmlBuilder();
            
        });
        document.getElementById("tabcontentContainer").innerHTML = htmlPopupMenus
        this.popUpMenu.setMenus(popupMenus);
        console.log("Os menus foram carregados")
    }
    loadPage(){
        var duracao = Date.now()//pega o horario atual
        this.loadEvents();
        this.loadButtons()
        this.loadPopupOptions()
        this.loadPopupMenus()
        duracao = Date.now() - duracao//pega a duracao do load
        duracao = (duracao > 3000)? 0: 3000-duracao //testa se foram mais de 3 segundos
        setTimeout(()=>{//caso n tenha sido espera o gif terminar para chamar a janela principal
            ipc.send('mainLoadCompleto',{
                show: true
            })
        },duracao)
        console.log("Programa carregado completamente")
    }
    dispatchEvent(eventName,details){
        console.log(eventName,details)
        if(details === undefined){
            window.dispatchEvent( new Event(eventName));
        }else{
            window.dispatchEvent( new CustomEvent(eventName,{detail:details}));
        }
    }
}

const mainwindow = new MainWindow()

window.onload = () =>{
    mainwindow.loadStorageFunctions();
    mainwindow.tabs.tabsOnLoad()
}