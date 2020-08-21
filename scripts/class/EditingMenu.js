const PlotlyEditingMenu = require('./menus/plotlyEditingMenu')
module.exports = class EditingMenu {
    constructor() {
        this.isOpen = false;
        this.currentMenu;
        this.plotlyMenu = new PlotlyEditingMenu();
        this.whoCalled;
        this.block;
    }
    openPlotEditingMenu(block) {
        block = block.block
        if (this.isOpen && block.id === this.whoCalled) {
            document.getElementById("editing_menu").style.display = "none";
            document.getElementById("main").style.marginRight = "0px";
            document.getElementById(this.whoCalled+"_plot").style.boxShadow = "0px 1px 22px -12px #607D8B"
            this.isOpen = false;
        } else {
            try{
                document.getElementById(this.whoCalled+"_plot").style.boxShadow = "0px 1px 22px -12px #607D8B"
            }catch(error){

            }
            this.whoCalled = block.id
            this.block = block;
            document.getElementById("editing_menu").style.display = "block";
            document.getElementById("editing_menu").style.width = "22%";
            document.getElementById("main").style.marginRight = "22%";
            document.getElementById(this.whoCalled+"_plot").style.boxShadow = "10px 10px 22px -12px #007bff"
            this.isOpen = true;
            this.loadMenu()
        }
    }
    loadMenu(selection) {
        selection = (selection === undefined) ? this.block.plotLib : selection
        if (selection === "Plotly") {
            this.currentMenu = this.plotlyMenu;
            this.currentMenu.load(this.block.plot)
        }
    }
    init() {
        document.getElementById("packageSelector").onchange = () => {
            let selection = document.getElementById("packageSelector").value
            console.log("Opção selcionada: " + selection)
            this.loadMenu(selection);
        }
        document.getElementById("editingMenuDeleteBtn").onclick = () =>{
            this.openPlotEditingMenu({block: this.block});
        }
        this.plotlyMenu.init()
    }
}