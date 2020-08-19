const fs = require('fs')

module.exports = class BlocksList{
    constructor(){
        this.blocks = [];
        this.categorys = []
    }
    blockHtmlComponent(block){
        let newBlockComponent = document.createElement("div");
        newBlockComponent.id = block.id;
        newBlockComponent.className = "col-4 p-1"
        newBlockComponent.style.height =  "120px";
        newBlockComponent.innerHTML = `<div style="background-color:blue" class="w-100 h-100">${block.category}</div>`
        return newBlockComponent;
    }
    openNewPlot(plotConfig){
        mainwindow.dispatchEvent("addNewBlock",plotConfig);
    }
    plotBtnHtmlComponent(){
        let newPlotBtnComponent = document.createElement("div");
        let onclickEvent = "mainwindow.popUpMenu.menus['BlocksList'].openNewPlot()";
        newPlotBtnComponent.id = "PlotBtnComponent";
        newPlotBtnComponent.className = "col-4 p-1"
        newPlotBtnComponent.style.height =  "120px";
        newPlotBtnComponent.innerHTML = `
        <div class="w-100 h-100">
            <input type="button" style="font-size:50px" onclick="${onclickEvent}" class="save_input_btn w-100 h-100" value=" + ">
        </div>`
        
        return newPlotBtnComponent;
    }
    categoryHtmlComponent(name){
        name = String(name);
        let nameRegex = name.replace(/ +/g, "_");
        let newComponent = document.createElement("div");
        newComponent.id = "BlocksListParent_"+nameRegex;
        newComponent.className = "row";
        newComponent.style.fontSize ="20px";
        newComponent.innerHTML =
        `   <div class="col-12">
                <label class="mb-1">${name}</label>
                <hr class="mt-0" />
                <div id="BlocksList_${nameRegex}" class="container row">

                </div>
            </div>
        `
        return newComponent;
    }
    onLoadFunction(){
        let blockList = document.getElementById("BlocksListContainer");
        blockList.innerHTML = "<hr/>";
        this.categorys = [];

        this.blocks = [{"category":2},{"category":2},{"category":2},{"category":1},{"category":2},{"category":3}]

        this.categorys.push("New Plot");
        blockList.appendChild(this.categoryHtmlComponent("New Plot"));
        document.getElementById("BlocksList_New_Plot").appendChild(this.plotBtnHtmlComponent());

        this.blocks.forEach(block => {
            if(this.categorys.includes(block.category)){
                document.getElementById("BlocksList_"+block.category).appendChild(this.blockHtmlComponent(block));
            }else{
                this.categorys.push(block.category);
                blockList.appendChild(this.categoryHtmlComponent(block.category));
                document.getElementById("BlocksList_"+block.category).appendChild(this.blockHtmlComponent(block));
            }
        });
        blockList.appendChild(document.createElement("hr"));
    }
    htmlBuilder(){
        return  `<div class="tabcontent"  id="BlocksList" >
                    <div id="BlocksListContainer" class ="container"></div>
                </div>`
    }
}