module.exports = class PlotlyEditingMenu {
    constructor() {
        this.plot
        this.colors = ["#ff0000", "#0000ff", "#ffa500", "#800080", "#008000", "#4b0082"]
        this.colorCount = 0;
    }
    load(plot) {
        console.log("menu plotly aberto")
        document.getElementById("editing_menu_plotly").style.display = "block";
        this.plot = plot;
        this.setGeral();
        this.setSeries();
        this.setStyle();
        this.setAxes();
    }
    setGeral() {
        let data = this.plot.getData();
        document.getElementById("Plotly_title").value = data.title;
        let formatOption = document.getElementById("Plotly_format");

        for (let i = 0; i < formatOption.options.length; i++) {
            if (formatOption.options[i].value == data.format) {
                formatOption.options[i].selected = true;
                break;
            }
        }

        let typeOption = document.getElementById("Plotly_mode");

        for (let i = 0; i < typeOption.options.length; i++) {
            if (typeOption.options[i].value == data.format) {
                typeOption.options[i].selected = true;
                break;
            }
        }
        document.getElementById("Plotly_showLegend").checked = (data.showlegend === true) ? true : false;
    }
    setSeries() {
        let inputs = mainwindow.currentDashBoard.inputs;
        let x = document.getElementById('x_plotly_inputs')
        let y = document.getElementById('y_plotly_inputs')

        x.innerHTML = ""
        y.innerHTML = ""

        let option1;
        let option2;
        inputs.forEach(input => {
            option1 = document.createElement('option');
            option1.innerHTML = input.name;
            option2 = document.createElement('option');
            option2.innerHTML = input.name;
            y.appendChild(option1);
            x.appendChild(option2);
        });
    }
    setStyle() {
        let traces = this.plot.data;
        let options = document.getElementById('Plotly_SelectedTrace')
        let seriesList = document.getElementById('Plotly_seriesList')
        seriesList.innerHTML = ""
        options.innerHTML = ""
        let option;
        let newSerie
        traces.forEach(trace => {
            option = document.createElement('option');
            option.innerHTML = trace.name;
            options.appendChild(option);
            newSerie = document.createElement('div');
            newSerie.className = " input-group mb-1";
            newSerie.id = `Plotly_serie_${trace.name}`
            newSerie.innerHTML = `  <input type="text" class="form-control" placeholder="${trace.name}" readonly>
                                <div class="input-group-append">
                                    <button id="Plotly_rmv_${trace.name}" class="btn btn-secondary"
                                        type="button">&times;</button>
                                </div>`
            seriesList.appendChild(newSerie);

            document.getElementById(`Plotly_rmv_${trace.name}`).onclick = () => {
                document.getElementById(`Plotly_serie_${trace.name}`).remove();
                this.plot.removeSerie(`${trace.name}`);
            }
        });
    }
    attTraceStyle(traceName) {
        if (traceName === undefined || traceName === "") {
            return 0;
        }
        let traces = this.plot.data;
        let currentTrace;
        for (let i = 0; i < traces.length; i++) {
            if (traces[i].name === traceName) {
                currentTrace = traces[i];
            }
        }

        let markerWidthOption = document.getElementById("Plotly_markerWidth");

        for (let i = 0; i < markerWidthOption.options.length; i++) {
            if (markerWidthOption.options[i].value == currentTrace.marker.size) {
                markerWidthOption.options[i].selected = true;
                break;
            }
        }

        let lineWidthOption = document.getElementById("Plotly_lineWidth");

        for (let i = 0; i < lineWidthOption.options.length; i++) {
            if (lineWidthOption.options[i].value == currentTrace.line.width) {
                lineWidthOption.options[i].selected = true;
                break;
            }
        }
        document.getElementById("Plotly_lineColor").value = currentTrace.line.color;
        document.getElementById("Plotly_markerColor").value = currentTrace.marker.color;

        let dashWidthOption = document.getElementById("Plotly_dash");

        for (let i = 0; i < dashWidthOption.options.length; i++) {
            if (dashWidthOption.options[i].value == currentTrace.line.dash) {
                dashWidthOption.options[i].selected = true;
                break;
            }
        }

        let interpolationOption = document.getElementById("Plotly_interpolation");

        for (let i = 0; i < interpolationOption.options.length; i++) {
            if (interpolationOption.options[i].value == currentTrace.line.shape) {
                interpolationOption.options[i].selected = true;
                break;
            }
        }
    }
    setAxes() {
        let data = this.plot.getData();
        document.getElementById("Plotly_xaxis_title").value = data.xaxis.title
        document.getElementById("Plotly_yaxis_title").value = data.yaxis.title
    }
    getData(data) {
        let formData = {};
        for (let i = 0; i < data.length; i++) {
            let e = data[i];
            formData[String(e.id).replace("Plotly_", "")] = e.value;
        }
        return formData;
    }
    attGeral(data) {
        let formData = this.getData(data);
        console.log(formData)
        let showLegend = document.getElementById('Plotly_showLegend').checked
        let plotLayout = {
            title: formData.title,
            showlegend: showLegend,
        }
        let plotConfig = {
            format: formData.format,
        }
        this.plot.attLayout(plotLayout);
        this.plot.attConfig(plotConfig);
    }
    attSeries(data) {
        let formData = this.getData(data);

        if (formData.name_trace === undefined || formData.name_trace === "") {
            return;
        }

        for (let i = 0; i < this.plot.data.length; i++) {
            if (this.plot.data[i].name === formData.name_trace) {
                return;
            }
        };

        let newcolor = String([this.colors[this.colorCount]])
        this.plot.addSerie({
            name: formData.name_trace,
            x: formData.x,
            y: formData.y,
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
        })

        this.colorCount = (this.colorCount + 1) % 6;
        console.log("novo valor" + this.colorCount);
        let newOption = document.createElement('option');
        newOption.innerHTML = formData.name_trace;
        newOption.value = formData.name_trace;
        document.getElementById('Plotly_SelectedTrace').appendChild(newOption);
        document.getElementById('Plotly_name_trace').value = "";
        let newSerie = document.createElement('div');
        newSerie.className = " input-group mb-1";
        newSerie.id = `Plotly_serie_${formData.name_trace}`
        newSerie.innerHTML = `  <input type="text" class="form-control" placeholder="${formData.name_trace}" readonly>
                                <div class="input-group-append">
                                    <button id="Plotly_rmv_${formData.name_trace}" class="btn btn-secondary"
                                        type="button">&times;</button>
                                </div>`
        document.getElementById('Plotly_seriesList').appendChild(newSerie);

        document.getElementById(`Plotly_rmv_${formData.name_trace}`).onclick = () => {
            console.log("Série removida")
            document.getElementById(`Plotly_serie_${formData.name_trace}`).remove();
            this.plot.removeSerie(`${formData.name_trace}`);
        }

    }
    attStyle(data) {
        let formData = this.getData(data);
        let name = document.getElementById('Plotly_SelectedTrace').value;
        if (!(name === "" || name === undefined)) {
            let plotData = {
                name: name,
                line: {
                    color: formData.lineColor,
                    width: formData.lineWidth,
                    shape: formData.interpolation,
                    dash: formData.dash
                },
                marker: {
                    color: formData.markerColor,
                    size: formData.markerWidth
                }

            }
            this.plot.attData(plotData);
        }
    }
    attAxes(data) {
        let formData = this.getData(data);

        let plotLayout = {
            xaxis: {
                title: formData.xaxis_title
            },
            yaxis: {
                title: formData.yaxis_title
            }
        }

        this.plot.attLayout(plotLayout);
    }
    init() {
        document.getElementById("plotly_geral_form").addEventListener("input", () => {
            console.log("formulario geral foi alterado")
            this.attGeral(document.getElementById('plotly_geral_form').elements)
        });
        document.getElementById("Plotly_addNewSerieBtn").onclick = () => {
            console.log("formulario das séries foi alterado")
            this.attSeries(document.getElementById('plotly_series_form').elements)
        }
        document.getElementById("plotly_style_form").addEventListener("input", () => {
            console.log("formulario do estilo foi alterado")
            this.attStyle(document.getElementById('plotly_style_form').elements)
        });
        document.getElementById("plotly_axes_form").addEventListener("input", () => {
            console.log("formulario dos eixos foi alterado")
            this.attAxes(document.getElementById('plotly_axes_form').elements)
        });
        document.getElementById("Plotly_SelectedTrace").onchange = () => {
            console.log("Nova série selecionada")
            this.attTraceStyle(document.getElementById("Plotly_SelectedTrace").value);
        }
        document.getElementById("style_option").onclick = () => {
            console.log("formulario do estilo foi alterado")
            this.setStyle()
            this.attTraceStyle(document.getElementById("Plotly_SelectedTrace").value);
        }
    }
}