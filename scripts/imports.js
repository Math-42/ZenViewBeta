/**
 * Importa todos os menus popup e exporta em formato de lista, facilitando a uitlização no futuro
 */
const NewDashBoard = require('../interface/popupMenus/NewDashBoard')
const DashBoardsList = require('../interface/popupMenus/DashBoardsList')
const DashBoardsEdit = require('../interface/popupMenus/DashBoardsEdit')
const EditInputs = require('../interface/popupMenus/EditInputs')
const BlocksList = require('../interface/popupMenus/BlocksList')

let modules = {
    NewDashBoard,
    DashBoardsList,
    DashBoardsEdit,
    EditInputs,
    BlocksList
};

module.exports = modules