const TabGroup = require("electron-tabs")
const classes = require('./classes.js')
const dashBoard = classes.dashBoard
const Input = classes.Input
const fs = require('fs')

module.exports = class Tabs{
    constructor(){
        this.tab = {}
        this.tabGroup = {}
        this.onLoadFunctions = this.tabsOnLoad
    }
    //funcao de criacao de abas
    createNewTab(name,html){
        if(html === undefined){
            html = "./"
        }
        if(this.tabGroup.getTabs().length<9){
            return{
                title: name,
                src: html,
                closable: true,
                visible: true,
                loaded: false,
            }
        }
    }

    openNewTab(name,context){
        let alreadyOpen;
        this.tabGroup.eachTab((tab)=>{//testa se já está aberto
            if(tab.title === name){
                alreadyOpen = true;
            }
        })
        if(!alreadyOpen){
            let newTab = this.tabGroup.getActiveTab();//pega a aba atual
            newTab.src = "../../dashBoards/"+name+"/"+name+".html";//abre o html da nova aba
            newTab.context = context
            newTab.setTitle(name)
            newTab.webview.src = "../../dashBoards/"+name+"/"+name+".html"
            let newDashBoard = fs.readFileSync(`dashBoards/${name}/${name}.json`);
            newDashBoard = JSON.parse(newDashBoard);

            let inputs = [];
            newDashBoard.inputs.forEach(input => {
                inputs.push(new Input(input.name, input.operation));
            });
            newDashBoard.inputs = inputs

            newTab.dashBoard = newDashBoard;
            newTab.activate();
            newTab.webview.openDevTools();
        }else{
            alert("Already open")
        }
    }

    deleteCurrentDashBoard(){
        let answer = confirm("Are you shure?");
        if(answer === true){
            let currentTab = this.tabGroup.getActiveTab();
            fs.rmdirSync(`dashBoards/${currentTab.title}`,{ recursive: true });
            currentTab.close()
        }
    }

    saveDashBoard(){
        let answer = confirm("Save changes?");
        if(answer === true){
            mainwindow.dispatchEvent('ContextChange',{'context': 'start_show'});
            let currentTab = this.tabGroup.getActiveTab();
            fs.writeFileSync(`dashBoards/${currentTab.title}/${currentTab.title}.json`,JSON.stringify(currentTab.dashBoard,null,"\t"));
        }
    }

    tabsOnLoad(){
        //funcao geradora de abas
        let newTabBtn = ()=>{
                if(this.tabGroup.getTabs().length<9){
                    return{
                        title: "New Tab",
                        src: "./tabContent.html",
                        closable: true,
                        visible: true,
                        loaded: false
                    }
                }
            }

        //Cria um grupo de abas e define função geradora de abas
        this.tabGroup = new TabGroup({
            newTab: newTabBtn
        });

        //adiciona uma primeira aba
        this.tab = this.tabGroup.addTab({
            title: "New Tab",
            src: "./",
            closable: true,
            visible: true,
            context: "all_show"
        });

        //evento de clicar em uma aba
        this.tabGroup.on("tab-active",()=>{
            let tempTab = this.tabGroup.getActiveTab()
            console.log(tempTab)
            mainwindow.dispatchEvent('ContextChange',{"context": tempTab.context})
        });

        //evento de adicionar uma aba
        this.tabGroup.on("tab-added", (tab) => {
            tab.activate();
        });

        //evento de remover uma aba
        this.tabGroup.on("tab-removed",(tab)=>{
            let allTabs = this.tabGroup.getTabs();
            if(allTabs.length === 0){//testa se n restou nenhuma aba
                let mainTab = this.tabGroup.addTab({
                    title: "New Tab",
                    src: "./",
                    closable: true,
                    visible: true,
                });
                mainTab.activate();
            }
        })
        this.tab.context = "all_show";
        this.tab.activate()
    }
}