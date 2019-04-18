import React, {Component} from 'react';

class NewUser extends Component {

    //new user form submission event handler
    formSubmit = (e) => {
        e.preventDefault();
        fetch('/users/newuser', {
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
            .then(returnedData => console.log(returnedData))
    };

    render() {
        return (
            //new user form
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
                    <input type="submit" value={'create new user'}/>
                </div>
            </form>
        );
    }
}

export default NewUser;
