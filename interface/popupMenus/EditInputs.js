const fs = require('fs')
const classes = require('../../scripts/classes')
const dataView = classes.dataView
const Input = classes.Input

module.exports = class EditInputs{
    constructor(){
        this.inputs = [];
    }
    onLoadFunction(){
        this.inputs = mainwindow.tabs.tabGroup.getActiveTab().descObj.inputs;
        let htmlList = '<hr><div class="container">';
        this.inputs.forEach(input => {
            htmlList += `<div class="row" id="input_row_${input.name}">
                                <div class="col-12">
                                    <label>Input Name:</label>
                                    <input type="text" value="${input.name}" id="input_name_${input.name}">
                                    <label>Return Value:</label>
                                    <input type="text" value=${input.operation} id="input_new_return_${input.name}">
                                    <input id="save_input_btn_${input.name}" onclick="saveInput('${input.name}')" class ="save_btn" type="button" value="Save">
                                    <input id="delete_input_btn_${input.name}" onclick="deleteInput('${input.name}')" class ="delete_btn" type="button" value="Delete">
                                </div>
                            </div><hr></hr>`;
        });
        htmlList += "</div>"
        document.getElementById("inputList").innerHTML = htmlList;
    }
    htmlBuilder(){
        return  `<div class="tabcontent" id="EditInputs">
                    <input type="text" id="editInputsSearchBar" onkeyup="mainwindow.popUpMenu.menus['EditInputs']" placeholder="Search by name">
                    <div  id="inputList">
                    </div>
                </div>`
    }
}