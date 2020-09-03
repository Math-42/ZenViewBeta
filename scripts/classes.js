/**
 * Lista e importa todas as classes utilitárias do programa, e as lista facilitando a utilização no futuro
 */
const DashBoard = require("../scripts/class/DashBoard");
const Input = require("../scripts/class/Input");
const Block = require("../scripts/class/Block");
const EditingMenu = require("../scripts/class/EditingMenu");


let classes = {
    DashBoard,
    Input,
    Block,
    EditingMenu
};

module.exports = classes;