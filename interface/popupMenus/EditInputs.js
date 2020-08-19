const fs = require('fs')
const classes = require('../../scripts/classes')
const dashBoard = classes.dashBoard
const Input = classes.Input

module.exports = class EditInputs{
    constructor(){
        this.dashBoard;
        this.inputListElement;
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
        this.inputListElement.appendChild(newInput.inputHtml());
        this.dashBoard.inputs.push(newInput);
        this.addNewInputOption();
    }
    onLoadFunction(){
        this.inputListElement = document.getElementById("inputList");

        this.inputListElement.innerHTML = "<hr>";

        this.dashBoard = mainwindow.currentDashBoard;

        this.dashBoard.inputs.forEach(input => {
             this.inputListElement.appendChild(input.inputHtml());
        });

        this.addNewInputOption();
    }
    saveInput(id){
        let idx = 0;
        let inputName = document.getElementById(`input_name_${id}`).value;
        let inputReturn = document.getElementById(`input_new_return_${id}`).value;
        let nameAlreadyExists = false;
        for(let i=0;i <this.dashBoard.inputs.length;i++){
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

            inputList.insertBefore(newInput.inputHtml(),document.getElementById(`input_row_${id}`));
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