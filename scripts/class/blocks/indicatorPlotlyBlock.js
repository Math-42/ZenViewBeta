const Plotly = require('plotly.js');


module.exports = class indicatorPlotlyBlock {
    constructor(id) {
        this.id = id + "_plot";
        this.type = 3;
        this.config = {}
        this.data
        this.plotConfigs = {}
    }
    loadFromJson(PlotlyJson) {
        this.id = PlotlyJson.id;
        this.data = PlotlyJson.data;
        this.layout = PlotlyJson.layout;
        this.config = PlotlyJson.config;
        this.type = PlotlyJson.type;
        this.plotConfigs = PlotlyJson.plotConfigs;
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
    init(editing) {
        this.config.staticPlot = editing;
        this.config.responsive = true;
        this.config.displaylogo = false;
        this.config.format = "png";
        this.data = [
            {
                value: 42,
                domain: { x: [0.1, 0.9], y: [0, 1] },
                type: "indicator",
                mode: "number+delta",
                delta:{
                    reference: 0
                }
            }
        ]
        this.layout = {
            margin: { t: 0, b: 0, l: 0, r: 0 }
        }
        console.log("bloco indicador inicializado")
        Plotly.react(this.id, this.data, this.layout, this.config);
        this.setAutoResize();
    }
    load(editing) {
        this.config.staticPlot = editing;
        this.config.displaylogo = false;
        Plotly.react(this.id, this.data, this.layout, this.config);
        this.setAutoResize();
    }
}