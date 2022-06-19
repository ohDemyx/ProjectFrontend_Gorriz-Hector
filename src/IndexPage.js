import React from "react";
import './App.css';
import PageElement from './components/PageElement';
import Movie from './components/Movie';
import FormInfoElement from './components/FormInfoElement';
import FormInputElement from './components/FormInputElement';
import ResultsCount from './components/ResultsCount';
import TVShow from './components/TVShow';
import uncheckAll from './components/uncheckAll';
import {
  Link
} from "react-router-dom";

var apiKey="77543978b128067bc5c534314ead1ae4";

var genresArray=[];    //array global donde guardamos los filtros de generos

function checkGenresArrays(arrayGenres,arrayAPI){
    let flag = [];
    for(var i=0; i < arrayGenres.length; i++){
        if(arrayAPI.includes(parseInt(arrayGenres[i]))){
           flag.push(true);
        }
    }
    
    if(flag.length==arrayGenres.length){
       return true;
    } else{
        return false;   
    }
}

function removeDuplicates(array){
    let newArray = array.filter((item,index) => array.indexOf(item)===index);
    return newArray;
}

export default class IndexPage extends React.Component {
        constructor() {
        super();
        this.state = {
            moviesContent: [],   //state para guardar todas las pelis
            tvShowsContent: [],  //state para guardar todas las series
            count: null,    //state para guardar el numero de resultados de cada peticion (pelis o series)
            pages: null,    //state para guardar el numero total de paginas de cada peticion
            actualPage: null,    //state para guardar el numero de pagina en la que se encuentra el usuario en cada momento
            changePage: false,   //state flag para marcar cuando queremos cambiar de pagina
            moviesGenresInfo: [],   //state para guardar la informacion de la peticion de generos de pelis
            tvShowsGenresInfo: [],   //state para guardar la informacion de la peticion de generos de series
            moviesORtvshowsSearch: "movies",   //iremos cambiando entre movies y tvshows para saber que info mostrar
            filterSearch: false,        //state flag para marcar el momento en el que se producen cambios
            genresSearchList: [],      //array dinamica para ir añadiendo o quitando generos (filtros). Sirve para pelis y series. Se apoya en la array global
            searchWithoutFiltering: false,    //state flag para saber cuando hacemos una busqueda sin ningun filtro (cuando la array anterior esta vacia)
            actualSearch: "noFiltering",      //state que nos dice si la busqueda actual es una busqueda con o sin filtros
            searchType: "noText" ,         //state para guardar el tipo de busqueda. 2 tipos, con texto y sin texto.
            filter: "",       //state para guardar el valor del search
            searchWord: false    //state flag para saber si hacemos una busqueda con palabra
        }
        
        this.pageBack = this.pageBack.bind(this);
        this.pageForward = this.pageForward.bind(this);
        this.filterChange = this.filterChange.bind(this);
        this.formChange = this.formChange.bind(this);
    }
    
    //----------------------------------------------------------------------------------------------------------------------//
    

    
    componentDidMount() {    //fase de carga de la pagina. Todo lo siguiente esta pensado para esa situacion
        
        //REQUEST FOR GETTING THE MOVIES GENRES DATA
        fetch("https://api.themoviedb.org/3/genre/movie/list?api_key="+apiKey+"&language=en-US")
        .then(response => response.json())
        .then(json => {
            this.setState({
                moviesGenresInfo: json.genres
            });
        });
        
        //-------------//
        
        //REQUEST FOR GETTING THE TV SHOWS GENRES DATA
        fetch("https://api.themoviedb.org/3/genre/tv/list?api_key="+apiKey+"&language=en-US")
        .then(response => response.json())
        .then(json => {
            this.setState({
                tvShowsGenresInfo: json.genres
            });
        });
        
        //-------------//
        
        //REQUEST FOR GETTING THE FIRST PAGE CONTENT (MOVIES)
        fetch("https://api.themoviedb.org/3/discover/movie?api_key="+apiKey+"&language=en-US&sort_by=popularity.desc&page=1")
        .then(response => response.json())
        .then(json => {
            this.setState({
                moviesContent: json.results,
                count: json.total_results,
                pages: json.total_pages,
                actualPage: json.page,
                //loading: false
            });
        });
    }
    
    //----------------------------------------------------------------------------------------------------------------------//
    
    componentDidUpdate(){   //fase de modificacion de filtros, formulario, cambio de pagina... cualquier cambio en el formulario vendremos aquí
        
        //REQUEST FOR MOVIE GENRE FILTERING
        if(this.state.filterSearch && this.state.moviesORtvshowsSearch=="movies" && this.state.actualSearch=="filtering" && this.state.searchType=="noText"){
            console.log("REQUEST FOR MOVIE GENRE FILTERING");
            fetch("https://api.themoviedb.org/3/discover/movie?api_key="+apiKey+"&language=en-US&sort_by=popularity.desc&page=1&with_genres=" + this.state.genresSearchList)
            .then(response => response.json())
            .then(json => {
                this.setState({
                    moviesContent: json.results,
                    count: json.total_results,
                    pages: json.total_pages,
                    actualPage: json.page,
                    filterSearch: false,
                    //loading: false
                });
            });
        }
        
        //-------------//
        
        //REQUEST FOR TVSHOW GENRE FILTERING
        if(this.state.filterSearch && this.state.moviesORtvshowsSearch=="TVshow" && this.state.actualSearch=="filtering" && this.state.searchType=="noText"){
            console.log("REQUEST FOR TVSHOW GENRE FILTERING");
            fetch("https://api.themoviedb.org/3/discover/tv?api_key="+apiKey+"&language=en-US&sort_by=popularity.desc&page=1&timezone=America%2FNew_York&with_genres="+this.state.genresSearchList+"&include_null_first_air_dates=false")
            .then(response => response.json())
            .then(json => {
                this.setState({
                    tvShowsContent: json.results,
                    count: json.total_results,
                    pages: json.total_pages,
                    actualPage: json.page,
                    filterSearch: false,
                    //loading: false
                });
            });
        }
        
        //-------------//
        
        //REQUEST MOVIES WITHOUT FILTERING
        if(this.state.searchWithoutFiltering && this.state.moviesORtvshowsSearch=="movies" && this.state.actualSearch=="noFiltering" && this.state.searchType=="noText"){
            console.log("REQUEST MOVIES WITHOUT FILTERING");
            fetch("https://api.themoviedb.org/3/discover/movie?api_key="+apiKey+"&language=en-US&sort_by=popularity.desc&page=1")
            .then(response => response.json())
            .then(json => {
                this.setState({
                    moviesContent: json.results,
                    count: json.total_results,
                    pages: json.total_pages,
                    actualPage: json.page,
                    searchWithoutFiltering: false,
                    //loading: false
                });
            });
        }
        
        //-------------//
        
        //REQUEST TVSHOWS WITHOUT FILTERING
        if(this.state.searchWithoutFiltering && this.state.moviesORtvshowsSearch=="TVshow" && this.state.actualSearch=="noFiltering" && this.state.searchType=="noText"){
            console.log("REQUEST TVSHOWS WITHOUT FILTERING");
            fetch("https://api.themoviedb.org/3/discover/tv?api_key="+apiKey+"&language=en-US&sort_by=popularity.desc&page=1&timezone=America%2FNew_York&include_null_first_air_dates=false")
            .then(response => response.json())
            .then(json => {
                this.setState({
                    tvShowsContent: json.results,
                    count: json.total_results,
                    pages: json.total_pages,
                    actualPage: json.page,
                    searchWithoutFiltering: false,
                    //loading: false
                });
            });
        }
        
        //--------------------------------------------//
        
        //REQUEST FOR CHANGE PAGE FOR MOVIES WITHOUT FILTERING
        if(this.state.changePage && this.state.moviesORtvshowsSearch=="movies" && this.state.actualSearch=="noFiltering" && this.state.searchType=="noText"){
            console.log("REQUEST FOR CHANGE PAGE FOR MOVIES WITHOUT FILTERING");
            fetch("https://api.themoviedb.org/3/discover/movie?api_key="+apiKey+"&language=en-US&sort_by=popularity.desc&page="+this.state.actualPage)
            .then(response => response.json())
            .then(json => {
                this.setState({
                    moviesContent: json.results,
                    /*count: json.total_results,
                    pages: json.total_pages,
                    actualPage: json.page,
                    */changePage: false
                    //loading: false
                });
            });
        }
        
        //-------------//
        
        //REQUEST FOR CHANGE PAGE FOR TVSHOWS WITHOUT FILTERING
        if(this.state.changePage && this.state.moviesORtvshowsSearch=="TVshow" && this.state.actualSearch=="noFiltering" && this.state.searchType=="noText"){
            console.log("REQUEST FOR CHANGE PAGE FOR TVSHOWS WITHOUT FILTERING");
            fetch("https://api.themoviedb.org/3/discover/tv?api_key="+apiKey+"&language=en-US&sort_by=popularity.desc&page="+this.state.actualPage+"&timezone=America%2FNew_York&include_null_first_air_dates=false")
            .then(response => response.json())
            .then(json => {
                this.setState({
                    tvShowsContent: json.results,
                    /*count: json.total_results,
                    pages: json.total_pages,
                    actualPage: json.page,
                    */changePage: false
                    //loading: false
                });
            });
        }
        
        //-------------//
        
        //REQUEST FOR CHANGE PAGE FOR MOVIES WITH FILTERING
        if(this.state.changePage && this.state.moviesORtvshowsSearch=="movies" && this.state.actualSearch=="filtering" && this.state.searchType=="noText"){
            console.log("REQUEST FOR CHANGE PAGE FOR MOVIES WITH FILTERING");
            fetch("https://api.themoviedb.org/3/discover/movie?api_key="+apiKey+"&language=en-US&sort_by=popularity.desc&page="+this.state.actualPage+"&with_genres=" + this.state.genresSearchList)
            .then(response => response.json())
            .then(json => {
                this.setState({
                    moviesContent: json.results,
                    /*count: json.total_results,
                    pages: json.total_pages,
                    actualPage: json.page,
                    */changePage: false
                    //loading: false
                });
            });
        }
        
        //-------------//
        
        //REQUEST FOR CHANGE PAGE FOR TVSHOWS WITH FILTERING
        if(this.state.changePage && this.state.moviesORtvshowsSearch=="TVshow" && this.state.actualSearch=="filtering" && this.state.searchType=="noText"){
            console.log("REQUEST FOR CHANGE PAGE FOR TVSHOWS WITH FILTERING");
           fetch("https://api.themoviedb.org/3/discover/tv?api_key="+apiKey+"&language=en-US&sort_by=popularity.desc&page="+this.state.actualPage+"&timezone=America%2FNew_York&with_genres="+this.state.genresSearchList+"&include_null_first_air_dates=false")
            .then(response => response.json())
            .then(json => {
                this.setState({
                    tvShowsContent: json.results,
                    /*count: json.total_results,
                    pages: json.total_pages,
                    actualPage: json.page,
                    */changePage: false
                    //loading: false
                });
            });
        }
        
        //-------------//
        
        //REQUEST FOR CHANGE PAGE FOR MOVIES WITH SEARCH WITHOUT FILTERING
        if(this.state.changePage && this.state.moviesORtvshowsSearch=="movies" && this.state.actualSearch=="noFiltering" && this.state.searchType=="withText"){
            console.log("REQUEST FOR CHANGE PAGE FOR MOVIES WITH SEARCH WITHOUT FILTERING");
           fetch("https://api.themoviedb.org/3/search/movie?api_key="+apiKey+"&language=en-US&query="+this.state.filter+"&page="+this.state.actualPage+"&include_adult=false")
            .then(response => response.json())
            .then(json => {
                this.setState({
                    moviesContent: json.results,
                    /*count: json.total_results,
                    pages: json.total_pages,
                    actualPage: json.page,
                    */changePage: false
                    //loading: false
                });
            });
        }
        
        //-------------//
        
        //REQUEST FOR CHANGE PAGE FOR TVSHOWS WITH SEARCH WITHOUT FILTERING
        if(this.state.changePage && this.state.moviesORtvshowsSearch=="TVshow" && this.state.actualSearch=="noFiltering" && this.state.searchType=="withText"){
            console.log("REQUEST FOR CHANGE PAGE FOR TVSHOWS WITH SEARCH WITHOUT FILTERING");
           fetch("https://api.themoviedb.org/3/search/tv?api_key="+apiKey+"&language=en-US&page="+this.state.actualPage+"&query="+this.state.filter+"&include_adult=false")
            .then(response => response.json())
            .then(json => {
                this.setState({
                    tvShowsContent: json.results,
                    /*count: json.total_results,
                    pages: json.total_pages,
                    actualPage: json.page,
                    */changePage: false
                    //loading: false
                });
            });
        }
        
        //--------------------------------------------//
        
        //REQUEST FOR SEARCH FOR MOVIES WITHOUT GENRES
        if(this.state.searchWord && this.state.moviesORtvshowsSearch=="movies" && this.state.actualSearch=="noFiltering" && this.state.searchType=="withText"){
            console.log("REQUEST FOR SEARCH FOR MOVIES WITHOUT GENRES");
           fetch("https://api.themoviedb.org/3/search/movie?api_key="+apiKey+"&language=en-US&query="+this.state.filter+"&page=1&include_adult=false")
            .then(response => response.json())
            .then(json => {
                this.setState({
                    moviesContent: json.results,
                    count: json.total_results,
                    pages: json.total_pages,
                    actualPage: json.page,
                    searchWord: false
                });
            });            
        }
        
        //---------------//
        
        //REQUEST FOR SEARCH FOR TVSHOWS WITHOUT GENRES
        if(this.state.searchWord && this.state.moviesORtvshowsSearch=="TVshow" && this.state.actualSearch=="noFiltering" && this.state.searchType=="withText"){
            console.log("REQUEST FOR SEARCH FOR TVSHOWS WITHOUT GENRES");
           fetch("https://api.themoviedb.org/3/search/tv?api_key="+apiKey+"&language=en-US&page=1&query="+this.state.filter+"&include_adult=false")
            .then(response => response.json())
            .then(json => {
                this.setState({
                    tvShowsContent: json.results,
                    count: json.total_results,
                    pages: json.total_pages,
                    actualPage: json.page,
                    searchWord: false
                });
            });            
        }
    
        //---------------//
        
        //REQUEST FOR SEARCH FOR MOVIES WITH GENRES (PROBLEMA: SOLO PARA LA PAGINA 1)
        /*if(this.state.searchWord && this.state.moviesORtvshowsSearch=="movies" && this.state.actualSearch=="filtering"){
           fetch("https://api.themoviedb.org/3/search/movie?api_key="+apiKey+"&language=en-US&query="+this.state.filter+"&page=1&include_adult=false")
            .then(response => response.json())
            .then(json => {
                let moviesFromAPI = json.results;
                let genres = genresArray;
                let moviesWithGenres = [];
            
                moviesFromAPI.map((movie,idx) => checkGenresArrays(genres,movie.genre_ids) ? moviesWithGenres.push(movie) : console.log("movie not included in the search"));
                console.log(moviesWithGenres.length);
                this.setState({
                    moviesContent: moviesWithGenres,
                    count: moviesWithGenres.length,
                    pages: 1,
                    actualPage: 1,
                    searchWord: false
                });
            });     
        }*/
        
        //REQUEST FOR SEARCH FOR MOVIES WITH GENRES (SOLUCION: PARA MAS DE 1 PAGINA)
        if(this.state.searchWord && this.state.moviesORtvshowsSearch=="movies" && this.state.actualSearch=="filtering" && this.state.searchType=="withText"){
            console.log("REQUEST FOR SEARCH FOR MOVIES WITH GENRES (SOLUCION: PARA MAS DE 1 PAGINA)");
            let moviesFromAPI = [];    //aqui guardaremos todas las pelis que vienen de la API
            let genres = genresArray;    //guardamos los generos que tenemos activos
            let moviesWithGenres = [];    //aqui guardaremos todas las pelis que filtraremos
            let pages = 30;               //el numero de paginas que queremos consultar
            
            for(let i=1; i<pages; i++){
                fetch("https://api.themoviedb.org/3/search/movie?api_key="+apiKey+"&language=en-US&query="+this.state.filter+"&page="+i+"&include_adult=false")
                .then(response => response.json())
                .then(json => {
                    //moviesFromAPI.push(json.results);  METODO MAS DIFICIL. TENDRIAMOS UN ARRAY DE 2 DIMENSIONES
                    json.results.map((movie,idx) => moviesFromAPI.push(movie));   //generamos un array de objetos JSON
                    moviesFromAPI.map((movie,idx) => checkGenresArrays(genres,movie.genre_ids) ? moviesWithGenres.push(movie) : console.log("movie not included in the search"));   //filtramos utilizando una funcion
                    /*console.log(moviesWithGenres);
                    console.log(removeDuplicates(moviesWithGenres));
                    console.log("moviesFromAPI:");
                    console.log(moviesFromAPI);
                    console.log("moviesWithGenres:");
                    console.log(moviesWithGenres);*/
                    this.setState({
                        moviesContent: removeDuplicates(moviesWithGenres),
                        count: removeDuplicates(moviesWithGenres).length,
                        pages: 1,
                        actualPage: 1,
                        searchWord: false
                    }); 
                });
            }
        }
        
        //---------------//
        
        //REQUEST FOR SEARCH FOR TVSHOWS WITH GENRES (SOLUCION: PARA MAS DE 1 PAGINA)
        if(this.state.searchWord && this.state.moviesORtvshowsSearch=="TVshow" && this.state.actualSearch=="filtering" && this.state.searchType=="withText"){
            console.log("REQUEST FOR SEARCH FOR TVSHOWS WITH GENRES (SOLUCION: PARA MAS DE 1 PAGINA)");
            let tvFromAPI = [];    //aqui guardaremos todas las tvShows que vienen de la API
            let genres = genresArray;    //guardamos los generos que tenemos activos
            let tvWithGenres = [];    //aqui guardaremos todas las tvShows que filtraremos
            let pages = 30;               //el numero de paginas que queremos consultar
            
            for(let i=1; i<pages; i++){
                fetch("https://api.themoviedb.org/3/search/tv?api_key="+apiKey+"&language=en-US&query="+this.state.filter+"&page="+i+"&include_adult=false")
                .then(response => response.json())
                .then(json => {
                    //tvFromAPI.push(json.results);  METODO MAS DIFICIL. TENDRIAMOS UN ARRAY DE 2 DIMENSIONES
                    json.results.map((tv,idx) => tvFromAPI.push(tv));   //generamos un array de objetos JSON
                    tvFromAPI.map((tv,idx) => checkGenresArrays(genres,tv.genre_ids) ? tvWithGenres.push(tv) : console.log("tv not included in the search"));   //filtramos utilizando una funcion
                    /*console.log(tvWithGenres);
                    console.log(removeDuplicates(tvWithGenres));
                    console.log("tvFromAPI:");
                    console.log(tvFromAPI);
                    console.log("tvWithGenres:");
                    console.log(tvWithGenres);*/
                    this.setState({
                        tvShowsContent: removeDuplicates(tvWithGenres),
                        count: removeDuplicates(tvWithGenres).length,
                        pages: 1,
                        actualPage: 1,
                        searchWord: false
                    }); 
                });
            }
        }
        
    }
    
    //----------------------------------------------------------------------------------------------------------------------//
    
    
    formChange(event){
        let filter=event.target.value;    //guardamos el valor del input, es decir, la ID del genero especifico que viene desde la otra peticion para que sea dinamico
        let inputID=event.target.id;
        let inputElement=document.getElementById(inputID);   //guardamos el elemento para comprobar luego si esta checkeado o no
        
        if(filter=="movies"){         //si el valor es Movies, se refiere al input type radio
            genresArray.length=0;     //reseteamos la array global para no llevar filtros desde una busqueda anterior
            this.setState({
                moviesORtvshowsSearch: "movies",
                genresSearchList: [],
                searchWithoutFiltering: true,
                actualSearch: "noFiltering",
                searchType: "noText"
                //loading: true
            });
            uncheckAll();     //funcion para uncheckear todos los checkbox
        } else if(filter=="TVshow"){    //si el valor es TVShow, se refiere al otro input type radio
            genresArray.length=0
            this.setState({
                moviesORtvshowsSearch: "TVshow",
                genresSearchList: [],
                searchWithoutFiltering: true,
                actualSearch: "noFiltering",
                searchType: "noText"
                //loading: true
            });
            uncheckAll();
        } else {       //si el valor no es ningunon de los otros 2, quiere decir que es un genero, el valor numerico de la ID del genero
            if(inputElement.checked == true){     //si hemos checkeado el checkbox, aplicamos la nueva peticion incluyendo ese genero
                genresArray.push(filter);
                if(this.state.searchType=="noText"){     //debemos comprobar si se ha añadido el genero cuando hay una busqueda tipo SEARCH o DISCOVER. Si es DISCOVER...
                    this.setState({
                        filterSearch: true,
                        genresSearchList: genresArray,
                        actualSearch: "filtering"
                        //loading: true
                    });
                } else if(this.state.searchType=="withText"){    //Si es SEARCH...
                    this.setState({
                        searchWord: true,
                        genresSearchList: genresArray,
                        actualSearch: "filtering"
                        //loading: true
                    });   
                }
                
            } else if(inputElement.checked == false){      //si hemos desactivado el checkbox, eliminamos ese genero de la busqueda
                let index = genresArray.indexOf(filter);     //encontramos el item especifico de la array para borrarlo
                genresArray.splice(index,1);                 //lo borramos con el metodo splice()
                if(genresArray && genresArray.length){       //Si la array no esta vacia...
                    if(this.state.searchType=="noText"){      //Comprobamos si tenemos texto o no...
                        this.setState({
                            genresSearchList: genresArray,
                            filterSearch: true,
                            actualSearch: "filtering"
                            //loading: true
                        });
                    } else if(this.state.searchType=="withText"){      //Si es SEARCH...
                        this.setState({
                            genresSearchList: genresArray,
                            searchWord: true,
                            actualSearch: "filtering"
                            //loading: true
                        });  
                    }
                } else {                   //si la array esta vacia... haremos una busqueda sin generos por defecto
                    if(this.state.searchType=="noText"){      //Comprobamos si tenemos texto o no...
                        this.setState({
                            genresSearchList: null,
                            searchWithoutFiltering: true,
                            actualSearch: "noFiltering"
                            //loading: true
                        });
                    } else if(this.state.searchType=="withText"){      //Si es SEARCH...
                        this.setState({
                            genresSearchList: null,
                            searchWord: true,
                            actualSearch: "noFiltering"
                            //loading: true
                        });
                    }
                }
            }
        }
    }
    
    
    //----------------------------------------------------------------------------------------------------------------------//
    
    
    pageBack(event){
        let pageToGo = this.state.actualPage - 1;
        this.setState({
            changePage: true,
            actualPage: pageToGo
        });
    }
    pageForward(event){
        let pageToGo = this.state.actualPage + 1;
        this.setState({
            changePage: true,
            actualPage: pageToGo
        });
    }
    
    
    //----------------------------------------------------------------------------------------------------------------------//
    
    
    filterChange(event) {
        
        let text = event.target.value;
        
        if(text != ""){    //comprobamos que haya texto. Haremos una busqueda tipo SEARCH
           this.setState({
               filter: event.target.value,
               searchWord: true,
               searchType: "withText"
           });
        } else{      //si borramos el texto... habra que hacer una busqueda sin texto, tipo DISCOVER. Hay que comprobar si tenemos filtros marcados. Utilizamos el state "actualSearch" para hacer la comprobacion
            if(this.state.actualSearch=="filtering"){   // en este caso hacemos una busqueda con generos
               this.setState({
                    filterSearch: true     //activamos la bandera encargada de hacer peticiones con filtros
                });
            } else{   // hacemos una busqueda sin generos
                this.setState({
                    searchWithoutFiltering: true     //activamos la bandera encargada de hacer peticiones sin filtros
                });
            }
            //independientemente del tipo de busqueda, hay que resetear los states:
            this.setState({
               filter: "",
               searchType: "noText"
           });
        }
        
    }
    
    
    //----------------------------------------------------------------------------------------------------------------------//

    render() {
        
        //GENERAMOS LA LISTA DE GENEROS
        let genresForm = this.state.moviesORtvshowsSearch=="movies" ? 
            this.state.moviesGenresInfo.map((genre,idx) =>     //si el state nos marca que estamos mostrando pelis, generamos la lista de generos de pelis dinamicamente
                <FormInputElement type="checkbox" id={["inputMovie"+idx]} name={genre.name} value={genre.id} label={genre.name} checkedBool="false" />
            )
            :
            this.state.tvShowsGenresInfo.map((genre,idx) =>
                <FormInputElement type="checkbox" id={["inputTVshow"+idx]} name={genre.name} value={genre.id} label={genre.name} checkedBool="false" />
            ) 
        ;
        
        //----------------------//
        
        //GENERAMOS EL CONTENIDO DE PELIS O SERIES
        let content = this.state.moviesORtvshowsSearch=="movies" ?   //generamos todo el contenido de peliculas o series

            this.state.moviesContent.map((movie,idx) =>
                <Link to={'/movieDetails/'+movie.id}>
                    <Movie data={movie} />
                </Link>
                ///
            )
            :
            this.state.tvShowsContent.map((show,idx) =>
                <Link to={'/tvShowDetails/'+show.id}>
                    <TVShow data={show} />
                </Link>
                ///
            );
                                          
        //----------------------//
               

        
        let message = this.state.searchType=="withText" ? 
        <h3>You have searched for <label className="highlight">"{this.state.filter}"</label></h3> 
        : 
        this.state.pages - this.state.actualPage == 0 ? 
        <h3>You have discovered all the <label className="highlight">{this.state.moviesORtvshowsSearch}</label>, you are a real cinema addict!</h3> 
        : 
        <h3>There are still <label className="highlight">{this.state.pages - this.state.actualPage}</label> more pages and <label className="highlight">{this.state.count - (20*this.state.actualPage)}</label> {this.state.moviesORtvshowsSearch} !</h3>;
        
        let firstPageDisabled = this.state.actualPage==1 ? <input type="button" value="<" onClick={this.pageBack} disabled /> : <input type="button" value="<" onClick={this.pageBack} />;
        let lastPageDisabled = this.state.actualPage==this.state.pages ? <input type="button" value=">" onClick={this.pageForward} disabled /> : <input type="button" value=">" onClick={this.pageForward} />
                                          
        //----------------------//                                 
        
        return (
            <div>
                <div className="formulario">
                    <FormInfoElement data="Search" />
                    <input type="text" id="inputSearch" onChange={this.filterChange} placeholder={["Search "+this.state.moviesORtvshowsSearch+"!"]} />
                    <form id="formulario" onChange={this.formChange}>
                        <FormInfoElement data="Discover" />
                        <FormInputElement type="radio" id="discoverMovies" name="type" value="movies" label="Movies" checkedBool="true" />
                        <FormInputElement type="radio" id="discoverTVshows" name="type" value="TVshow" label="TV Shows" checkedBool="false" />
                        <FormInfoElement data="Genres" />
                        {genresForm}
                    </form>
                </div>
            <div id="background">
                <div className="contenido">
                    <div>
                        <ResultsCount count={this.state.count}/>
                    </div>
                    <div>
                        {content}
                    </div>
                    <div className="pagesContent">
                        {message}
                        <form onClick={this.pageChange}>
                            {firstPageDisabled}
                            {this.state.actualPage}
                            {lastPageDisabled}
                        </form>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}