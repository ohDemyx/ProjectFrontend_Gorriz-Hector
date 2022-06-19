import React from "react";


export default class FormInputElement extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        let typeInput = this.props.type;
        let nameInput = this.props.name;
        let valueInput = this.props.value;
        let labelInput = this.props.label;
        let checkedTrueFalse = this.props.checkedBool;
        let ID = this.props.id;
        //comprobamos si es un input type que viene por defecto checkeado. Solo para checkear por defecto Movies al cargar la pagina
        let inputContent = checkedTrueFalse=="true" ? <input type={typeInput} id={ID} name={nameInput} value={valueInput} defaultChecked /> : <input type={typeInput} id={ID} name={nameInput} value={valueInput}/>;
        
        return (
            <div>
                {inputContent}
                <label for={nameInput}>{labelInput}</label><br />
            </div>
        );
    }
}
