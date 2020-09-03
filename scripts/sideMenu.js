//Muda a posicao do menu lateral conforme o usuário pressiona o botão
module.exports = class SideMenu{
    /**
     * Abre ou fecha o menu lateral, dependendo do estádo atual e muda a margem da tela principal
     */
    changeSideMenu(){
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
};