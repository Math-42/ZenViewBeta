const fs = require('fs')

module.exports = class DashBoardsEdit{
    constructor(){
        this.dashBoards = [];
    }
    onLoadFunction(){
        this.dashBoards = fs.readdirSync('dashBoards');
        this.postList(this.dashBoards)
    }
    filter(){
        this.dashBoards = fs.readdirSync('dashBoards');
        let dashBoardsEditList = []
        let string = document.getElementById("DashBoardsEditSearchBar").value
        for(let i =0;i<this.dashBoards.length;i++){
            if(this.dashBoards[i].includes(string)){
                dashBoardsEditList.push(this.dashBoards[i]);
            }
        }
        this.postList(dashBoardsEditList)
    }
    openNewDashBoard(dashBoardName){
        mainwindow.dispatchEvent('LoadNewTab',{'name':dashBoardName,'context': 'edit_show'})
        document.getElementById("DashBoardsEditSearchBar").value = ""
        mainwindow.dispatchEvent('ClosePopupMenu');
    }
    postList(dashBoardsEditList){
        let htmlList = ""
        for(let i=0;i<dashBoardsEditList.length;i++){
            htmlList +=`<button 
                        onclick="mainwindow.popUpMenu.menus['DashBoardsEdit'].openNewDashBoard('${dashBoardsEditList[i]}')">
                        ${dashBoardsEditList[i]}
                        </button>`
        }
        document.getElementById("SavedDashBoardsEditList").innerHTML = htmlList
    }
    htmlBuilder(){
    return  `<div class="tabcontent" id="DashBoardsEdit">
                <input type="text" id="DashBoardsEditSearchBar" onkeyup="mainwindow.popUpMenu.menus['DashBoardsEdit'].filter()" placeholder="Search by name">
                <div id="SavedDashBoardsEditList">
                </div>
            </div>`
    }
}