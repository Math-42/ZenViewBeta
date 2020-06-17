const fs = require('fs')

module.exports = class DataViewsList{
    constructor(){
        this.dataViews = [];
    }
    onLoadFunction(){
        this.dataViews = fs.readdirSync('dataViews');
        this.postList(this.dataViews)
    }
    filter(){
        this.dataViews = fs.readdirSync('dataViews');
        let dataViewsList = []
        let string = document.getElementById("dataViewsSearchBar").value
        for(let i =0;i<this.dataViews.length;i++){
            if(this.dataViews[i].includes(string)){
                dataViewsList.push(this.dataViews[i]);
            }
        }
        this.postList(dataViewsList)
    }
    openNewDataView(dataViewName){
        mainwindow.dispatchEvent('LoadNewTab',{'name':dataViewName,'context': 'start_show'})
        document.getElementById("dataViewsSearchBar").value = ""
        mainwindow.dispatchEvent('ClosePopupMenu');
    }
    postList(dataViewsList){
        let htmlList = ""
        for(let i=0;i<dataViewsList.length;i++){
            htmlList +=`<button 
                        onclick="mainwindow.popUpMenu.menus['DataViewsList'].openNewDataView('${dataViewsList[i]}')">
                        ${dataViewsList[i]}
                        </button>`
        }
        document.getElementById("SavedDataViewsList").innerHTML = htmlList
    }
    htmlBuilder(){
    return  `<div class="tabcontent" id="DataViewsList">
                <input type="text" id="dataViewsSearchBar" onkeyup="mainwindow.popUpMenu.menus['DataViewsList'].filter()" placeholder="Search by name">
                <div id="SavedDataViewsList">
                </div>
            </div>`
    }
}