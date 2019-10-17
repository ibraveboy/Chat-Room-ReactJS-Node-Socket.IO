import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Layout from "./Layout";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ChatRoom from "./pages/ChatRoom";


class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Switch>
            <Route path="/" component={Login} exact/>
            <Route path="/chatroom" component={ChatRoom} />
            <Route path="/*" component={NotFound} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
