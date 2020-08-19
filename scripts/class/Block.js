module.exports =  class Block{
    constructor(plotLib){
        this.plotLib = plotLib;
        this.id;
        this.width = 4;
        this.height = 2;
        this.inputs = [];
    }
    openPlotEditingMenu(){
        console.log("menu de edição de plots aberto");
        if(document.getElementById("editing_menu").style.display ==="block"){
            document.getElementById("editing_menu").style.display = "none";
            document.getElementById("main").style.marginRight = "0px";
            
        }else{
            document.getElementById("editing_menu").style.display = "block";
            document.getElementById("editing_menu").style.width = "22%";
            document.getElementById("main").style.marginRight = "22%";
        }
    }
    plotlyHtmlComponent(id){
        id = (id === undefined)? this.id+"_plot": id;
        let plotPlotly = document.createElement('div');
        plotPlotly.id = id;
        plotPlotly.className = "grid-stack-item-content";
        plotPlotly.style.backgroundColor = "white";
        return plotPlotly;
    }
    packageSelector(id){
        let newPlot;
        if(this.plotLib === "Plotly"){
            newPlot = this.plotlyHtmlComponent(id);
        }else{
            newPlot = document.createElement('div');
            newPlot.id = id;
            newPlot.className = "grid-stack-item-content";
            newPlot.style.backgroundColor = "whitesmoke";
        }
        newPlot.ondblclick = ()=>{this.openPlotEditingMenu()};
        return newPlot;
    }
    setAutoResize(){
        if(this.plotLib === "Plotly"){
            let chart = document.getElementById(plot.id);
            addResizeListener(chart,()=>{
                Plotly.relayout(chart.id+"_plot", {
                    'xaxis.autorange': true,
                    'yaxis.autorange': true
                });
            })
        }
    }
    plotHtmlComponent(id){
        id = (id === undefined)? this.id: id;
        let newWidget = document.createElement("div");
        newWidget.id = id;
        newWidget.className = "grid-stack-item";
        newWidget.appendChild(this.packageSelector(id));
        return newWidget;
    }
}