import React from "react";
import IndexPage from './IndexPage';
import movieDetails from './components/movieDetails';
import tvShowDetails from './components/tvShowDetails';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


export default class App extends React.Component {
    render(){    
        return(
            <Router>
            <div>
                <Switch>
                  <Route exact path="/">
                    <IndexPage />
                  </Route>
                  <Route path="/movieDetails/:detailsId" component={movieDetails} />
                  <Route path="/tvShowDetails/:detailsId" component={tvShowDetails} />
                </Switch>
            </div>
            </Router>
        );
    }
}

