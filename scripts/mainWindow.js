/**
    Esta é a classe principal para o programa funcionar, aqui estão contidos todos os elementos 
    renderizados na tela, como o menu lateral, as abas, botões e etc
    {@link https://github.com/Math-42/ZenView}
*/


const ipc = require("electron").ipcRenderer;
const fs = require("fs");
const menus = require("../../scripts/imports.js");
const classes = require("../../scripts/classes.js");
const SideMenu = require("../../scripts/sideMenu.js");
const popUpMenu = require("../../scripts/popup.js");
const DashBoard = classes.DashBoard;
const EditingMenu = classes.EditingMenu;

class MainWindow {
    constructor() {
        this.buttons = {};
        this.onLoadFunctions = [];
        this.currentDashBoard;
        this.sideMenu = new SideMenu();
        this.popUpMenu = new popUpMenu();
        this.EditingMenu = new EditingMenu();
    }
    /**
        Função para guardar todas funções que devem ser carregadas apos o inicio do programa, como ler os botoes, menus
        e renderiza-los
        @param {function} onLoadFunction funcão a ser executada
    */
    addOnLoadFunction(onLoadFunction) {
        this.onLoadFunctions.push(onLoadFunction);
    }
    /**
        Função que indica que o contexto da aba foi alterado, as abas mostram opções diferentes comforme os contextos que 
        estão abertos, como por exemplo, leitura, edição e nova aba 
        @param {string} newContext nome do novo contexto
    */
    contextChangeStyle(newContext) {
        //pega todos elementos que variam conforme o contexto
        let elements = document.getElementsByClassName("variable_context");
        //percorre os elementos lidos
        for (let i = 0; i < elements.length; i++) {
            //separa cada classe do elemento lido
            let styleClasses = elements[i].className.split(" ");
            //testa se o elemento possui a tag all_show, que indica que sempre deve ser mostrado ou se inclui a tag do novo contexto
            if (!(styleClasses.includes("all_show") || styleClasses.includes(newContext))) {
                //não mostra o elemento
                elements[i].style.display = "none";
            } else {
                //mostra o elemento
                elements[i].style.display = "block";
            }
        }
    }
    /**
     * Seta o novo título de acordo com o nome do dashboard e o contexto
     * @param {string} newTitle novo título da tela
     * @param {string} context novo contexto
     */
    changeTitle(newTitle, context) {
        let text;
        if (context === "all_show") {
            text = "";
        } else if (context === "edit_show") {
            text = "Editing: ";
        } else if (context === "start_show") {
            text = "Showing: ";
        } else {
            text = context;
        }
        document.getElementById("title").innerHTML = text + newTitle;
    }
    /**
     * Abre um novo dashboard de acordo com um contexto dado, edição ou leitura
     * @param {string} name nome do dashboard a ser aberto
     * @param {string} context contexto em que o dashboard deve ser aberto
     */
    openNewDashBoard(name, context) {
        this.changeTitle(name, context);

        let dashBoardObj = fs.readFileSync(`dashBoards/${name}/${name}.json`);
        dashBoardObj = JSON.parse(dashBoardObj);

        this.currentDashBoard = new DashBoard();

        if (context === "edit_show") {
            this.currentDashBoard.editing = true;
        } else {
            this.currentDashBoard.editing = false;
        }

        this.currentDashBoard.loadFromJson(dashBoardObj);
        this.currentDashBoard.init();
        this.currentDashBoard.context = context;


        console.log(this.currentDashBoard);

        mainwindow.dispatchEvent("ContextChange", {
            "context": context
        });

    }
    /**
     * Deleta o dashboard que está aberto
     */
    deleteCurrentDashBoard() {

        let answer = confirm("Are you shure?");

        if (answer === true) {

            fs.rmdirSync(`dashBoards/${this.currentDashBoard.name}`, {
                recursive: true
            });

            mainwindow.dispatchEvent("ContextChange", {
                "context": "all_show"
            });

            this.currentDashBoard.clear();
        }

    }
    /**
     * Salva o dashboard que está aberto
     */
    saveCurrentDashBoard() {
        let answer = confirm("Save changes?");

        if (answer === true) {

            let serializedData = [];

            this.currentDashBoard.gridStack.engine.nodes.forEach((node) => {
                serializedData.push({
                    id: node.id,
                    x: node.x,
                    y: node.y,
                    width: node.width,
                    height: node.height
                });
            });

            serializedData.forEach(widget => {
                for (let i = 0; i < this.currentDashBoard.blocks.length; i++) {
                    if (this.currentDashBoard.blocks[i].id == widget.id) {
                        this.currentDashBoard.blocks[i].id = widget.id,
                        this.currentDashBoard.blocks[i].x = widget.x,
                        this.currentDashBoard.blocks[i].y = widget.y,
                        this.currentDashBoard.blocks[i].width = widget.width,
                        this.currentDashBoard.blocks[i].height = widget.height;
                    }
                }
            });


            let name = this.currentDashBoard.name;
            this.currentDashBoard.gridStack = {};


            fs.writeFileSync(`dashBoards/${name}/${name}.json`, JSON.stringify(this.currentDashBoard, null, "\t"));
            this.EditingMenu.close();
            mainwindow.dispatchEvent("LoadNewDashBoard", {
                "name": name,
                "context": "start_show"
            });
        }
    }
    /**
        Função que carrega todos os eventos pre definidos, uma vez que os menus comunicam com a tela principal e entre
        se atraves de eventos
    */
    loadEvents() {
        window.addEventListener("ChangeSideMenu", (evt) => {
            console.log("Menu lateral foi alterado");
            this.sideMenu.changeSideMenu();
        });
        window.addEventListener("ClosePopupMenu", (evt) => {
            console.log("Menu popup foi fechado");
            this.popUpMenu.closePopup();
        });
        window.addEventListener("OpenPopupMenu", (evt) => {
            console.log("Menu popup foi aberto");
            this.popUpMenu.openPopup(evt.detail.menuName);
        });
        window.addEventListener("LoadNewDashBoard", (evt) => {
            console.log("Novo Dashboard foi carregado");
            this.openNewDashBoard(evt.detail.name, evt.detail.context);
        });
        window.addEventListener("ContextChange", (evt) => {
            console.log("Contexto da aba foi alterado");
            this.contextChangeStyle(evt.detail.context);
        });
        window.addEventListener("saveDashBoard", (evt) => {
            console.log("Salvando DashBoard");
            this.saveCurrentDashBoard();
        });
        window.addEventListener("deleteDashBoard", (evt) => {
            console.log("Deletando DashBoard");
            this.deleteCurrentDashBoard();
        });
        window.addEventListener("openEditingMenu", (evt) => {
            console.log("Abrindo menu de edição");
            this.EditingMenu.openPlotEditingMenu(evt.detail);
        });
        window.addEventListener("addNewBlock", (evt) => {
            console.log("Adicionando novo bloco");
            this.currentDashBoard.addNewWidget(evt.detail);
        });
        window.addEventListener("RemoveBlock", (evt) => {
            console.log("Removendo um bloco");
            this.currentDashBoard.removeWidget(evt.detail);
        });
        console.log("Os eventos foram carregados");
    }
    /**
        Percorre todas a funções salvas anteriormente para agora poder executa-las
    */
    loadStorageFunctions() {
        this.onLoadFunctions.forEach(onLoadFunction => {
            onLoadFunction();
        });
        this.loadPage();
    }
    /**
        Lê os botões que estão no arquivo buttons.json e os carrega como componentes
    */
    loadButtons() {
        let htmlButtons = "";
        let buttons = fs.readFileSync("./interface/buttons/buttons.json");
        buttons = JSON.parse(buttons);
        buttons.forEach(button => { //gera o html de todos os botoes
            this.buttons[button.id] = button;
            htmlButtons += `<button 
                            class="variable_context ${button.context}" 
                            type="button"
                            onclick=`;
            button.events.forEach(event => {
                htmlButtons += `'mainwindow.dispatchEvent(${JSON.stringify(event.name)},${JSON.stringify(event.details)})'`;
            });
            htmlButtons += `>${button.name}</button>`;
        });
        document.getElementById("side_tab_menu").innerHTML = htmlButtons;
        console.log("Os botões foram carregados");
    }
    /**
        Carrega todas as opções do menu, do arquivo popupOptions.json
    */
    loadPopupOptions() {
        let htmlPopupOptions = "";
        let popupOptions = {};
        let popupOptionsReader = fs.readFileSync("./interface/popup/popupOptions.json");
        popupOptionsReader = JSON.parse(popupOptionsReader);
        popupOptionsReader.forEach(option => { //gera o html de todos os botoes do menu
            popupOptions[option.id] = option;
            htmlPopupOptions += `<button 
                            class="variable_context ${option.context}" 
                            type="button"
                            id = "${option.id}"
                            onclick=`;
            option.events.forEach(event => {
                htmlPopupOptions += `'mainwindow.dispatchEvent(${JSON.stringify(event.name)},${JSON.stringify(event.details)})'`;
            });
            htmlPopupOptions += `>${option.name}</button>`;
        });
        this.popUpMenu.setTablinks(popupOptions);
        document.getElementById("optionTab").innerHTML = htmlPopupOptions;
        console.log("As opções do menu foram carregadas");
    }
    /***
        Carrega todos os menus, do arquivo popupMenus.json, que por sua vez são arquivos de modulos em .js
        cada menu tem suas proprias funções dentro de se mesmo, assim como seu html e css
    */
    loadPopupMenus() {
        let htmlPopupMenus = "";
        let popupMenus = {};
        let popupMenusReader = fs.readFileSync("./interface/popupMenus/popupMenus.json");
        popupMenusReader = JSON.parse(popupMenusReader);
        popupMenusReader.forEach(menu => { //gera o html de todos os menus
            popupMenus[menu] = new menus[menu]();
            htmlPopupMenus += popupMenus[menu].htmlBuilder();

        });
        document.getElementById("tabcontentContainer").innerHTML = htmlPopupMenus;
        this.popUpMenu.setMenus(popupMenus);
        console.log("Os menus foram carregados");
    }
    /**
        Carrega a parte visual da pagina, e calcula o tempo de load, para mostrar a pagina principal apos 3 segundos no minimo
        @
    */
    loadPage() {
        var duracao = Date.now(); //pega o horario atual
        this.loadEvents();
        this.loadButtons();
        this.loadPopupOptions();
        this.loadPopupMenus();
        this.EditingMenu.init();
        duracao = Date.now() - duracao; //pega a duracao do load
        duracao = (duracao > 3000) ? 0 : 3000 - duracao; //testa se foram mais de 3 segundos
        setTimeout(() => { //caso n tenha sido espera o gif terminar para chamar a janela principal
            ipc.send("mainLoadCompleto", {
                show: true
            });
        }, duracao);
        mainwindow.dispatchEvent("ContextChange", {
            "context": "all_show"
        });
        console.log("Programa carregado completamente");
    }
    /**
        Função que deve ser chamada para comunicação entre modulos do programa
        @param {string} eventName nome do evento a ser disparado
        @param {object} details detalhes que são enviados junto com o evento, no caso qualquer tipo de dado
    */
    dispatchEvent(eventName, details) {

        if (details === undefined) {
            console.log(eventName);
            window.dispatchEvent(new Event(eventName));
        } else {
            console.log(eventName, details);
            window.dispatchEvent(new CustomEvent(eventName, {
                detail: details
            }));
        }
    }
}
//cria a janela principal
const mainwindow = new MainWindow();
//espera a janela ser carregada para executar as seguintes funções
window.onload = () => {
    mainwindow.loadStorageFunctions();
};