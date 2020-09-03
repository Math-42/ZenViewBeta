class MenuBuilder {
    constructor(json, parent) {
        this.parent = parent;
        if (json.att !== undefined) this.att = this.getAtt() + json.att;
        if (json.id !== undefined) this.id = json.id;
        if (json.type !== undefined) this.type = json.type;
        if (json.lg !== undefined) this.lg = json.lg;
        if (json.checked !== undefined) this.checked = json.checked;
        if (json.text !== undefined) this.text = json.text;
        if (json.options !== undefined) this.options = json.options;
        if (json.fields !== undefined) this.fields = json.fields;
        if (json.conditions !== undefined) this.conditions = json.conditions;
        if (this.fields !== undefined) this.buildFields(this.fields);
        this.build();
    }
    init() {
        if (this.conditions !== undefined) {
            this.setConditions();
        }
        if (this.fields !== undefined) {
            this.fields.forEach(field => {
                field.init();
            });
        }
    }
    setConditions() {
        this.conditions.forEach(condition => {
            let element;
            element = document.getElementById(condition.id);
            if (element == null) {
                throw `${condition.id} didn't exists, the element conditions must be on the DOM`;
            }
            element.addEventListener("input", () => {
                let count = 0;
                this.conditions.forEach(condition => {
                    if (document.getElementById(condition.id)[condition.att] == condition.requiredValue) {
                        count++;
                    }
                });
                if (count === this.conditions.length) {
                    this.htmlComponent.style.display = "block";
                } else {
                    this.htmlComponent.style.display = "none";
                }
            });
        });
        let count = 0;
        this.conditions.forEach(condition => {
            if (document.getElementById(condition.id)[condition.att] == condition.requiredValue) {
                count++;
            }
        });
        if (count === this.conditions.length) {
            this.htmlComponent.style.display = "block";
        } else {
            this.htmlComponent.style.display = "none";
        }

    }
    getAtt() {
        let parent = this.parent;
        while (parent !== undefined && parent.att === undefined) {
            parent = parent.parent;
            if (parent === undefined) {
                return "";
            }
        }
        return parent.att + ".";
    }
    buildFields() {
        let savedFields = [];
        this.fields.forEach(field => {
            savedFields.push(new MenuBuilder(field, this));
        });
        this.fields = savedFields;
    }
    basicInput() {
        let component;
        switch (this.type) {
        case "text":
            component = document.createElement("input");
            component.type = "text";
            break;
        case "checkbox":
            component = document.createElement("input");
            component.type = "checkbox";
            break;
        case "select":
            component = document.createElement("select");
            break;
        case "textAndButton":
            component = document.createElement("");
            break;
        case "selectAndLabel":
            component = document.createElement("");
            break;
        default:
            break;
        }
        component.setAttribute("listening-group", this.lg || "default");
        if (this.att !== undefined) component.setAttribute("att", this.att);
        if (this.id !== undefined) component.id = this.id;
        return component;

    }
    labelBuilder() {
        let label = document.createElement("label");
        label.textContent = this.text;
        return label;
    }
    smallBuilder() {
        let smallText = document.createElement("small");
        smallText.className = "text-muted";
        smallText.textContent = this.text;

        return smallText;
    }
    formGroupBuilder() {
        let formGroup = document.createElement("div");
        formGroup.className = "form-group";

        return formGroup;
    }
    textInputBuilder() {
        let formGroup = this.formGroupBuilder();
        formGroup.appendChild(this.smallBuilder());

        let inputText = this.basicInput();
        inputText.className = "form-control";
        formGroup.appendChild(inputText);

        return formGroup;
    }
    checkBoxBuilder() {
        let formCheck = document.createElement("div");
        formCheck.className = "form-check mt-3";

        let formCheckInput = this.basicInput();
        formCheckInput.className = "form-check-input";
        formCheckInput.checked = this.checked;

        let formCheckText = document.createElement("label");
        formCheckText.className = "form-check-label";
        formCheckText.textContent = this.text;

        formCheck.appendChild(formCheckInput);
        formCheck.appendChild(formCheckText);

        return formCheck;
    }
    selectionBuilder() {
        let formGroup = this.formGroupBuilder();
        formGroup.appendChild(this.smallBuilder());

        let select = this.basicInput();
        select.className = "custom-select";

        if (this.options !== undefined) {
            let newOption;
            this.options.forEach(option => {
                newOption = document.createElement("option");
                newOption.textContent = option.text;
                newOption.value = option.value || option.text;
                select.appendChild(newOption);
            });
        }

        formGroup.appendChild(select);

        return formGroup;
    }
    textAndButtonBuilder() {
        let text = {
            "title": this.text.title,
            "buttonText": this.text.buttonText
        };
        this.text = text.title;

        let inputGroup = document.createElement("div");
        inputGroup.className = "input-group";
        inputGroup.appendChild(this.smallBuilder(this.text));

        let insideInputGroup = document.createElement("div");
        insideInputGroup.className = "input-group mb-3";
        inputGroup.appendChild(insideInputGroup);

        let inputText = document.createElement("input");
        inputText.className = "form-control";
        inputText.type = "text";
        inputText.setAttribute("aria-describedby", "basic-addon2");
        inputText.setAttribute("listening-group", this.lg || "default");
        if (this.att !== undefined) inputText.setAttribute("att", this.att);
        if (this.id !== undefined) inputText.id = this.id;
        insideInputGroup.appendChild(inputText);

        let inputButtonGroup = document.createElement("div");
        inputButtonGroup.className = "input-group-append";
        insideInputGroup.appendChild(inputButtonGroup);

        let inputButton = document.createElement("button");
        inputButton.className = "btn btn-outline-secondary";
        inputButton.type = "button";
        inputButton.textContent = text.buttonText;
        inputButton.setAttribute("listening-group", false);
        if (this.id !== undefined) inputButton.id = this.id + "_button";
        inputButtonGroup.appendChild(inputButton);

        return inputGroup;

    }
    selectAndLabelBuilder() {

        let inputGroup = document.createElement("div");
        inputGroup.className = "input-group mb-3";

        let inputGroupPrepend = document.createElement("div");
        inputGroupPrepend.className = "input-group-prepend";
        inputGroup.appendChild(inputGroupPrepend);

        let label = document.createElement("label");
        label.className = "input-group-text";
        label.textContent = this.text;
        inputGroupPrepend.appendChild(label);

        let select = document.createElement("select");
        if (this.id !== undefined) select.id = this.id;
        select.setAttribute("listening-group", this.lg || 0);
        if (this.att !== undefined) select.setAttribute("att", this.att);
        select.className = "custom-select";

        if (this.options !== undefined) {
            let newOption;
            this.options.forEach(option => {
                newOption = document.createElement("option");
                newOption.textContent = option.text;
                newOption.value = option.value || option.text;
                select.appendChild(newOption);
            });
        }

        inputGroup.appendChild(select);


        return inputGroup;
    }
    divBuilder() {

        let div = document.createElement("div");
        if (this.id !== undefined) div.id = this.id;
        div.name = this.name;
        if (this.att !== undefined) div.setAttribute("att", this.att);

        if (this.fields !== undefined) {
            this.fields.forEach(field => {
                div.appendChild(field.htmlComponent);
            });
        }

        return div;

    }
    formRowBuilder() {
        let formRow = document.createElement("div");
        formRow.className = "form-row";

        if (this.fields !== undefined) {
            let componets = [];
            this.fields.forEach(field => {
                let colDiv = document.createElement("div");
                colDiv.className = "col";
                colDiv.appendChild(field.htmlComponent);
                componets.push(colDiv);
                formRow.appendChild(colDiv);
            });
        }

        return formRow;
    }
    cardBuilder() {
        let id = (this.id).replace(/\./g, "_");
        let card = document.createElement("div");
        card.className = "card editing_menu_card";

        let cardHeader = document.createElement("div");
        cardHeader.className = "card-header btn";
        cardHeader.id = id + "_header";
        cardHeader.setAttribute("data-toggle", "collapse");
        cardHeader.setAttribute("data-target", `#menu_${id}_option`);
        cardHeader.setAttribute("aria-expanded", "true");
        cardHeader.setAttribute("aria-controls", `menu_${id}_option`);


        let cardTitle = document.createElement("h6");
        cardTitle.textContent = this.text;
        cardHeader.appendChild(cardTitle);

        let cardBodyCollapse = document.createElement("div");
        cardBodyCollapse.id = `menu_${id}_option`;
        cardBodyCollapse.className = "collapse";
        cardBodyCollapse.setAttribute("aria-labelledby", `${id}_option`);
        cardBodyCollapse.setAttribute("data-parent", "#accordion");

        let cardBody = document.createElement("div");
        cardBody.className = "card-body form-group";
        cardBodyCollapse.appendChild(cardBody);
        cardBody.id = id + "_body";
        if (this.att !== undefined) cardBody.setAttribute("att", this.att);
        card.appendChild(cardHeader);
        card.appendChild(cardBodyCollapse);

        let mainForm = document.createElement("div");

        this.fields.forEach(field => {
            mainForm.appendChild(field.htmlComponent);
        });

        cardBody.appendChild(mainForm);

        return card;
    }
    build() {
        switch (this.type) {
        case "text":
            this.htmlComponent = (this.textInputBuilder());
            break;
        case "checkbox":
            this.htmlComponent = (this.checkBoxBuilder());
            break;
        case "select":
            this.htmlComponent = (this.selectionBuilder());
            break;
        case "div":
            this.htmlComponent = (this.divBuilder());
            break;
        case "label":
            this.htmlComponent = (this.labelBuilder());
            break;
        case "formRow":
            this.htmlComponent = (this.formRowBuilder());
            break;
        case "card":
            this.htmlComponent = (this.cardBuilder());
            break;
        case "textWithButton":
            this.htmlComponent = (this.textAndButtonBuilder());
            break;
        case "selectAndLabel":
            this.htmlComponent = (this.selectAndLabelBuilder());
            break;
        default:
            throw "Invalid type of field: " + this.type;
        }
    }
}

module.exports = class Menu {
    constructor(menuConfig, root) {
        this.form = document.createElement("form");
        this.menu = new MenuBuilder(menuConfig);
        this.form.appendChild(this.menu.htmlComponent);
        root.appendChild(this.form);
        this.events;
    }
    init() {
        this.menu.init();
        this.form.reset();
    }
    /**
     * 
     * @param {string} fieldIdentification id ou path do campo que se quer adiconar o evento
     * @param {Function} callBackFunction função a ser executada como callback do evento
     */
    onFieldChange(fieldIdentification, callBackFunction) {
        let element;

        let attResult = this.getElementByAtt(fieldIdentification);
        let idResult = document.getElementById(fieldIdentification);

        if (attResult !== null) {
            element = attResult;
        } else {
            element = idResult;
        }

        let event;
        try {
            switch (element.tagName) {
            case "BUTTON":
                event = "click";
                break;

            case "INPUT":
                event = "change";
                break;

            case "SELECT":
                event = "change";
                break;

            default:
                break;
            }
        } catch (error) {
            throw ("Did't find the requested field: " + fieldIdentification);
        }


        element.addEventListener(event, (evt) => {
            callBackFunction((evt.target.type === "checkbox") ? evt.target.checked : evt.target.value);
        });
    }
    onGroupChange(groupName, receivedFunction) {
        this.form.addEventListener("input", (evt) => {
            let group = evt.target.getAttribute("listening-group");
            if (!String(group).includes("false") && String(group).includes(groupName)) {
                receivedFunction(this.getData(this.form.elements, groupName));
            }
        });
    }
    onDataChange(receivedFunction) {
        this.form.addEventListener("input", (evt) => {
            let group = evt.target.getAttribute("listening-group");
            if (group != false) {
                receivedFunction(this.getData(this.form.elements));
            }
        });
    }
    getData(data, group) {
        let formData = {};
        let value;
        for (let i = 0; i < data.length; i++) {
            let e = data[i];
            if (!String(e.getAttribute("listening-group")).includes(group)) {
                continue;
            } else {
                if (e.getAttribute)
                    if (e.type !== "checkbox") {
                        value = e.value;
                    } else {
                        value = e.checked;
                    }
                let path = String(e.getAttribute("att")).split(".");
                this.createResponseObj(formData, path, value);
            }
        }
        return formData;
    }
    getElementByAtt(path) {
        let response = this.form.querySelector(`[att="${path}"]`);
        return response;
    }
    getGroup(groupName) {
        return this.getData(this.form.elements, groupName);
    }
    getField(fieldIdentification) {
        let  element;
        let attResult = this.getElementByAtt(fieldIdentification);
        let idResult = document.getElementById(fieldIdentification);

        if (attResult !== null) {
            element = attResult;
        } else {
            element = idResult;
        }

        try {
            return element.value;
        } catch (error) {
            throw ("Didn't find the requested field: " + fieldIdentification);
        }
    }
    getFieldElement(fieldIdentification) {
        let  element;
        let attResult = this.getElementByAtt(fieldIdentification);
        let idResult = document.getElementById(fieldIdentification);

        if (attResult !== null) {
            element = attResult;
        } else {
            element = idResult;
        }
        console.log(element);
        try {
            return element;
        } catch (error) {
            throw ("Didn't find the requested field: " + fieldIdentification);
        }
    }
    createResponseObj(pointer, path, value) {

        let lastName = arguments.length === 3 ? path.pop() : false;

        for (let i = 0, j = path.length; i < j; i++) {
            pointer = pointer[path[i]] = pointer[path[i]] || {};
        }

        if (lastName) pointer = pointer[lastName] = value;

        return pointer;
    }
    setOptions(selectAtt, options, func) {
        let select = this.getElementByAtt(selectAtt);
        let newOption;
        for (let i = select.options.length - 1; i >= 0; i--) {
            select.remove(i);
        }
        options.forEach(option => {
            let optionInfo = func(option);
            newOption = document.createElement("option");
            newOption.value = optionInfo.value || optionInfo.text;
            newOption.textContent = optionInfo.text;
            select.appendChild(newOption);
        });
    }
    setSelectedOption(select, selectedOption) {
        for (let i = 0, j = select.options.length; i < j; i++) {
            if (select.options[i].value == selectedOption || select.options[i].textContent == selectedOption) {
                select.options[i].selected = true;
                return;
            }
        }
    }
    setData(obj) {
        let atts = this.objToAttList(obj);
        let element;
        for (let att of atts) {
            element = this.getElementByAtt(att.path);

            if (element === null) continue;

            if (element.tagName === "SELECT") {
                this.setSelectedOption(element, att.value);
            } else if (element.type === "checkbox") {
                element.checked = att.value;
            } else {
                element.value = att.value;
            }
            element.dispatchEvent(new Event("input"));
        }
    }
    objToAttList(obj) {
        const isObject = val =>
            typeof val === "object" && !Array.isArray(val);

        const addDelimiter = (a, b) => a ? `${a}.${b}` : b;

        const paths = (obj = {}, head = "") => {
            return Object.entries(obj)
                .reduce((product, [key, value]) => {
                    let fullPath = addDelimiter(head, key);
                    return isObject(value) ?
                        product.concat(paths(value, fullPath)) :
                        product.concat({
                            "path": fullPath,
                            "value": value
                        });
                }, []);
        };

        return paths(obj);
    }

};