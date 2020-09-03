const Plotly = require("plotly.js");
const loadash = require("lodash");

module.exports = class lineChartPlotlyBlock {
    constructor(id, data, layout, config) {
        this.id = id + "_plot";
        this.data = (data === undefined) ? [] : data;
        this.layout = (layout === undefined) ? {} : layout;
        this.config = (config === undefined) ? {} : config;
        this.series = [];
        this.type = "lineChart";
        this.plotConfigs = {};
    }
    loadFromJson(PlotlyJson) {
        this.id = PlotlyJson.id;
        this.data = PlotlyJson.data;
        this.layout = PlotlyJson.layout;
        this.config = PlotlyJson.config;
        this.series = PlotlyJson.series;
        this.type = PlotlyJson.type;
        this.plotConfigs = PlotlyJson.plotConfigs;
    }
    getData() {
        this.plotConfigs = {
            layout: this.layout,
            data: this.data
        };
        return this.plotConfigs;
    }
    attData(newData) {

        let i = 0;
        let found = false;
        for (i = 0; i < this.data.length; i++) {
            if (this.data[i].name === newData.currentSerieName) {
                found = true;
                break;
            }
        }

        if (found) {

            if (newData["showmarkers"] && newData["showlines"]) {
                newData.mode = "lines+markers";
                newData.visible = true;
            } else if (newData["showmarkers"] && !newData["showlines"]) {
                newData.mode = "markers";
                newData.visible = true;
            } else if (!newData["showmarkers"] && newData["showlines"]) {
                newData.mode = "lines";
                newData.visible = true;
            } else if(!newData["showmarkers"] && !newData["showlines"]) {
                newData.visible = false;
            }

            Plotly.restyle(this.id, newData, i);
        }
    }
    attLayout(newLayout) {
        this.layout = loadash.merge(this.layout, newLayout);
        Plotly.relayout(this.id, this.layout);
    }
    attConfig(newConfig) {
        this.config = loadash.merge(this.config, newConfig);
    }
    att(newSetup) {
        if (newSetup !== undefined) this.attConfig(newSetup.config);
        if (newSetup !== undefined) this.attLayout(newSetup.layout);
        if (newSetup !== undefined) this.attData(newSetup.data);
    }
    setAutoResize() {
        let widget = document.getElementById(this.id).parentElement;
        addResizeListener(widget, () => {
            Plotly.relayout(this.id, {
                width: 0.9 * widget.style.width,
                height: 0.9 * widget.style.height
            });
            let evt = window.document.createEvent("UIEvents");
            evt.initUIEvent("resize", true, false, window, 0);
            window.dispatchEvent(evt);
        });
    }
    addSerie(newSerie) {
        this.series.push(newSerie);
        let x = [];
        let y = [];
        for (let i = 0; i < 10; i++) {
            x[i] = Math.floor(i * 3);
            y[i] = Math.floor(100 * (Math.random()) % 20);
        }
        x.sort((a, b) => {
            return a - b;
        });
        Plotly.addTraces(this.id, {
            name: newSerie.name,
            x: x,
            y: y,
            mode: newSerie.mode,
            line: newSerie.line,
            marker: newSerie.marker
        });

        Plotly.update(this.id);
    }
    removeSerie(serieName) {
        let i = 0;
        for (i = 0; i < this.data.length; i++) {
            if (this.data[i].name === serieName) {
                break;
            }
        }
        for (i = 0; i < this.series.length; i++) {
            if (this.series[i].name === serieName) {
                this.series.splice(i, 1);
                break;
            }
        }
        Plotly.deleteTraces(this.id, i);
    }
    init(editing) {
        console.log("Inicializando line chart");
        this.config.staticPlot = editing;
        this.config.responsive = true;
        this.config.displaylogo = false;
        this.config.format = "png";
        this.config.type = "scatter";
        this.layout = {
            showlegend: true,
            title: {
                text: "asadasd",
                x: 0.1,
                font: {
                    family: "Arial",
                    size: 20,
                    color: "rgb(37,37,37)",
                }
            },
            xaxis: {
                title: ""
            },
            yaxis: {
                title: ""
            },
            margin: {
                t: 80,
                b: 80,
                l: 80,
                r: 80
            }
        };

        Plotly.newPlot(this.id, this.data, this.layout, this.config);
        this.setAutoResize();
    }
    load(editing) {
        console.log("carregando line chart");
        this.config = {
            staticPlot: editing,
            displaylogo: false
        };
        Plotly.react(this.id, this.data, this.layout, this.config);
        this.setAutoResize();
    }
    htmlComponent() {
        let plotPlotly = document.createElement("div");
        plotPlotly.id = this.id;
        plotPlotly.className = "grid-stack-item-content widget";
        plotPlotly.style.backgroundColor = "white";
        return plotPlotly;
    }
};