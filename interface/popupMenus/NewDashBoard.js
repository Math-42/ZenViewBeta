
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