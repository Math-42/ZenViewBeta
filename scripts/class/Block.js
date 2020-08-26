
const ElementResize = require('javascript-detect-element-resize');
const PlotlyBlock = require('./blocks/plotlyBlock');
module.exports = class Block {
    constructor(id,plotLib) {
        this.plotLib = plotLib;
        this.id = id;
        this.width = 4;
        this.height = 3;
        this.x;
        this.y;
        this.editing = true;
        if (this.plotLib === "Plotly") {
            this.plot = new PlotlyBlock(this.id);
        }else{
            this.plot = {}
        }
    }
    loadFromJson(BlockJson){
        this.width = BlockJson.width;
        this.height = BlockJson.height;
        this.x = BlockJson.x;
        this.y = BlockJson.y;
        this.plotLib = BlockJson.plotLib;
        this.id = BlockJson.id
        if (this.plotLib === "Plotly") {
            this.plot = new PlotlyBlock(this.id);
            this.plot.loadFromJson(BlockJson.plot);
        }
    }
    init(editing){
        this.editing = editing;
        console.log("inicializando bloco "+this.id);
        this.plot.init(this.editing);
        if(this.editing){
            document.getElementById(this.id).ondblclick = () => {
                mainwindow.dispatchEvent('openEditingMenu', {
                    "block": this
                });
            };
        }
    }
    load(editing){
        this.editing = editing;
        console.log("Carregando bloco "+this.id);
        this.plot.load(this.editing);
        if(this.editing){
            document.getElementById(this.id).ondblclick = () => {
                mainwindow.dispatchEvent('openEditingMenu', {
                    "block": this
                });
            };
        }
    }
    plotHtmlComponent() {
        let newWidget = document.createElement("div");
        newWidget.id = this.id;
        newWidget.className = "grid-stack-item";
        newWidget.appendChild(this.plot.htmlComponent());
        return newWidget;
    }
}