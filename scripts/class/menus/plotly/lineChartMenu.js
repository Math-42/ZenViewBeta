module.exports = class LineChartMenu {
    constructor() {
        this.plot;
        this.isInitialized = false;
        this.menuComponents = [];
        this.colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
        this.colorCount = 0;
    }
    init() {
        if (!this.isInitialized) {
            this.setEvents();
            this.isInitialized = true;
        }
    }
    setData() {
        let data = this.plot.getData();
        let junk = {};
        junk["plotly"] = data;


        let inputs = mainwindow.currentDashBoard.inputs;

        this.menu.setOptions("plotly.data.x", inputs, (input) => {
            return {
                text: input.name
            };
        });

        this.menu.setOptions("plotly.data.y", inputs, (input) => {
            return {
                text: input.name
            };
        });
        
        this.attSerieSelector();

        this.menu.getFieldElement("serieName").value = "";

        this.plot.data.forEach(serie => {
            this.addSerieList(serie);
        });

        this.attSeriesList();
        this.menu.setData(junk);
    }
    attSerieSelector(){
        this.menu.setOptions("plotly.data.currentSerieName", this.plot.data, (serie) => {
            return {
                text: serie.name
            };
        });
    }
    attSeries() {
        let currentSerieName = this.menu.getField("plotly.data.currentSerieName");
        let currentSerie;

        for (let i = 0; i < this.plot.data.length; i++) {
            if (this.plot.data[i].name === currentSerieName) {
                currentSerie = this.plot.data[i];
            }
        }

        if (currentSerie === undefined) {
            return;
        }

        if (currentSerie.mode === "lines+markers" || currentSerie.mode === undefined) {
            currentSerie.showmarkers = true;
            currentSerie.showlines = true;
        } else if (currentSerie.mode === "markers") {
            currentSerie.showmarkers = true;
            currentSerie.showlines = false;
        } else if (currentSerie.mode === "lines") {
            currentSerie.showlines = true;
            currentSerie.showmarkers = false;
            if (currentSerie.visible == false) {
                currentSerie.showlines = false;
            }
        }

        let boilerPlate = {};
        boilerPlate["plotly.data"] = currentSerie;
        this.menu.setData(boilerPlate);
    }
    addSerie(data) {
        if (data.name === undefined || data.name === "") {
            return;
        }

        for (let i = 0; i < this.plot.data.length; i++) {
            if (this.plot.data[i].name === data.name) {
                return;
            }
        }

        let newcolor = String([this.colors[this.colorCount]]);

        this.plot.addSerie({
            name: data.name,
            x: data.x,
            y: data.y,
            mode: "lines+markers",
            line: {
                width: "3",
                color: newcolor,
                dash: "solid",
                shape: "linear"
            },
            marker: {
                size: "5",
                color: newcolor
            }
        });

        this.colorCount = (this.colorCount + 1) % this.colors.length;
        this.attSerieSelector();
        this.attSeriesList();
        this.attSeries();
    }
    attSeriesList(){
        document.getElementById("plotly_linechart_series_list").innerHTML = "";
        this.plot.data.forEach(serie => {
            this.addSerieList(serie);
        });
    }
    addSerieList(data) {
        let newOption = document.createElement("option");
        newOption.textContent = data.name;
        newOption.value = data.name;
        
        let newSerie = document.createElement("div");
        newSerie.className = " input-group mb-1";
        newSerie.id = `Plotly_serie_${data.name}`;
        newSerie.innerHTML = `  <input type="text" class="form-control" placeholder="${data.name}" readonly>
                                <div class="input-group-append">
                                    <button id="Plotly_rmv_${data.name}" class="btn btn-secondary"
                                        type="button">&times;</button>
                                </div>`;
        document.getElementById("plotly_linechart_series_list").appendChild(newSerie);

        document.getElementById(`Plotly_rmv_${data.name}`).onclick = () => {
            document.getElementById(`Plotly_serie_${data.name}`).remove();
            this.plot.removeSerie(`${data.name}`);
            this.attSerieSelector();
        };
    }
    setEvents() {
        this.menu.onGroupChange("plotlyLineChart", (data) => {
            this.plot.att(data.plotly);
        });
        this.menu.onFieldChange("serieName_button", () => {
            let info = this.menu.getGroup("PlotlyDataGroup");
            this.addSerie(info.plotly.data);
            this.menu.getFieldElement("serieName").value = "";
        });
        this.menu.onFieldChange("plotly.data.currentSerieName", () => {
            this.attSeries();
        });

    }
    load(plot, menu) {
        this.plot = plot;
        this.menu = menu;

        if (!this.isInitialized) {
            this.init();
        }

        this.setData();
    }
};