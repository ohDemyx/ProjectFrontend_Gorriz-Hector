import React from "react";
import unavailable from "../img/no-img.jpg";

export default class TVShow extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        let poster = this.props.data.poster_path;
        let title = this.props.data.original_name;
        let newtitle = title.length>27 ? <h3>{title.substr(0,27)+"..."}</h3> : <h3>{title}</h3>;
        let vote = this.props.data.vote_average;
        let voteCount = this.props.data.vote_count;
        
        let noImg = poster == null ? <img id="poster1" src={unavailable} /> : <img id="poster1" src={"https://image.tmdb.org/t/p/w500/"+poster} />;
        
        return (
            <div className="peli">
                {noImg}
                {newtitle}
                <p>{vote} ({voteCount} votes)</p>
            </div>
        );
    }
}
