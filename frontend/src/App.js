import './App.scss';
//import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js'
import Navbar from './components/navbar';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Additem from './pages/Additem';
import Addrequest from './pages/Addrequest';
import Seeitems from './pages/Seeitems';
import Requests from './pages/Requests';
import Request from './pages/Request';
import ShelterRequests from './pages/ShelterRequests';
import mltest from './pages/mltest';

function App() {

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/profile" exact component={Profile} />
          <Route path="/mltest" exact component={mltest} />
          <Route path="/additem" exact component={Additem} />
          <Route path="/addrequest" exact component={Addrequest} />
          <Route path="/seeitems" exact component={Seeitems} />
          <Route path="/requests" exact component={Requests} />
          <Route path="/request/:reqID" component={Request} />
          <Route path="/shelterrequests" component={ShelterRequests} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
