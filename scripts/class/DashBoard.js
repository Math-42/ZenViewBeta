const Block = require('./Block')
const GridStack = require('gridstack/dist/gridstack.all')
const ElementResize = require('javascript-detect-element-resize');


module.exports = class DashBoard {

    constructor(name, qtdInputs, desc) {
        this.name = name;
        this.qtdInputs = qtdInputs;
        this.desc = desc;
        this.inputs = {};
        this.blocks = []
        this.gridStack;
        this.activeContext;

    }
    loadFromJson(dashBoardJson) {
        this.name = dashBoardJson.name;
        this.qtdInputs = dashBoardJson.qtdInputs;
        this.desc = dashBoardJson.desc;
    }
    init() {
        this.gridStack = GridStack.init({
            float: true,
            column: 12,
            animate: true,

        });
    }
    clear() {
        this.gridStack.removeAll();
    }
    addNewWidget(newBlock) {
        newBlock = (newBlock === undefined)? new Block(this.blocks.length + 1,"Plotly"): newBlock;
        newBlock.height = (newBlock.height === undefined) ? 3 : newBlock.height;
        newBlock.width = (newBlock.width === undefined) ? 4 : newBlock.width;
        this.blocks.push(newBlock);
        let widget = {
            autoPosition: true,
            width: newBlock.width,
            height: newBlock.height
        };
        this.gridStack.addWidget(newBlock.plotHtmlComponent(), widget);
        newBlock.init();
    };
}