module.exports = class MenuBuilder {
    stat
    static build(menu,menuGroupId) {
        let component = this.builder(menu,menu.id,menuGroupId)
        let card = this.cardBuilder(menu.name, menu.title, menu.id, component)
        return card
    }
    static builder(menu,id,menuGroupId) {
        let components = []
        let component
        menu.fields.forEach(field => {
            switch (field.type) {
                case "textInput":
                    component = (this.textInputBuilder(field,id))
                    break
                case "checkboxInput":
                    component = (this.checkBoxBuilder(field,id))
                    break
                case "selectInput":
                    component = (this.selectionBuilder(field,id))
                    break
                case "textAndButtonInput":
                    component = (this.textAndButtonBuilder(field,id))
                    break
                case "selectAndLabelInput":
                    component = (this.selectAndLabelBuilder(field,id))
                    break
                case "div":
                    component = (this.divBuilder(field,id))
                    break
                case "label":
                    component = (this.labelBuilder(field,id))
                    break
                case "formRow":
                    component = (this.formRowBuilder(field,id))
                    break
                case "colorPicker":
                    component = (this.colorPickerBuilder(field,id))
                    break
                default:
                    break
            }
            this.setLisener(component,field,menuGroupId)
            components.push(component)
        })
        return components
    }
    static setLisener(element,elementObj,id){
        elementObj.listener = (elementObj.listener === undefined)? true: elementObj.listener;
        if(elementObj.listener !== false){
            element.setAttribute(id+"_validListener", true );
        }
    }
    static divBuilder(divObj, id) {

        let div = document.createElement('div')
        div.id = id + "_" + divObj.id
        div.className = divObj.class
        div.name = divObj.name

        if (divObj.fields !== undefined) {
            let content = this.builder(divObj, id)
            content.forEach(field => {
                div.appendChild(field)
            })
        }

        return div

    }
    static placeHolderValid(component, placeHolder) {
        component.placeholder = (placeHolder === undefined) ? "" : placeHolder
    }
    static labelBuilder(labelObj) {
        let label = document.createElement('label');
        label.textContent = labelObj.text
        return label
    }
    static smallBuilder(text) {
        let smallText = document.createElement('small')
        smallText.className = "text-muted"
        smallText.textContent = text

        return smallText
    }
    static formGroupBuilder() {
        let formGroup = document.createElement('div')
        formGroup.className = "form-group"

        return formGroup
    }
    static textInputBuilder(textInputObj, id) {
        let formGroup = this.formGroupBuilder()
        formGroup.appendChild(this.smallBuilder(textInputObj.title))

        let inputText = document.createElement('input')
        inputText.className = "form-control"
        inputText.id = id + "_" + textInputObj.id
        inputText.type = "text"
        formGroup.appendChild(inputText)

        return formGroup
    }
    static selectionBuilder(selectionBuilderObj, id) {
        let formGroup = this.formGroupBuilder()
        formGroup.appendChild(this.smallBuilder(selectionBuilderObj.title))

        let select = document.createElement('select')
        select.id = id + "_" + selectionBuilderObj.id
        select.className = "custom-select"

        if (selectionBuilderObj.options !== undefined) {
            let newOption
            selectionBuilderObj.options.forEach(option => {
                newOption = document.createElement('option')
                newOption.textContent = option.text
                newOption.value = option.value || option.text
                select.appendChild(newOption)
            })
        }

        formGroup.appendChild(select)

        return formGroup
    }
    static colorPickerBuilder(colorPickerObj, id) {
        let formGroup = this.formGroupBuilder()
        formGroup.appendChild(this.smallBuilder(colorPickerObj.title))

        let select = document.createElement('select')
        select.id = id + "_" + colorPickerObj.id
        select.className = "custom-select"

        if (colorPickerObj.options !== undefined) {
            let newOption
            colorPickerObj.options.forEach(option => {
                newOption = document.createElement('option')
                newOption.value = option.value || option.text
                newOption.style.backgroundColor = option.value || option.text
                select.appendChild(newOption)
            })
        }

        select.onchange = () => {
            console.log("color selct")
            select.style.backgroundColor = select.value
        }

        formGroup.appendChild(select)

        return formGroup
    }
    static checkBoxBuilder(checkBoxObj, id) {
        let formCheck = document.createElement('div')
        formCheck.className = "form-check mt-3"

        let formCheckInput = document.createElement('input')
        formCheckInput.className = "form-check-input"
        formCheckInput.type = "checkbox"
        formCheckInput.id = id + "_" + checkBoxObj.id
        formCheckInput.checked = checkBoxObj.checked

        let formCheckText = document.createElement('label')
        formCheckText.className = "form-check-label"
        formCheckText.textContent = `${checkBoxObj.text}`

        formCheck.appendChild(formCheckInput)
        formCheck.appendChild(formCheckText)

        return formCheck
    }
    static textAndButtonBuilder(textAndButtonObj, id) {

        let inputGroup = document.createElement('div')
        inputGroup.className = "input-group"
        inputGroup.appendChild(this.smallBuilder(textAndButtonObj.title))

        let insideInputGroup = document.createElement('div')
        insideInputGroup.className = "input-group mb-3"
        inputGroup.appendChild(insideInputGroup)

        let inputText = document.createElement('input')
        inputText.className = "form-control"
        inputText.id = id + "_" + textAndButtonObj.inputId
        inputText.type = "text"
        inputText.setAttribute("aria-describedby", "basic-addon2")
        insideInputGroup.appendChild(inputText)

        let inputButtonGroup = document.createElement('div')
        inputButtonGroup.className = "input-group-append"
        insideInputGroup.appendChild(inputButtonGroup)

        let inputButton = document.createElement('button')
        inputButton.className = "btn btn-outline-secondary"
        inputButton.type = "button"
        inputButton.textContent = `${textAndButtonObj.buttonText}`
        inputButton.id = id + "_" + textAndButtonObj.buttonId
        inputButtonGroup.appendChild(inputButton)

        return inputGroup

    }
    static selectAndLabelBuilder(selectAndLabelObj, id) {

        let inputGroup = document.createElement('div')
        inputGroup.className = "input-group mb-3"

        let inputGroupPrepend = document.createElement('div')
        inputGroupPrepend.className = "input-group-prepend"
        inputGroup.appendChild(inputGroupPrepend)

        let label = document.createElement('label')
        label.className = 'input-group-text'
        label.textContent = `${selectAndLabelObj.title}`
        inputGroupPrepend.appendChild(label)

        let select = document.createElement('select')
        select.id = id + "_" + selectAndLabelObj.id
        select.className = "custom-select"

        if (selectAndLabelObj.options !== undefined) {
            let newOption
            selectAndLabelObj.options.forEach(option => {
                newOption = document.createElement('option')
                newOption.textContent = option.text
                newOption.value = option.value || option.text
                select.appendChild(newOption)
            })
        }

        inputGroup.appendChild(select)


        return inputGroup
    }
    static formRowBuilder(formRowObj, id) {
        let formRow = document.createElement('div');
        formRow.className = "form-row"

        let div = document.createElement('div')
        div.className = "col"

        if (formRowObj.col1.fields !== undefined) {
            let content = this.builder(formRowObj.col1, id)
            content.forEach(field => {
                div.appendChild(field)
            })
        }

        let div2 = document.createElement('div')
        div2.className = "col"

        if (formRowObj.col2.fields !== undefined) {
            let content = this.builder(formRowObj.col2, id)
            content.forEach(field => {
                div2.appendChild(field)
            })
        }

        formRow.appendChild(div)
        formRow.appendChild(div2)

        return formRow
    }
    static cardBuilder(cardName, title, id, components) {
        let card = document.createElement('div')
        card.className = "card editing_menu_card"

        let cardHeader = document.createElement('div')
        cardHeader.className = "card-header btn"
        cardHeader.id = `${cardName}_option`
        cardHeader.setAttribute("data-toggle", "collapse")
        cardHeader.setAttribute(`data-target`, `#menu_${cardName}_option`)
        cardHeader.setAttribute("aria-expanded", "true")
        cardHeader.setAttribute("aria-controls", `menu_${cardName}_option`)
        

        let cardTitle = document.createElement('h6')
        cardTitle.textContent = `${title}`
        cardHeader.appendChild(cardTitle)

        let cardBodyCollapse = document.createElement('div')
        cardBodyCollapse.id = `menu_${cardName}_option`
        cardBodyCollapse.className = "collapse"
        cardBodyCollapse.setAttribute("aria-labelledby", `${cardName}_option`)
        cardBodyCollapse.setAttribute("data-parent", `#accordion`)

        let cardBody = document.createElement('div')
        cardBody.className = "card-body form-group"
        cardBodyCollapse.appendChild(cardBody)
        cardBody.id = id;
        card.appendChild(cardHeader)
        card.appendChild(cardBodyCollapse)

        let mainForm = document.createElement('div')

        components.forEach(field => {
            mainForm.appendChild(field)
        })

        cardBody.appendChild(mainForm)

        return card
    }
}