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
    constructor(){
        this.name = undefined;
        this.operation = undefined;
    }
    getValue(){
        if(this.operation !== undefined){
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