import React, {Component} from 'react';

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            bookArray: [],
            mapArray: [],
        }
    }

    //BROKEN
    componentDidMount() {
        // this.checkForUser()
    }
    //BROKEN COOKIE CHECK
    checkForUser() {
        fetch('/users')
            .then(data => data.text())
            .then(response => {
                if (response) { this.props.loggedInUser(response,true)}
                else {this.props.loggedInUser(null,false)}
            });
    }

    //login form submission event handler
    formSubmit = (e) => {
        e.preventDefault();
        fetch('/users/login', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value,
            })
        })
            .then(data => data.text())
            .then(returnedData => {
                if (returnedData) {
                    this.props.loggedInUser(returnedData,true);
                    // this.bookFetch()
                } else {
                    this.props.loggedInUser(null,false)
                }
            })

    };

    //grab user books BROKEN?
    bookFetch = () => {
        fetch('/users/search')
            .then(data => data.text())
            .then(data => this.setState({bookArray:data.books}, () => this.mapBooks()))
    };

    //map user books BROKEN?
    mapBooks(){
        let mapArray = [];
        console.log(this.state.bookArray);
        let tempArray = [];
        if(this.state.bookArray)
            tempArray = this.state.bookArray;
        if(tempArray.length>0) {
            mapArray = this.state.bookArray.map(
                (eachElement, index) => {
                    return (<div key={index}>
                        <p>{eachElement}</p>
                    </div>)
                }
            );
            console.log(mapArray);
        }
        else {
            console.log("no books");
            mapArray = [];
        }
        this.setState({bookArray:mapArray});
    }

    //add a book
    bookFormSubmit = (e) => {
        e.preventDefault();
        fetch('/users/newbook', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: this.props.username,
                books: e.target.books.value,
            })
        })
    };

    render() {
        //if the user is logged in
        if (this.props.username) {
            //list books and add a book form
            return (
                <div>
                    <h1>Welcome Back {this.props.username}</h1>

                    <form className={"formStyle"} onSubmit={this.bookFormSubmit}>
                        <div>
                            <label htmlFor={"books"}>Book Title: </label>
                            <input type="text" name={"books"} id={"books"}/>
                        </div>
                        <br/>
                        <div>
                            <input type="submit" value={"add book"}/>
                        </div>
                    </form>
                    <div>
                        <h3>Your Books</h3>
                        {this.state.bookArray}
                    </div>
                </div>

            )
        //if the user is not logged in
        } else {
            return (
                //render login form
                <div>
                    <h1>Login</h1>
                    <form className={"formStyle"} onSubmit={this.formSubmit}>
                        <div>
                            <label htmlFor={'username'}>Username: </label>
                            <input type="text" id={'username'} name={'username'}/>
                        </div>
                        <br/>
                        <div>
                            <label htmlFor={'password'}>Password: </label>
                            <input type="password" id={'password'} name={'password'}/>
                        </div>
                        <br/>
                        <div>
                            <input type="submit" value={'existing user login'}/>
                        </div>
                    </form>
                </div>

            )
        }

    }
}

export default HomePage;
