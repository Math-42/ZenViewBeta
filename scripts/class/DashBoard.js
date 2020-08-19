
const EditingMenu = require('./EditingMenu')
const Block = require('./Block')
const GridStack = require('gridstack/dist/gridstack.all')
const ElementResize = require('javascript-detect-element-resize');


module.exports = class DashBoard{

    constructor(name,qtdInputs,desc){
        this.name = name;
        this.qtdInputs = qtdInputs;
        this.desc = desc;
        this.inputs = {};
        this.blocks = []
        this.gridStack;
        this.activeContext;
        this.EditingMenu = new EditingMenu();
    }
    loadFromJson(dashBoardJson){
        this.name = dashBoardJson.name;
        this.qtdInputs = dashBoardJson.qtdInputs;
        this.desc = dashBoardJson.desc;
    }
    receiver(obj){
        thisDashBoard.addNewWidget(obj)
    }
    init(){
        this.gridStack = GridStack.init({
                        float: true,
                        column: 12,
                        animate: true,

                    });
        //this.EditingMenu.init()
    }
    clear(){
        this.gridStack.removeAll();
    }
    addNewWidget(newPlot){
        //newPlot = (newPlot === undefined)? new Block(): newPlot;
        //this.gridStack.addWidget('<div><div class="grid-stack-item-content">Item 1</div></div>', {width: 2})
        newPlot = new Block();
        console.log(newPlot)
        let id = this.blocks.length;
        newPlot.height = (newPlot.height === undefined)? 2: newPlot.height;
        newPlot.width = (newPlot.width === undefined)? 4: newPlot.width;
        let widget = {
            autoPosition: true,
            width: newPlot.width,
            height: newPlot.height
        };
        this.gridStack.addWidget(newPlot.plotHtmlComponent(id), widget);
        newPlot.setAutoResize();
    };
}