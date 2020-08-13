const fs = require('fs')

module.exports = class DashBoardsList{
    constructor(){
        this.dashBoards = [];
    }
    onLoadFunction(){
        this.dashBoards = fs.readdirSync('dashBoards');
        this.postList(this.dashBoards)
    }
    filter(){
        this.dashBoards = fs.readdirSync('dashBoards');
        let dashBoardsList = []
        let string = document.getElementById("dashBoardsSearchBar").value
        for(let i =0;i<this.dashBoards.length;i++){
            if(this.dashBoards[i].includes(string)){
                dashBoardsList.push(this.dashBoards[i]);
            }
        }
        this.postList(dashBoardsList)
    }
    openNewDashBoard(dashBoardName){
        mainwindow.dispatchEvent('LoadNewTab',{'name':dashBoardName,'context': 'start_show'})
        document.getElementById("dashBoardsSearchBar").value = ""
        mainwindow.dispatchEvent('ClosePopupMenu');
    }
    postList(dashBoardsList){
        let htmlList = ""
        for(let i=0;i<dashBoardsList.length;i++){
            htmlList +=`<button 
                        onclick="mainwindow.popUpMenu.menus['DashBoardsList'].openNewDashBoard('${dashBoardsList[i]}')">
                        ${dashBoardsList[i]}
                        </button>`
        }
        document.getElementById("SavedDashBoardsList").innerHTML = htmlList
    }
    htmlBuilder(){
    return  `<div class="tabcontent" id="DashBoardsList">
                <input type="text" id="dashBoardsSearchBar" onkeyup="mainwindow.popUpMenu.menus['DashBoardsList'].filter()" placeholder="Search by name">
                <div id="SavedDashBoardsList">
                </div>
            </div>`
    }
}