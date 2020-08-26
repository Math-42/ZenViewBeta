const fs = require("fs")
const MenuBuilder = require('../menuBuilder')

module.exports = class LineChartMenu {
    constructor() {
        this.plot
        this.isInitialized
        this.menuComponents = [];
        this.colors = ["#ff0000", "#0000ff", "#ffa500", "#800080", "#008000", "#4b0082"]
        this.colorCount = 0;
        this.last = "";
    }
    init() {
        if (!this.isInitialized) {
            let menuBlock = document.createElement('form');
            menuBlock.className = "subMenuBlock"
            menuBlock.id = "lineChart_subMenuBlock"
            let jsonMenu = require('./setupFiles/lineChartSetup.json')
            jsonMenu.forEach(card => {
                menuBlock.appendChild(MenuBuilder.build(card));
            });
            document.getElementById('Plotly_subOptions').appendChild(menuBlock);
            this.isInitialized = true;
            this.setEvents()
        }
    }
    setData() {
        let data = this.plot.getData();
        document.getElementById("Plotly_lineChart_geral_title").value = data.layout.title.text;
        document.getElementById("Plotly_lineChart_geral_showlegend").checked = data.layout.showlegend
        document.getElementById("Plotly_lineChart_geral_xaxestitle").value = data.layout.xaxis.title
        document.getElementById("Plotly_lineChart_geral_yaxestitle").value = data.layout.yaxis.title

        let inputs = mainwindow.currentDashBoard.inputs;

        this.setOptions("Plotly_lineChart_series_xaxes_input", inputs, (input) => {
            return input.name
        })

        this.setOptions("Plotly_lineChart_series_yaxes_input", inputs, (input) => {
            return input.name
        })


        this.setOptions("Plotly_lineChart_style_selectedSerie", data.data, (serie) => {
            return serie.name;
        })

        this.attSeries()
    }
    attSeries() {
        let data = this.plot.getData();
        let currentTraceName = document.getElementById("Plotly_lineChart_style_selectedSerie").value
        let traces = data.data;
        let currentTrace;

        for (let i = 0; i < traces.length; i++) {
            if (traces[i].name === currentTraceName) {
                currentTrace = traces[i];
            }
        }

        if (currentTrace.mode === "lines+markers") {
            data.showMarkers = true;
            data.showLines = true;
        } else if (currentTrace.mode === "markers") {
            data.showMarkers = true;
            data.showLines = false;
        } else if (currentTrace.mode === "lines") {
            data.showLines = true;
            data.showMarkers = false;
            if(currentTrace.line.width == 0){
                data.showLines = false;
            }
        } 

        this.setSelectedOption("Plotly_lineChart_style_line_color", currentTrace.line.color)
        document.getElementById("Plotly_lineChart_style_line_color").style.backgroundColor = currentTrace.line.color
        this.setSelectedOption("Plotly_lineChart_style_line_width", currentTrace.line.width)
        this.setSelectedOption("Plotly_lineChart_style_line_shape", currentTrace.line.shape)
        this.setSelectedOption("Plotly_lineChart_style_line_dash", currentTrace.line.dash)
        this.setSelectedOption("Plotly_lineChart_style_marker_color", currentTrace.marker.color)
        document.getElementById("Plotly_lineChart_style_marker_color").style.backgroundColor = currentTrace.marker.color
        this.setSelectedOption("Plotly_lineChart_style_marker_width", currentTrace.marker.size)
        document.getElementById("Plotly_lineChart_style_showLines").checked = data.showLines
        document.getElementById("Plotly_lineChart_style_showMarkers").checked = data.showMarkers
        

        this.showLines();
        this.showMarkers();

        this.getData(document.getElementById('lineChart_subMenuBlock').elements);
    }
    setSelectedOption(selectId, selectedOption) {
        let select = document.getElementById(selectId)
        for (let i = 0, j = select.options.length; i < j; i++) {
            if (select.options[i].value == selectedOption || select.options[i].textContent == selectedOption) {
                select.options[i].selected = true;
                return
            }
        }
    }
    setOptions(selectId, options, func) {
        let select = document.getElementById(selectId);
        let newOption
        for (let i = select.options.length -1; i >= 0; i--) {
            select.remove(i);
        }
        options.forEach(option => {
            newOption = document.createElement('option');
            newOption.value = func(option)
            newOption.textContent = func(option)
            select.appendChild(newOption);
        })
    }
    getData(data) {
        let formData = {};
        let value;
        let ignore = [
            "Plotly_lineChart_series_serieName",
            "Plotly_lineChart_series_xaxes_input",
            "Plotly_lineChart_series_yaxes_input",
            "Plotly_lineChart_style_selectedSerie"
        ]
        let hash = "";
        for (let i = 0; i < data.length; i++) {
            let e = data[i];
            if (e.type !== "checkbox") {
                value = e.value
            } else {
                value = e.checked
            }
            formData[String(e.id).replace("Plotly_lineChart_", "")] = value;
            if (!ignore.includes(e.id)) {
                hash += e.id + value
            }
        }
        if (hash !== this.last) {
            this.last = hash;
            this.sendData(formData);
        }
        return -1;
    }
    sendData(data) {
        let mode;
        if (data["style_showMarkers"] && data["style_showLines"]) {
            mode = "lines+markers"
        } else if (data["style_showMarkers"] && !data["style_showLines"]) {
            mode = "markers"
        } else if (!data["style_showMarkers"] && data["style_showLines"]) {
            mode = "lines"
        } else {
            mode = "lines"
            data["style_line_width"] = 0;
        }

        let newSetup = {
            config: {

            },
            layout: {
                title: {
                    text: data["geral_title"]
                },
                showlegend: data["geral_showlegend"],
                xaxis: {
                    title: data["geral_xaxestitle"]
                },
                yaxis: {
                    title: data["geral_yaxestitle"]
                }
            },
            data: {
                name: data["style_selectedSerie"],
                mode: mode,
                line: {
                    color: data["style_line_color"],
                    width: data["style_line_width"],
                    shape: data["style_line_shape"],
                    dash: data["style_line_dash"]
                },
                marker: {
                    color: data["style_marker_color"],
                    size: data["style_marker_width"]
                }
            }
        }
        console.log(newSetup)
        console.log("dados enviados para o plot")
        this.plot.att(newSetup)
    }
    showMarkers() {
        if (!document.getElementById("Plotly_lineChart_style_showMarkers").checked) {
            document.getElementById("Plotly_lineChart_style_markersOptions").style.display = "none"
        } else {
            document.getElementById("Plotly_lineChart_style_markersOptions").style.display = "block"
        }
    }
    showLines() {
        if (!document.getElementById("Plotly_lineChart_style_showLines").checked) {
            document.getElementById("Plotly_lineChart_style_linesOptions").style.display = "none"
        } else {
            document.getElementById("Plotly_lineChart_style_linesOptions").style.display = "block"
        }
    }
    setEvents() {
        document.getElementById("lineChart_subMenuBlock").addEventListener("input", () => {
            this.getData(document.getElementById('lineChart_subMenuBlock').elements)
        });

        document.getElementById("Plotly_lineChart_series_addSerieBtn").onclick = () => {
            this.addSerie(document.getElementById('plotly_series_form').elements)
        }

        document.getElementById("Plotly_lineChart_style_showMarkers").onclick = () => {
            this.showMarkers()
        }

        document.getElementById("Plotly_lineChart_style_showLines").onclick = () => {
            this.showLines()
        }

        document.getElementById('Plotly_lineChart_style_selectedSerie').onchange = () => {
            this.attSeries()
        }
    }
    load(plot) {
        this.plot = plot;
        this.setData();
        document.getElementById("lineChart_subMenuBlock").style.display = "block"
    }
}