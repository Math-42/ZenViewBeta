function openPopup(menu){
  document.getElementById("popup_background").style.display = "block";
}

function closePopup(){
  document.getElementById("popup_background").style.display = "none";
}

function openMenu(id, menuName) {
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
}
