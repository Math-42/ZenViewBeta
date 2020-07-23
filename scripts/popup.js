module.exports = class popUpMenu{
  constructor(){
    this.tablinks = {}
    this.menus = {}
  }

  setTablinks(tabLinks){
    this.tablinks = tabLinks;
  }

  setMenus(menus){
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
    if(this.menus[menuName].onLoadFunction !== undefined){
      this.menus[menuName].onLoadFunction()
    }
  }

  openMenu(id, menuName){
    let tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(id).className += " active"
    document.getElementById(menuName).style.display = "flex";
    this.loadMenuFunction(menuName)
  }
}