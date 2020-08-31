const MenuBuilder = require('./menuBuilder')
const LineChartMenu = require('./plotly/lineChartMenu')
const indicatorMenu = require('./plotly/indicatorMenu')
module.exports = class PlotlyEditingMenu {
    constructor() {
        this.plot
        this.block
        this.menu
        this.isInitialized = false;
        this.lineChartMenu = new LineChartMenu();
        this.indicatorMenu = new indicatorMenu();
        this.tridChartOptions;
        this.tableChartOptions;
        this.currentMenu;
    }
    load(block, menu) {
        this.block = block
        this.menu = menu
        if (!this.isInitialized) {
            this.init()
        }

        console.log("menu plotly aberto")
        this.loadMenu(this.block.type.sub)
    }
    loadMenu(selection) {
        console.log("Seleção: " + selection)

        if (selection === "lineChart") {
            if (this.block.plots.Plotly.lineChart === undefined) {
                this.block.setPlotType({
                    main: "Plotly",
                    sub: "lineChart"
                })
                this.block.currentPlot.init();
                this.lineChartMenu.load()
            } else {
                this.block.setPlotType({
                    main: "Plotly",
                    sub: "lineChart"
                })
            }

        } else if (selection === "indicator") {
            if (this.block.plots.Plotly.indicator === undefined) {
                this.block.setPlotType({
                    main: "Plotly",
                    sub: "indicator"
                })
                this.block.currentPlot.init();
            } {
                this.block.setPlotType({
                    main: "Plotly",
                    sub: "indicator"
                })
                this.indicatorMenu.load()
            }
        }
        this.block.currentPlot.load(true)
    }
    init() {
        this.menu.onFieldChange("editingMenuRoot.plotlyDiv.plotlyMenu.tipoDePlot", (value) => {
            this.loadMenu(value)
        })

        this.isInitialized = true
    }
}