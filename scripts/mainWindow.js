

const electron = require('electron')
const ipc = electron.ipcRenderer
const fs = require('fs')
const menus = require('../../scripts/imports.js')
const classes = require('../../scripts/classes.js')
const SideMenu = require('../../scripts/sideMenu.js')
const popUpMenu = require('../../scripts/popup.js')

class MainWindow{
    constructor(){
        this.buttons = {};
        this.onLoadFunctions = [];
        this.tabs = []
        this.sideMenu = new SideMenu();
        this.popUpMenu = new popUpMenu();
    }
    addOnLoadFunction(onLoadFunction){
        this.onLoadFunctions.push(onLoadFunction);
    }
    loadEvents(){
        window.addEventListener('ChangeSideMenu',(evt)=>{
            this.sideMenu.changeSideMenu();
        })
        window.addEventListener('ClosePopupMenu',(evt)=>{
            this.popUpMenu.closePopup();
        })
         window.addEventListener('OpenPopupMenu',(evt)=>{
            this.popUpMenu.openPopup(evt.detail.menuName);
        })
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
                            class="${button.context}" 
                            type="button"
                            onclick=`
            button.events.forEach(event => {
                htmlButtons +=`'mainwindow.dispatchEvent(${JSON.stringify(event.name)},${JSON.stringify(event.details)})'`
            });
            htmlButtons +=  `>${button.name}</button>`
        });
        document.getElementById("side_tab_menu").innerHTML = htmlButtons
    }
    loadPopupOptions(){
        let htmlPopupOptions = ''
        let popupOptions = {};
        let popupOptionsReader = fs.readFileSync('./interface/popup/popupOptions.json')
        popupOptionsReader = JSON.parse(popupOptionsReader)
        popupOptionsReader.forEach(option => {//gera o html de todos os botoes do menu
            popupOptions[option.id] = option
            htmlPopupOptions += `<button 
                            class="${option.context}" 
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