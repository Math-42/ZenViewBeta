const MenuBuilder = require('./menuBuilder')
const LineChartMenu = require('./plotly/lineChartMenu')
module.exports = class PlotlyEditingMenu {
    constructor() {
        this.plot
        this.colors = ["#ff0000", "#0000ff", "#ffa500", "#800080", "#008000", "#4b0082"]
        this.colorCount = 0;
        this.lineChartMenu = new LineChartMenu;
        this.indicatorChartOptions;
        this.tridChartOptions;
        this.tableChartOptions;
        this.currentMenu;
    }
    menuSetup() {
        return {
            "name": "menu_config_plot",
            "title": "Configurações do pacote",
            "id": `Plotly`,
            "fields": [
                {
                    "type": "selectInput",
                    "title": "Tipo de plot:",
                    "id": `tipoDePlot`,
                    "options":[
                        {
                            "text":"Linhas",
                            "value": 1
                        },
                        {
                            "text":"Tabela",
                            "value": 2
                        },
                        {
                            "text":"Indicador",
                            "value": 3
                        },
                        {
                            "text":"3D",
                            "value": 3
                        }
                    ]
                },
                {
                    "type": "selectInput",
                    "title": "Formato de exportação:",
                    "id": `export`,
                    "options":[
                        {
                            "text":"Png",
                            "value": "png"
                        },
                        {
                            "text":"Svg",
                            "value": "svg"
                        },
                        {
                            "text":"Jpeg",
                            "value": "jpeg"
                        },
                        {
                            "text":"Webp",
                            "value": "webp"
                        }
                    ]
                }
            ]
        }
    }
    load(plot) {
        console.log("menu plotly aberto")
        document.getElementById("editing_menu_plotly").style.display = "block";
        document.getElementById("subOptions_menu").style.display = "block";

        this.plot = plot;
        console.log(this.plot)
        console.log("carregando menu de plot 2d")
        this.loadMenu(this.plot.type)
    }
    loadMenu(selection){
        console.log(selection)
        if(selection == 1){
            this.currentMenu = this.lineChartMenu
            this.currentMenu.init()
            this.currentMenu.load(this.plot)
        }
    }
    init() {
        let menuBlock = document.createElement('div');
        menuBlock.className = "menuBlock"

        let optionMenu = document.getElementById("subOptions_menu");
        
        let aba = MenuBuilder.build(this.menuSetup());
        menuBlock.appendChild(aba);

        let subMenuOptions = document.createElement('div');
        subMenuOptions.id ="Plotly_subOptions"

        menuBlock.appendChild(subMenuOptions);

        optionMenu.appendChild(menuBlock)

        document.getElementById('Plotly_tipoDePlot').onchange = () => {
            let selection = document.getElementById("Plotly_tipoDePlot").value
            console.log("Opção selcionada: " + selection)
            this.loadMenu(selection);
        }
    }
}