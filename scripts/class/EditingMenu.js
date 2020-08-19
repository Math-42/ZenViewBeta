module.exports = class EditingMenu{
    constructor(){
        this.isOpen = false;
    }
    openPlotEditingMenu(){
        if(!this.isOpen){
            console.log("menu de edição de plots aberto");
            if(document.getElementById("editing_menu").style.display ==="block"){
                document.getElementById("editing_menu").style.display = "none";
                document.getElementById("main").style.marginRight = "0px";
                
            }else{
                document.getElementById("editing_menu").style.display = "block";
                document.getElementById("editing_menu").style.width = "22%";
                document.getElementById("main").style.marginRight = "22%";
            }
        }
    }
    createOption(optionObj){
        let option = document.createElement('div');
        option.className = "card";
        `<div class="card">
            <div class="card-header" id="headingOne" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                <h5 class="mb-0">
                        ${optionObj.title}
                </h5>
            </div>

            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne"
                data-parent="#accordion">
                <div class="card-body">
                    ${optionObj.body}
                </div>
            </div>
        </div>`
    }
    init(){
        let options = document.getElementsByClassName("collapsible");
        console.log(options)
        for(let i=0;i<options.length;i++){
            options[i].addEventListener("click", () => {
                this.classList.toggle("active");
                let content = this.nextElementSibling;
                if (content.style.maxHeight){
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                } 
            });
        };      
    }
}