import logo from "./logo.svg";
import "./App.css";
import DrugTable from "./DrugTable";
import Login from "./Login";
import Logout from "./Logout";
import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginState: false,
      profileObj: null,
    };
  }
  handleLogin = (loginState, profileObj) => {
    this.setState({
      loginState: loginState,
      profileObj: profileObj,
    });
  };
  render() {
    return (
      <div className="App">
        {this.state.loginState ? (
          <div>
            <div style={{ display: "inline-flex", height: "50px" }}>
              <img src={this.state.profileObj.imageUrl} />
              <h3>Welcome {this.state.profileObj.name}!</h3>

              <Logout handleLogin={this.handleLogin} />
            </div>
            <DrugTable />
          </div>
        ) : (
          <Login handleLogin={this.handleLogin} />
        )}
      </div>
    );
  }
}
export default App;
