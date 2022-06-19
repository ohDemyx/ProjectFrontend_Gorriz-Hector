import React from "react";
import unavailable from "../img/no-img.jpg";
import {
  Link
} from "react-router-dom";


var apiKey = "77543978b128067bc5c534314ead1ae4";


export default class movieDetails extends React.Component {
    constructor(props) {
        super();
        this.state = {
            title: null,
            poster: null,
            vote: null,
            voteCount: null,
            overview: null,
            releasefilm:null,
            filmGenres: null,
            id: props.match.params.detailsId
        }
    }
    
    componentDidMount() {
        fetch("https://api.themoviedb.org/3/tv/"+this.state.id+"?api_key="+apiKey+"&language=en-US")
        .then(response => response.json())
        .then(json => {
            let genresname= [];
            json.genres.map((genre,idx)=>genresname.push(genre.name));
            let languagename=[];
            json.spoken_languages.map((language,idx)=>languagename.push(language.name));
            
            this.setState({
                title: json.original_name,
                poster:json.poster_path,
                vote:json.vote_average,
                voteCount:json.vote_count,
                overview:json.overview,
                releasedate:json.release_date,
                filmGenres:genresname.join(", "),
                filmLanguages:languagename.join(", "),
            });
        });
    }
    
    render() {
        
        console.log(this.state.id);
        console.log(this.state.filmGenres);
        
        let noImg = this.state.poster == null ? <img id="poster2" src={unavailable} /> : <img id="poster2" src={"https://image.tmdb.org/t/p/w500/"+[this.state.poster]} />;
        
        return (
            <div id="background2">
                <div id="contenido2">
                    
                    <div id="fotopeli">
                        {noImg}
                    </div>
                    <div id="infopeli">
                        <h4>{this.state.title}</h4>
                        <p>{this.state.overview}</p>
                        <p>Average vote: {this.state.vote} ({this.state.voteCount} votes)</p>
                        <div id="languagespeli">
                            <p>Languages: {this.state.filmlanguages}.</p>
                        </div>
                        <div id="genrepeli">
                            <p>Genres: {this.state.filmGenres}.</p>
                        </div>
                        <div id="home"><Link to="/">Home</Link></div>
                    </div>
                    
                </div>
            </div>
        );
    }
}