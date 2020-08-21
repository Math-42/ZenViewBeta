
const ElementResize = require('javascript-detect-element-resize');
const PlotlyBlock = require('./blocks/plotlyBlock');
module.exports = class Block {
    constructor(id,plotLib) {
        this.plotLib = plotLib;
        this.id = id;
        this.width = 4;
        this.height = 3;
        this.inputs = [];
        this.plot = {};
    }
    packageSelector() {
        let newPlot;
        if (this.plotLib === "Plotly") {
            this.plot = new PlotlyBlock(this.id);
            newPlot = this.plot.htmlComponent();
        }
        newPlot.ondblclick = () => {
            mainwindow.dispatchEvent('openEditingMenu', {
                "block": this
            });
        };
        return newPlot;
    }
    init(){
        console.log("inicializando bloco "+this.id);
        this.plot.init();
    }
    plotHtmlComponent() {
        let newWidget = document.createElement("div");
        newWidget.id = this.id;
        newWidget.className = "grid-stack-item";
        newWidget.appendChild(this.packageSelector());
        return newWidget;
    }
}