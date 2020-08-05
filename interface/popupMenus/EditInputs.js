const fs = require('fs')
const classes = require('../../scripts/classes')
const dataView = classes.dataView
const Input = classes.Input

module.exports = class EditInputs{
    constructor(){
        this.dashBoard;
        this.inputListElement;
    }
    inputHtml(input){
        let newInput = document.createElement("div");
        newInput.id= `input_row_${input.name}`
        let saveOption = (id) =>{return  `mainwindow.popUpMenu.menus['EditInputs'].saveInput('${id}')`}
        let delOption = (id)=>{return `mainwindow.popUpMenu.menus['EditInputs'].deleteInput('${id}')`}
        newInput.innerHTML = `<div class="row">
                    <div class="col container" >
                        <div class="row w-100 justify-content-between">
                                <label class="col-2 h5" >Name:</label>
                                <div class="col-10 ml-0 pl-0 justify-content-between">
                                    <input class="w-75" type="text" value="${input.name}" id="input_name_${input.name}">
                                    <input id="save_input_btn_${input.name}" onclick="${saveOption(input.name)}" class ="save_input_btn" type="button" value="Save">
                                    <input id="delete_input_btn_${input.name}" onclick="${delOption(input.name)}" class ="delete_input_btn" type="button" value="Delete">
                                </div>
                        </div>
                        <div class="row w-100 pt-2 justify-content-between">
                                <label class="col-2 h5" >Return:</label>
                                <input class="col-10 p-0" type="text" value="${input.operation}" id="input_new_return_${input.name}">
                        </div>
                    </div>
                </div><hr class="w-100" >`;
        return newInput;
    }
    addNewInputOption(){
        if(this.dashBoard.qtdInputs >= 50){return;}
        let newInputOption = document.createElement("div");
        let option = "mainwindow.popUpMenu.menus['EditInputs'].newInput()"
        newInputOption.className = "row mb-2"
        newInputOption.id = "new_input_option";
        newInputOption.innerHTML = `<div class="container">
                                        <div class="row w-100 justify-content-between">   
                                            <label class="col-8 h5" >New Input:</label>
                                            <input type="button" class="save_input_btn" value=" + " onclick="${option}">
                                        </div>
                                    <div>`;
        this.inputListElement.appendChild(newInputOption);       
    }
    isValidName(name){
        for(let i=0;i <this.dashBoard.inputs.length;i++){
            if(this.dashBoard.inputs[i].name === name){
                return false;
            }
        }
        return true;
    }
    newInput(){
        let elem = document.getElementById("new_input_option");
        elem.parentNode.removeChild(elem);
        this.dashBoard.qtdInputs++;
        let cont = 0;
        let name = `NewInput_`
        while(!this.isValidName(name + cont)){
            cont ++;
        }
        let newInput = new Input(name+cont);
        this.inputListElement.appendChild(this.inputHtml(newInput));
        this.dashBoard.inputs.push(newInput);
        this.addNewInputOption();
    }
    onLoadFunction(){
        this.inputListElement = document.getElementById("inputList");

        this.inputListElement.innerHTML = "<hr>";

        this.dashBoard = mainwindow.tabs.tabGroup.getActiveTab().dashBoard;

        this.dashBoard.inputs.forEach(input => {
             this.inputListElement.appendChild(this.inputHtml(input));
        });

        this.addNewInputOption();
    }
    saveInput(id){
        let idx = 0;
        let inputName = document.getElementById(`input_name_${id}`).value;
        let inputReturn = document.getElementById(`input_new_return_${id}`).value;
        let nameAlreadyExists = false;
        for(let i=0;i <this.dashBoard.inputs.length;i++){
            console.log(this.dashBoard.inputs[i].name, inputName,  id)
            if(this.dashBoard.inputs[i].name === inputName && id !== inputName){
                nameAlreadyExists = true;
                break;
            }else if(this.dashBoard.inputs[i].name === id){
                idx = i;
            }
        }
        if(!nameAlreadyExists){
            let newInput = this.dashBoard.inputs[idx];

            this.dashBoard.inputs[idx].name = inputName;
            this.dashBoard.inputs[idx].operation = inputReturn;

            inputList.insertBefore(this.inputHtml(newInput),document.getElementById(`input_row_${id}`));
            inputList.removeChild(document.getElementById(`input_row_${id}`));

        }else{
            alert("This name already exists!");
        }
    }
    deleteInput(id){
        if(this.dashBoard.qtdInputs>1){
            this.dashBoard.qtdInputs --;
            for(let i=0; i < this.dashBoard.inputs.length;i++){
                if(this.dashBoard.inputs[i].name === id){ 
                    this.dashBoard.inputs.splice(i, 1);
                    break;
                }
            }
        inputList.removeChild(document.getElementById(`input_row_${id}`));
        }else{
            alert("Must have at least 1 input!");
        }
    }
    htmlBuilder(){
        return  `<div class="tabcontent" id="EditInputs">
                    <div  id="inputList" class="container">
                    </div>
                </div>`
    }
}