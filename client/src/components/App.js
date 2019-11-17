import React, { Component,lazy,Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Layout from "./Layout";
import NotFound from "./pages/NotFound";
// import Login from "./pages/Login";
// import ChatRoom from "./pages/ChatRoom";
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ChatRoom = lazy(()=> import('./pages/ChatRoom'))
import Private from "./pages/Private";
const SelectRoom =lazy(()=> import("./pages/SelectRoom"));



class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Suspense fallback={<div>Loading</div>}>
            <Switch>
              <Route path="/" component={Login} exact />
              <Route path="/register" component={Register} />
              <Route path="/room" component={SelectRoom} />
              <Route path="/chatroom" component={ChatRoom} />
              <Route path="/private/:rID" component={Private} />
              <Route path="/*" component={NotFound} />
            </Switch>
          </Suspense>
        </Layout>
      </Router>
    );
  }
}

export default App;
