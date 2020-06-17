const fs = require('fs')

module.exports = class DataViewsEdit{
    constructor(){
        this.dataViews = [];
    }
    onLoadFunction(){
        this.dataViews = fs.readdirSync('dataViews');
        this.postList(this.dataViews)
    }
    filter(){
        this.dataViews = fs.readdirSync('dataViews');
        let dataViewsEditList = []
        let string = document.getElementById("DataViewsEditSearchBar").value
        for(let i =0;i<this.dataViews.length;i++){
            if(this.dataViews[i].includes(string)){
                dataViewsEditList.push(this.dataViews[i]);
            }
        }
        this.postList(dataViewsEditList)
    }
    openNewDataView(dataViewName){
        mainwindow.dispatchEvent('LoadNewTab',{'name':dataViewName,'context': 'edit_show'})
        document.getElementById("DataViewsEditSearchBar").value = ""
        mainwindow.dispatchEvent('ClosePopupMenu');
    }
    postList(dataViewsEditList){
        let htmlList = ""
        for(let i=0;i<dataViewsEditList.length;i++){
            htmlList +=`<button 
                        onclick="mainwindow.popUpMenu.menus['DataViewsEdit'].openNewDataView('${dataViewsEditList[i]}')">
                        ${dataViewsEditList[i]}
                        </button>`
        }
        document.getElementById("SavedDataViewsEditList").innerHTML = htmlList
    }
    htmlBuilder(){
    return  `<div class="tabcontent" id="DataViewsEdit">
                <input type="text" id="DataViewsEditSearchBar" onkeyup="mainwindow.popUpMenu.menus['DataViewsEdit'].filter()" placeholder="Search by name">
                <div id="SavedDataViewsEditList">
                </div>
            </div>`
    }
}