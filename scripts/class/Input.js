module.exports = class Input{
    constructor(name,operation){
        this.name = name;
        this.operation = (operation === undefined)? "": operation;
    }
    getValue(){
        if(this.operation !== ""){
            try{
                return eval(this.operation);
            }catch(ERROR){
                return undefined;
            }
        }
    }
    inputHtml(){
        let inputElement = document.createElement("div");
        inputElement.id= `input_row_${this.name}`;
        let saveOption = (id) =>{return  `mainwindow.popUpMenu.menus['EditInputs'].saveInput('${id}')`;};
        let delOption = (id)=>{return `mainwindow.popUpMenu.menus['EditInputs'].deleteInput('${id}')`;};
        inputElement.innerHTML = `<div class="row">
                    <div class="col container" >
                        <div class="row w-100 justify-content-between">
                                <label class="col-2 h5" >Name:</label>
                                <div class="col-10 ml-0 pl-0 justify-content-between">
                                    <input class="w-75" type="text" value="${this.name}" id="input_name_${this.name}">
                                    <input id="save_input_btn_${this.name}" onclick="${saveOption(this.name)}" class ="save_input_btn" type="button" value="Save">
                                    <input id="delete_input_btn_${this.name}" onclick="${delOption(this.name)}" class ="delete_input_btn" type="button" value="Delete">
                                </div>
                        </div>
                        <div class="row w-100 pt-2 justify-content-between">
                                <label class="col-2 h5" >Return:</label>
                                <input class="col-10 p-0" type="text" value="${this.operation}" id="input_new_return_${this.name}">
                        </div>
                    </div>
                </div><hr class="w-100" >`;
        return inputElement;
    }
};