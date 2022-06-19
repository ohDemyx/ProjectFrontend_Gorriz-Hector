import React from "react";


export default class ResultsCount extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        let total_count = this.props.count;

        
        //comprobamos si el numero de resultados es menor o mayor a 9000
        let content = total_count < 9000 ? <p>{total_count} results</p> : <p>+9000 results</p>;
        
        return (
            <div className="totalResults">
                {content}
            </div>
        );
    }
}
