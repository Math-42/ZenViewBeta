module.exports = class popUpMenu{
  constructor(){
    this.tablinks = {}
    this.menus = {}
  }

  setTablinks(tabLinks){
    console.log("ok")
    this.tablinks = tabLinks;
  }

  setMenus(menus){
    console.log("ok")
    this.menus = menus
  }

  openPopup(menu){
    document.getElementById("popup_background").style.display = "block";
    this.openMenu(menu+'_tablink',menu);
  }

  closePopup(){
    document.getElementById("popup_background").style.display = "none";
  }

  loadMenuFunction(menuName){
    console.log(this.menus[menuName].onLoadFunction)
    if(this.menus[menuName].onLoadFunction !== undefined){
      this.menus[menuName].onLoadFunction()
    }
  }

  openMenu(id, menuName){
    console.log(this.menus)
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(id).className += " active"
    document.getElementById(menuName).style.display = "block";
    this.loadMenuFunction(menuName)
  }
}