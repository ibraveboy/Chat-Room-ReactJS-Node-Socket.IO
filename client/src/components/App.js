import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Layout from "./Layout";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ChatRoom from "./pages/ChatRoom";
import Private from "./pages/Private";



class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Switch>
            <Route path="/" component={Login} exact/>
            <Route path="/chatroom/:username/:room" component={ChatRoom} />
            <Route path="/private/:sID/:rID" component={Private} />
            <Route path="/*" component={NotFound} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
