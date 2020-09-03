const PlotlyEditingMenu = require("./menus/plotlyEditingMenu");
const Menu = require("./menus/menuBuilder");

module.exports = class EditingMenu {
    constructor() {

        this.currentMenu;
        this.whoCalled;
        this.block;
        this.isOpen = false;
        this.menu;
        this.plotlyMenu = new PlotlyEditingMenu();

    }
    openPlotEditingMenu(block) {
        block = block.block;
        if (this.isOpen && block.id === this.whoCalled) {
            document.getElementById("editing_menu").style.display = "none";
            document.getElementById("main").style.marginRight = "0px";
            document.getElementById(this.whoCalled + "_plot").style.boxShadow = "0px 1px 22px -12px #607D8B";
            this.isOpen = false;
        } else {
            try {
                document.getElementById(this.whoCalled + "_plot").style.boxShadow = "0px 1px 22px -12px #607D8B";
            } catch (error) {}
            this.whoCalled = block.id;
            this.block = block;
            document.getElementById("editing_menu").style.display = "block";
            document.getElementById("editing_menu").style.width = "22%";
            document.getElementById("main").style.marginRight = "22%";
            document.getElementById(this.whoCalled + "_plot").style.boxShadow = "10px 10px 22px -12px #007bff";
            this.isOpen = true;
            this.loadMenu();
        }
    }
    close() {
        document.getElementById("editing_menu").style.display = "none";
        document.getElementById("main").style.marginRight = "0px";
        this.isOpen = false;
        this.block = undefined;
    }
    loadMenu(selection) {
        selection = (selection === undefined) ? this.block.type.main : selection;
        if (selection === "Plotly" || selection == 1) {
            console.log("abrindo menu plotly");
            this.currentMenu = this.plotlyMenu;
            this.currentMenu.load(this.block, this.menu);
        } else {
            this.currentMenu.load(this.block);
        }
    }
    init() {
        let root = document.getElementById("accordion");
        let menuConfig = require("./menus/setup.json");
        this.menu = new Menu(menuConfig, root);
        this.menu.init();

        this.menu.onFieldChange("packageSelector", (value) => {
            this.loadMenu(value);
        });

        document.getElementById("editingMenuCloseBtn").onclick = () => {
            this.openPlotEditingMenu({
                block: this.block
            });
        };

        document.getElementById("editingMenuDeleteBtn").onclick = () => {
            this.openPlotEditingMenu({
                block: this.block
            });
            mainwindow.dispatchEvent("RemoveBlock", this.block);
        };
    }
};