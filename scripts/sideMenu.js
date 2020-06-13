//Muda a posicao do menu lateral conforme o usuário pressiona o botão
function openSideMenu() {
  if(document.getElementById("side_menu").style.width ==="60px"){
    document.getElementById("side_menu").style.width = "280px";
    document.getElementById("main").style.marginLeft = "280px";
    document.getElementById("side_tab_menu").style.display = "block";
    
  }else{
    document.getElementById("side_tab_menu").style.display = "none";
    document.getElementById("side_menu").style.width = "60px";
    document.getElementById("main").style.marginLeft = "60px";
  }
}