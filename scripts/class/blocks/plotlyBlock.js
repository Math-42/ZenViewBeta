const Plotly = require('plotly.js');
const EditingMenu = require('../EditingMenu');


module.exports = class PlotlyBlock {
    constructor(id, data, layout, config) {
        this.id = id + "_plot";
        this.data = (data === undefined) ? [] : data;
        this.layout = (layout === undefined) ? {} : layout;
        this.config = (config === undefined) ? {} : config;
        this.series = [];
        this.plotConfigs = {}
    }
    loadFromJson(PlotlyJson) {
        console.log("inicializando " + this.id, this.data);
        this.id = PlotlyJson.id;
        this.data = PlotlyJson.data;
        this.layout = PlotlyJson.layout;
        this.config = PlotlyJson.config;
        this.series = PlotlyJson.series;
        this.plotConfigs = PlotlyJson.plotConfigs;
        console.log("inicializando " + this.id, this.data);
    }
    getData() {
        this.plotConfigs = {
            title: this.layout.title.text,
            format: this.config.format,
            mode: this.config.mode,
            showlegend: this.layout.showlegend,
            series: this.series,
            traces: this.data,
            xaxis: {
                title: this.layout.xaxis.title.text
            },
            yaxis: {
                title: this.layout.yaxis.title.text
            }

        }
        return this.plotConfigs;
    }
    setId(id) {
        this.id = id + "_plot";
    }
    getId() {
        return this.id;
    }
    attData(newData) {
        let i = 0;
        for (i = 0; i < this.data.length; i++) {
            if (this.data[i].name === newData.name) {
                break;
            }
        };
        Plotly.restyle(this.id, newData, i)
    }
    attLayout(newLayout) {
        Plotly.relayout(this.id, newLayout);
    }
    attConfig(newConfig) {
        this.config = newConfig;
    }
    setAutoResize() {
        let widget = document.getElementById(this.id).parentElement;
        addResizeListener(widget, () => {
            Plotly.relayout(this.id, {
                width: 0.9 * widget.style.width,
                height: 0.9 * widget.style.height
            });
            let evt = window.document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
        })
    }
    addSerie(newSerie) {
        this.series.push(newSerie);
        let x = [];
        let y = [];
        for (let i = 0; i < 10; i++) {
            x[i] = Math.floor(i * 3)
            y[i] = Math.floor(100 * (Math.random()) % 20)
        }
        x.sort((a, b) => {
            return a - b;
        })
        Plotly.addTraces(this.id, {
            name: newSerie.name,
            x: x,
            y: y,
            line: newSerie.line,
            marker: newSerie.marker
        });

        Plotly.update(this.id)
    }
    removeSerie(serieName) {
        let i = 0;
        for (i = 0; i < this.data.length; i++) {
            if (this.data[i].name === serieName) {
                break;
            }
        };
        for (i = 0; i < this.series.length; i++) {
            if (this.series[i].name === serieName) {
                this.series.splice(i, 1);
                break;
            }
        };
        Plotly.deleteTraces(this.id, i)
    }
    init(editing) {
        console.log("inicializando " + this.id, this.data);
        this.config.staticPlot = editing;
        this.config.responsive = true;
        this.config.displaylogo = false;
        this.config.format = "png";
        this.config.type = "scatter";
        this.layout = {
            showlegend: true,
            title: {
                text: "",
                x: 0.1,
                font: {
                    family: 'Arial',
                    size: 20,
                    color: 'rgb(37,37,37)',
                }

            },
            xaxis: {
                title: ""
            },
            yaxis: {
                title: ""
            }
        }

        Plotly.newPlot(this.id, this.data, this.layout, this.config);
        this.setAutoResize();
    }
    htmlComponent() {
        let plotPlotly = document.createElement('div');
        plotPlotly.id = this.id;
        plotPlotly.className = "grid-stack-item-content widget";
        plotPlotly.style.backgroundColor = "white";
        return plotPlotly;
    }
}