const ElementResize = require('javascript-detect-element-resize');
const LineChartPlotlyBlock = require('./blocks/lineChartPlotlyBlock');
const IndicatorPlotlyBlock = require('./blocks/indicatorPlotlyBlock');
module.exports = class Block {
    constructor(id, type) {
        this.plotLib = type;
        this.id = id;
        this.width = 4;
        this.height = 3;
        this.x;
        this.y;
        this.editing = true;
        this.currentPlot;
        this.plotTypes;
        this.type;
        this.plots = {
            Plotly: {
                lineChart: undefined,
                indicator: undefined
            },
            Threejs: undefined
        }
        this.setPlotType(type);
    }
    setPlotType(type) {
        if (type.main === "Plotly") {
            if (type.sub === "lineChart") {
                this.plots.Plotly.lineChart = (this.plots.Plotly.lineChart === undefined) ? new LineChartPlotlyBlock(this.id) : this.plots.Plotly.lineChart;
                this.currentPlot = this.plots.Plotly.lineChart
            } else if (type.sub === "indicator") {
                this.plots.Plotly.indicator = (this.plots.Plotly.indicator === undefined) ? new IndicatorPlotlyBlock(this.id) : this.plots.Plotly.indicator;
                this.currentPlot = this.plots.Plotly.indicator
            }
        }
        this.type = type;
    }
    loadFromJson(BlockJson) {
        this.width = BlockJson.width;
        this.height = BlockJson.height;
        this.x = BlockJson.x;
        this.y = BlockJson.y;
        this.plotLib = BlockJson.plotLib;
        this.id = BlockJson.id
        this.setPlotType(BlockJson.type);
        this.currentPlot.loadFromJson(BlockJson.currentPlot);
    }
    init(editing) {
        this.editing = editing;
        console.log("inicializando bloco " + this.id);
        this.currentPlot.init(this.editing);
        if (this.editing) {
            document.getElementById(this.id).ondblclick = () => {
                mainwindow.dispatchEvent('openEditingMenu', {
                    "block": this
                });
            };
        }
    }
    load(editing) {
        this.editing = editing;
        console.log("Carregando bloco " + this.id);
        this.currentPlot.load(this.editing);
        if (this.editing) {
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
        newWidget.appendChild(this.currentPlot.htmlComponent());
        return newWidget;
    }
}