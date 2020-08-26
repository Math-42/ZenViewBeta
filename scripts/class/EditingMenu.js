const PlotlyEditingMenu = require('./menus/plotlyEditingMenu')
const MenuBuilder = require('./menus/menuBuilder')

module.exports = class EditingMenu {
    constructor() {

        this.currentMenu;
        this.whoCalled;
        this.block;
        this.isOpen = false;

        this.plotlyMenu = new PlotlyEditingMenu();

        this.mainOption = {
            "name": "main_geral",
            "title": "Pacote",
            "id": "main_menu",
            "fields": [{
                "type": "selectInput",
                "title": "Selecione um pacote",
                "id": "select_pacote",
                "options": [{
                        "text": "Plotly",
                        "value": 1
                    },
                    {
                        "text": "TODO Three.js",
                        "value": 2
                    },
                    {
                        "text": "TODO Google GPS",
                        "value": 3
                    },
                    {
                        "text": "TODO Apex Charts",
                        "value": 4
                    }
                ]
            }]
        }
    }
    openPlotEditingMenu(block) {
        block = block.block
        if (this.isOpen && block.id === this.whoCalled) {
            document.getElementById("editing_menu").style.display = "none";
            document.getElementById("main").style.marginRight = "0px";
            document.getElementById(this.whoCalled + "_plot").style.boxShadow = "0px 1px 22px -12px #607D8B"
            this.isOpen = false;
        } else {
            try {
                document.getElementById(this.whoCalled + "_plot").style.boxShadow = "0px 1px 22px -12px #607D8B"
            } catch (error) {

            }
            this.whoCalled = block.id
            this.block = block;
            document.getElementById("editing_menu").style.display = "block";
            document.getElementById("editing_menu").style.width = "22%";
            document.getElementById("main").style.marginRight = "22%";
            document.getElementById(this.whoCalled + "_plot").style.boxShadow = "10px 10px 22px -12px #007bff"
            this.isOpen = true;
            this.loadMenu()
        }
    }
    close() {
        document.getElementById("editing_menu").style.display = "none";
        document.getElementById("main").style.marginRight = "0px";
        this.isOpen = false;
        this.block = undefined;
    }
    loadMenu(selection) {
        /*let menus = document.getElementsByClassName("editing_menu_form");
        for (let i = 0; i < menus.length; i++) {
            //menus[i].style.display = "none"
        }
        console.log(menus)*/
        selection = (selection === undefined) ? this.block.plotLib : selection
        if (selection === "Plotly") {
            this.currentMenu = this.plotlyMenu;
            this.currentMenu.load(this.block.plot)
        }
    }
    init() {
        let mainOption = MenuBuilder.build(this.mainOption);

        document.getElementById("accordion").appendChild(mainOption);
        let subOptions = document.createElement('div');
        subOptions.id = "subOptions_menu"
        document.getElementById("accordion").appendChild(subOptions);


        document.getElementById("main_menu_select_pacote").onchange = () => {
            let selection = document.getElementById("packageSelector").value
            console.log("Opção selcionada: " + selection)
            this.loadMenu(selection);
        }

        document.getElementById("editingMenuCloseBtn").onclick = () => {
            this.openPlotEditingMenu({
                block: this.block
            });
        }

        document.getElementById("editingMenuDeleteBtn").onclick = () => {
            this.openPlotEditingMenu({
                block: this.block
            });
            mainwindow.dispatchEvent("RemoveBlock", this.block);
        }

        this.plotlyMenu.init()
    }
}