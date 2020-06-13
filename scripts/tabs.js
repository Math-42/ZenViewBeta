const TabGroup = require("electron-tabs")

let tab
let tabGroup

//botao que cria novas abas
function createNewTabBtn(){
    if(tabGroup.getTabs().length<9){
        return{
            title: "New Tab",
            src: "./tabContent.html",
            closable: true,
            visible: true,
            loaded: false
        }
    }
}
//funcao de criacao de abas
function createNewTab(name,html){
    if(html === undefined){
        html = "./"
    }
    if(tabGroup.getTabs().length<9){
        return{
            title: name,
            src: html,
            closable: true,
            visible: true,
            loaded: false,
        }
    }
}

//funcao para abrir novas abas
function openNewTab(name,stats){
    let alreadyOpen;
    tabGroup.eachTab((tab)=>{//testa se já está aberto
        if(tab.title === name){
            alreadyOpen = true;
        }
    })
    if(!alreadyOpen){
        let newTab = tabGroup.getActiveTab();//pega a aba atual
        newTab.src = "dataViews/"+name+"/"+name+".html";//abre o html da nova aba
        newTab.status = stats
        newTab.setTitle(name)
        newTab.webview.src = "dataViews/"+name+"/"+name+".html"
        let newObj = fs.readFileSync(`./dataViews/${name}/${name}.json`);
        newObj = JSON.parse(newObj);
        newTab.descObj = newObj;
        newTab.activate();
    }else{
        alert("Already open")
    }
}

tabsOnLoad = ()=>{
    tabGroup = new TabGroup({
        newTab: createNewTabBtn   
    });

    tab = tabGroup.addTab({
        title: "New Tab",
        src: "./",
        closable: true,
        visible: true,
    });
    //evento de clicar em uma aba
    tabGroup.on("tab-active",()=>{
        let tempTab = tabGroup.getActiveTab()
        console.log(tempTab)
        //displayOptions("edit",false)
        //displayOptions("open",false)
        //displayOptions(tempTab.status,true)
    });
    //evento de adicionar uma aba
    tabGroup.on("tab-added", (tab) => {
        tab.activate();
    });
    //evento de remover uma aba
    tabGroup.on("tab-removed",(tab)=>{
        let allTabs = tabGroup.getTabs();
        if(allTabs.length === 0){//testa se n restou nenhuma aba
            let mainTab = tabGroup.addTab({
                title: "New Tab",
                src: "./",
                closable: true,
                visible: true,
            });
            mainTab.activate();
        }
    })

    tab.activate()
}
