const Block = require('./Block')
const GridStack = require('gridstack/dist/gridstack.all')
const ElementResize = require('javascript-detect-element-resize');
const Input = require('./Input');


module.exports = class DashBoard {

    constructor(name, qtdInputs, desc) {
        this.name = name;
        this.qtdInputs = qtdInputs;
        this.desc = desc;
        this.inputs = {};
        this.blocks = []
        this.editing = true;
        this.gridStack;
        this.activeContext;
        this.ids = 1;

    }
    loadFromJson(dashBoardJson) {
        this.name = dashBoardJson.name;
        this.qtdInputs = dashBoardJson.qtdInputs;
        this.desc = dashBoardJson.desc;
        this.desc = dashBoardJson.desc;

        let tempBlocks = dashBoardJson.blocks;

        tempBlocks.forEach(block => {
            let tempBlock = new Block(this.ids++, block.plotLib)
            tempBlock.loadFromJson(block)
            this.blocks.push(tempBlock);
        });

        let inputs = [];

        dashBoardJson.inputs.forEach(input => {
            inputs.push(new Input(input.name, input.operation));
        });

        this.inputs = inputs
    }
    init() {

        this.gridStack = GridStack.init({
            float: true,
            column: 12,
            animate: true

        });

        if (this.editing) {
            this.gridStack.enable('.grid-stack-item', true);
        } else {
            this.gridStack.disable('.grid-stack-item', false);
        }

        this.clear();

        this.blocks.forEach(block => {
            this.gridStack.addWidget(block.plotHtmlComponent(), block);
            block.load(this.editing);
        })
    }
    clear() {
        this.gridStack.removeAll();
    }
    removeWidget(block) {
        let widget = document.getElementById(block.id);
        this.gridStack.removeWidget(widget)
        for (let i = 0; i <= this.blocks.length; i++) {
            if (block === this.blocks[i]) {
                this.blocks.splice(i, 1);
                break;
            }
        }
    }
    addNewWidget(newBlock) {
        newBlock = (newBlock === undefined) ? new Block(this.ids++, {
            main: "Plotly",
            sub: "lineChart"
        }) : newBlock;
        newBlock.height = (newBlock.height === undefined) ? 3 : newBlock.height;
        newBlock.width = (newBlock.width === undefined) ? 4 : newBlock.width;
        this.blocks.push(newBlock);
        this.gridStack.addWidget(newBlock.plotHtmlComponent(), newBlock);

        newBlock.init(this.editing);
    };
}