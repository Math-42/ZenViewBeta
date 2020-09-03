const LineChartMenu = require("./plotly/lineChartMenu");
const indicatorMenu = require("./plotly/indicatorMenu");
module.exports = class PlotlyEditingMenu {
    constructor() {
        this.plot;
        this.block;
        this.menu;
        this.isInitialized = false;
        this.lineChartMenu = new LineChartMenu();
        this.indicatorMenu = new indicatorMenu();
        this.tridChartOptions;
        this.tableChartOptions;
        this.currentMenu;
    }
    load(block, menu) {
        this.block = block;
        this.menu = menu;
        if (!this.isInitialized) {
            this.init();
        }
        this.loadMenu(this.block.type.sub);
    }
    loadMenu(selection) {
        console.warn("Seleção: " + selection);

        if (selection === "lineChart") {
            if (this.block.plots.Plotly.lineChart === undefined) {
                this.block.setPlotType({
                    main: "Plotly",
                    sub: "lineChart"
                });
                this.block.currentPlot.init();
            } else {
                this.block.setPlotType({
                    main: "Plotly",
                    sub: "lineChart"
                });
            }
            this.lineChartMenu.load(this.block.currentPlot, this.menu);

        } else if (selection === "indicator") {
            if (this.block.plots.Plotly.indicator === undefined) {
                this.block.setPlotType({
                    main: "Plotly",
                    sub: "indicator"
                });
                this.block.currentPlot.init();
            } {
                this.block.setPlotType({
                    main: "Plotly",
                    sub: "indicator"
                });

            }
            this.indicatorMenu.load(this.block.currentPlot, this.menu);
        }
        this.block.currentPlot.load(true);
    }
    init() {
        this.menu.onFieldChange("plotSelector", (value) => {
            console.warn("Campo de tipo de plot alterado, selecionado: " + value);
            this.loadMenu(value);
        });

        this.isInitialized = true;
    }
};