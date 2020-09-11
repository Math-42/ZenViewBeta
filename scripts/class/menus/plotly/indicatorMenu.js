const Plotly = require('plotly.js');
const MenuBuilder = require('../menuBuilder')

module.exports = class indicatorMenu {
    constructor() {
        this.plot
        this.isInitialized
    }
    getData() {

    }
    setData() {

    }
    setEvents() {

    }
    init() {
        if (!this.isInitialized) {
            let menuBlock = document.createElement('form');
            menuBlock.className = "subMenuBlock"
            menuBlock.id = "indicator_subMenuBlock"
            let jsonMenu = require('./setupFiles/indicatorSetup.json')
            jsonMenu.forEach(card => {
                menuBlock.appendChild(MenuBuilder.build(card, "Plotly_indicator"));
            });
            document.getElementById('Plotly_subOptions').appendChild(menuBlock);
            this.isInitialized = true;
            this.setEvents(document.querySelectorAll('[Plotly_indicator_validListener]'))
        }
    }
    load(plot) {
        this.plot = plot;
        this.setData();
    }
}