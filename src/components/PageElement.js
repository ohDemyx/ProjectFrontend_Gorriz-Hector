import React from "react";


export default class PageElement extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        let numberPage = this.props.number;
        let actualPage = this.props.actual;
        
        //comprobamos si la pagina es la actual
        let content = actualPage == "true" ? <input type="button" value={numberPage} disabled /> : <input type="button" value={numberPage} />
        
        return (
            <div className="pageElement">
                {content}
            </div>
        );
    }
}
