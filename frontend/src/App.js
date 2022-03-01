import React from "react";
import './App.css';
import Login from "./views/Login";
import {HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import ChatRoom from "./views/ChatRoom";


class App extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return <Router>
            <Switch>
                <Route path={"/"} exact>
                    <Redirect to={"/login"}/>
                </Route>
                {/* */}
                <Route path={"/login"} exact component={Login}>
                </Route>
                {/* */}
                <Route path={"/chatroom"} exact component={ChatRoom}>
                </Route>
            </Switch>
        </Router>
    }
}

export default App
