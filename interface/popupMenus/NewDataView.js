
const fs = require('fs')
const classes = require('../../scripts/classes')
const dataView = classes.dataView
const Input = classes.Input

module.exports = class NewDataView{
    constructor(){
        this.dataViews = [];
        this.name
        this.inputs
        this.description
    }
    newHTML(){
        return `<!DOCTYPE html>
            <html>
                <head>
                    <script language="JavaScript" src="../../scripts/draggable.js"></script>
                    <script src='../../scripts/plotly.js'></script>
                    <script src='../../node_modules/javascript-detect-element-resize/detect-element-resize.js'></script>
                    <style>
                        body,html{
                            padding: 0px;
                            margin: 0px;
                        }
                        .data_block {
                            position: absolute;
                            z-index: 9;
                            background-color: #f1f1f1;
                            text-align: center;
                            border: 1px solid #d3d3d3;
                        }
                        .data_block_header {
                            text-align: left;
                            padding: 0px;
                            margin: 0px;
                            height: 20px;
                            cursor: move;
                            z-index: 10;
                            background-color: #2c2e38;
                            color: #fff;
                        }
                        .resizable {
                            resize: both;
                            overflow:hidden;
                            border: 1px solid black;
                            padding: 0px;
                            margin: 0px;
                        }
                        .cls_blk{
                            font-size: 22px;
                            color: lightgray;
                            margin-top: -2px;
                            margin-bottom: 0px;
                            float: right;
                            cursor: pointer;
                        }
                    </style>
                </head>
                <body id="teste1">
                    <div class="draggable resizable data_block" id="mydiv">
                    <div  class="data_block_header" id="mydiv_header">STATIC
                        <a onclick="document.getElementById('mydiv').remove()" class="cls_blk">&times;</a>
                    </div>
                    <div id='mydiv_plot' style="width: 100%;height: 100%;"></div>
                    </div>
                    <div class="draggable resizable data_block" id="div">
                        <div  class="data_block_header" id="div_header">STATIC
                    <a onclick="document.getElementById('div').remove()" class="cls_blk">&times;</a>
                    </div>
                        <div id='div_plot' style="width: 100%;height: 100%;"></div>
                    </div>
                    <div id="teste2"></div>
                    <script src='../../scripts/block.js'></script>
                </body>
            </html>`
    }
    onLoadFunction(){
        this.name = document.getElementById("view_name");
        this.inputs = document.getElementById("view_inputs");
        this.description = document.getElementById("view_description");
        this.name.value = "";
        this.inputs.value = "";
        this.description.value = "";
    }
    createNewDataview(){
        if(this.name.value === ""){
            alert("Invalid name!");
            return;
        }
        if(this.inputs.value === "" || this.inputs.value < 1){
            alert("Must have at least one input!");
            return;
        }
        let dataViewA = new dataView(name.value,this.inputs.value,this.description.value);
        this.dataViews = fs.readdirSync('dataViews');
        if(!this.dataViews.includes(this.name.value)){
            dataViewA.inputs = [];
            for(let i = 0; i < parseInt(this.inputs.value);i++){
                let newInput = new Input();
                newInput.name = "input_"+i;
                newInput.operation = "column_"+i;
                dataViewA.inputs.push(newInput);
            }
            fs.mkdirSync(`dataViews/${this.name.value}`);
            fs.writeFileSync(`dataViews/${this.name.value}/${this.name.value}.json`,JSON.stringify(dataViewA,null,"\t"));
            fs.writeFileSync(`dataViews/${this.name.value}/${this.name.value}.html`,this.newHTML(this.name.value));
            mainwindow.dispatchEvent('LoadNewTab',{"name":this.name.value,"context": "edit_show"});
            this.name.value = "";
            this.inputs.value = "";
            this.description.value = "";
            mainwindow.dispatchEvent('ClosePopupMenu');
        }else{
            alert("This name already exists!");
            return;
        }
    }
    htmlBuilder(){
        return `<div class="tabcontent" id="NewDataView">
                    <form id="init_view_form">
                        <label style="text-align: left;">Name:</label>
                        <input type="text" id="view_name">
                        <label style="text-align: left;">Inputs:</label>
                        <input type="number" id="view_inputs" min="1">
                        <label style="text-align: left;">Description:</label>
                        <textarea id="view_description"></textarea>
                        <input type="button" value="Create" onclick="mainwindow.popUpMenu.menus['NewDataView'].createNewDataview()">
                    </form>
                </div>`
    }
}