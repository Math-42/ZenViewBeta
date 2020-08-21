
const fs = require('fs')
const classes = require('../../scripts/classes')
const DashBoard = classes.DashBoard
const Input = classes.Input

module.exports = class NewDashBoard{
    constructor(){
        this.dashBoards = [];
        this.name
        this.inputs
        this.description
    }
    newHTML(){
        return `<!DOCTYPE html>
            <html>
                <head>
                    <link rel="stylesheet" type="text/css" href="../../node_modules/bootstrap/dist/css/bootstrap.css" />
                    <link rel="stylesheet" href="../../node_modules/gridstack/dist/gridstack.min.css" />
                    <script type="text/javascript" charset="utf-8" src="../../node_modules/plotly.js/dist/plotly.js"></script>
                    <script language="JavaScript" charset="utf-8" src="../../scripts/dashBoard.js"></script>
                    <script src="../../node_modules/gridstack/dist/gridstack.all.js"></script>
                    <script src='../../node_modules/javascript-detect-element-resize/detect-element-resize.js'></script>
                    <style>
                        body,html{
                            padding: 0px;
                            margin: 0px;
                            width: 100%;
                            height: 100%;
                        }
                        #editing_menu {
                            height: 100%;
                            width: 22%;
                            z-index: 1;
                            position: fixed;
                            top: 0;
                            right: 0;
                            background-color: #1c1e23;
                            overflow-x: hidden;
                            padding-top: 60px;
                            transition: 0.1s;
                            display: none;
                        }
                        ::-webkit-scrollbar {
                        width: 7px;
                        }

                        /* Track */
                        ::-webkit-scrollbar-track {
                        background: #f1f1f1; 
                        }
                        
                        /* Handle */
                        ::-webkit-scrollbar-thumb {
                        background: #888; 
                        }

                        /* Handle on hover */
                        ::-webkit-scrollbar-thumb:hover {
                        background: #555; 
                        }
                    </style>
                </head>
                <body>
                    <div class="grid-stack h-100" id="main">
                        
                    </div>
                    <div class="h-100" id="editing_menu">
                    </div>

                    <script type="text/javascript">
                        let thisDashBoard = new DashBoard();

                        thisDashBoard.init()
                    </script>
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
    createNewDashBoard(){
        if(this.name.value === ""){
            alert("Invalid name!");
            return;
        }
        if(this.inputs.value === "" || this.inputs.value < 1 || this.inputs.value > 30){
            alert("The number of inputs must be between 1 and 30");
            return;
        }
        let dashBoardA = new DashBoard(this.name.value,parseInt(this.inputs.value),this.description.value);
        this.dashBoards = fs.readdirSync('dashBoards');
        if(!this.dashBoards.includes(this.name.value)){
            dashBoardA.inputs = [];
            for(let i = 0; i < parseInt(this.inputs.value);i++){
                let newInput = new Input();
                newInput.name = "input_"+i;
                newInput.operation = "col"+i;
                dashBoardA.inputs.push(newInput);
            }
            console.log(dashBoardA);
            fs.mkdirSync(`dashBoards/${this.name.value}`);
            fs.writeFileSync(`dashBoards/${this.name.value}/${this.name.value}.json`,JSON.stringify(dashBoardA,null,"\t"));
            fs.writeFileSync(`dashBoards/${this.name.value}/${this.name.value}.html`,this.newHTML(this.name.value));
            mainwindow.dispatchEvent('LoadNewDashBoard',{"name":this.name.value,"context": "edit_show"});
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
        return `<div class="tabcontent" id="NewDashBoard">
                    <form id="init_view_form">
                        <label style="text-align: left;">Name:</label>
                        <input type="text" id="view_name">
                        <label style="text-align: left;">Inputs:</label>
                        <input type="number" id="view_inputs" min="1">
                        <label style="text-align: left;">Description:</label>
                        <textarea id="view_description"></textarea>
                        <input type="button" value="Create" onclick="mainwindow.popUpMenu.menus['NewDashBoard'].createNewDashBoard()">
                    </form>
                </div>`
    }
}