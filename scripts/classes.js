class dataView{
    constructor(name,qtdInputs,desc){
        this.name = name;
        this.qtdInputs = qtdInputs;
        this.desc = desc;
        this.inputs = {};
        this.blocks = []
    }  
}

class Input{
    constructor(name,operation){
        this.name = name;
        this.operation = (operation === undefined)? "": operation;
    }
    getValue(){
        if(this.operation !== ""){
            try{
                return eval(this.operation)
            }catch(ERROR){
                return undefined;
            }
        }
    }
}



let exportClasses = {dataView,Input}

module.exports = exportClasses