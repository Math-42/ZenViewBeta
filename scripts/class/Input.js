module.exports = class Input {
    constructor(name, operation) {
        this.name = name;
        this.operation = (operation === undefined) ? "" : operation;
    }
    getValue() {
        if (this.operation !== "") {
            try {
                return eval(this.operation);
            } catch (ERROR) {
                return undefined;
            }
        }
    }
    smallBuilder(text) {
        let smallText = document.createElement("small");
        smallText.className = "text-muted h6";
        smallText.textContent = text;
        return smallText;
    }
    buttons() {
        let inputButtonGroup = document.createElement("div");
        inputButtonGroup.className = "input-group-append";

        let inputButton = document.createElement("button");
        inputButton.className = "btn save_input_btn";
        inputButton.type = "button";
        inputButton.textContent = "Save";
        inputButton.id = "save_input_btn_" + this.name;
        inputButton.onclick = () => mainwindow.popUpMenu.menus["EditInputs"].saveInput(`${this.name}`);
        inputButtonGroup.appendChild(inputButton);

        let inputButtonDelete = document.createElement("button");
        inputButtonDelete.className = "btn delete_input_btn";
        inputButtonDelete.type = "button";
        inputButtonDelete.id = "delete_input_btn_" + this.name;
        inputButtonDelete.textContent = "Delete";
        inputButtonDelete.onclick = () => mainwindow.popUpMenu.menus["EditInputs"].deleteInput(`${this.name}`);

        inputButtonGroup.appendChild(inputButtonDelete);

        return inputButtonGroup;
    }
    textAndButtonBuilder(text, button, id, value) {
        let inputGroup = document.createElement("div");
        inputGroup.className = "input-group";
        inputGroup.appendChild(this.smallBuilder(text));

        let insideInputGroup = document.createElement("div");
        insideInputGroup.className = "input-group mb-3";
        inputGroup.appendChild(insideInputGroup);

        let inputText = document.createElement("input");
        inputText.className = "form-control";
        inputText.type = "text";
        inputText.value = value;
        inputText.id = id;
        inputText.setAttribute("aria-describedby", "basic-addon2");

        if (this.id !== undefined) inputText.id = this.name;
        insideInputGroup.appendChild(inputText);

        if (button) insideInputGroup.appendChild(this.buttons());

        return inputGroup;

    }
    inputHtml() {
        let inputHtmlELement = document.createElement("div");
        inputHtmlELement.className = "standard_input_border p-2 m-2";
        inputHtmlELement.id = `input_row_${this.name}`;
        inputHtmlELement.appendChild(this.textAndButtonBuilder("Name", true, `input_name_${this.name}`, this.name));
        inputHtmlELement.appendChild(this.textAndButtonBuilder("Return", false, `input_new_return_${this.name}`, this.operation));
        return inputHtmlELement;
    }
};