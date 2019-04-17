import React, {Component} from 'react';

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            username: null,
            isLoggedIn: false,
            bookArray: [],
            bookMap: ""
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
                if (response) {
                    this.setState(
                        {
                            username: response,
                            isLoggedIn: true,
                        });
                }
                else {
                    this.setState({
                            logInfo: {
                                username: undefined,
                                loggedIn: false,
                            }
                        });
                }
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
                    this.setState({username: returnedData})
                } else {
                    this.setState({message: "Login Failed"})
                }
            })

    };

    //grab user books
    bookFetch = () => {
        fetch('/users/booksearch')
            .then(data => data.json())
            .then(data => console.log(data))
        // .then(() => this.mapBooks())


    };

    //map user books BROKEN?
    // mapBooks = () => {
    //     let bookMap = this.state.bookArray.map((eachBook) => {
    //         return (
    //             <div>
    //                 <p>Title: {eachBook}</p>
    //             </div>
    //         )
    //     });
    // };

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
                username: this.state.username,
                books: e.target.books.value,
            })
        })
    };

    render() {
        //if the user is logged in
        if (this.state.username) {
            // this.bookFetch();
            //list books and add a book form
            return (
                <div>
                    <h1>Welcome Back {this.state.username}</h1>

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
                        {/*{this.state.bookArray}*/}
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
