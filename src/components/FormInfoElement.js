import React from "react";


export default class FormInfoElement extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        let data = this.props.data;
        return (
            <p className="highlight">{data}:</p>
        );
    }
}
