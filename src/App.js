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
    };
  }
  handleLogin = (loginState) => {
    this.setState({
      loginState: loginState,
    });
  };
  render() {
    return (
      <div className="App">
        {this.state.loginState ? (
          <div>
            <Logout handleLogin={this.handleLogin}/>
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
