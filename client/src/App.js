import React, { Component } from 'react';
import './App.css';
import HomePage from "./components/HomePage";
import {BrowserRouter as Router,Route, Link} from "react-router-dom";
import NewUser from "./components/NewUser";
import LogOut from "./components/LogOut";

class App extends Component {

    //user info to be passed to children
    constructor(props) {
        super(props);
        this.state = {
            username:null,
            isLoggedIn:false
        }
    }

    //user info function to be passed to children
    loggedInUser = (username,isLoggedIn) => {
        this.setState({
            username:username,isLoggedIn:isLoggedIn
        })
    };

    //log out on click event handler
    logOutUser = () =>{
        this.setState({username:null, isLoggedIn:false})
    };

    render() {
    return (
      <div className="App">
          {/*link to other pages*/}
          <Router>
              <div className="App">
                  <h1>Books</h1>
                  <Link className={"linkStyle"} to={'/'}>Home</Link>
                  <Link className={"linkStyle"} to={'/newUser'}>Register</Link>
                  <Link className={"linkStyle"} to={'/logout'} onClick={this.logOutUser}>Logout</Link>
              </div>
              <Route path={'/newUser'} component={NewUser}/>
              <Route path={'/logout'} component={LogOut}/>
              <Route exact path={'/'} component={()=>{return <HomePage loggedInUser={this.loggedInUser} username={this.state.username} />} }/>
          </Router>
      </div>
    );
  }
}

export default App;
