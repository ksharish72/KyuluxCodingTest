import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import axios from "axios";
import { Button, Dialog, DialogTitle } from "@material-ui/core";
// import 'bootstrap/dist/css/bootstrap.min.css';
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

const { SearchBar } = Search;
class DrugTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drugData: null,
      columns: [],
      openViewDataDialog: false,
      dialogWindowData: [],
      modalWindowHistory: [],
    };
  }
  viewData(event, cell) {
    this.appendUniqueKey(cell);

    this.setState((prevstate) => ({
      openViewDataDialog: true,
      dialogWindowData: cell,
      modalWindowHistory: [...prevstate.modalWindowHistory, cell],
    }));
  }

  findMaxColums(list) {
    var max = -1;
    var maxKeyObj = null;
    for (var i = 0; i < list.length; i++) {
      var obj = list[i];
      var noOfObjKeys = Object.keys(obj).length;
      if (noOfObjKeys > max) {
        max = noOfObjKeys;
        maxKeyObj = obj;
      }
    }
    var columns = [];
    for (var key in maxKeyObj) {
      if (
        typeof maxKeyObj[key] === "object" &&
        !Array.isArray(maxKeyObj[key])
      ) {
        for (var tempKey in maxKeyObj[key]) {
          var dataFieldCombined = `${key}.${tempKey}`;
          var obj = {
            dataField: dataFieldCombined,
            text: dataFieldCombined,
            headerStyle: (colum, colIndex) => {
              return {
                width: "250px",
                textAlign: "center",
                wordBreak: "break-all",
              };
            },
            formatter: (cell) => {
              return cell;
            },
          };
          columns.push(obj);
        }
      } else {
        var obj = {
          dataField: key,
          text: key,
          sort: !Array.isArray(maxKeyObj[key]) && true,
          headerStyle: (colum, colIndex) => {
            return {
              width: "250px",
              textAlign: "center",
              wordBreak: "break-all",
            };
          },
          formatter: (cell) => {
            if (Array.isArray(cell)) {
              return (
                <Button
                  onClick={(e) => this.viewData(e, cell)}
                  variant="contained"
                  color="primary"
                >
                  View Data
                </Button>
              );
            }
            return cell;
          },
        };
        columns.push(obj);
      }
    }

    return columns;
  }

  appendUniqueKey(list) {
    for (var i = 0; i < list.length; i++) {
      var obj = list[i];
      if (typeof obj === "object") {
        obj["key"] = Math.floor(1000 + Math.random() * 9000);
      } else if (typeof obj === "string") {
        list[i] = {
          key: Math.floor(1000 + Math.random() * 9000),
          value: obj,
        };
      }
    }
  }
  componentDidMount() {
    axios.get(`https://api.fda.gov/drug/drugsfda.json?limit=99`).then((res) => {
      const drugData = res.data;
      const results = drugData["results"];
      this.appendUniqueKey(results);
      results.sort((a, b) => {
        if (a.hasOwnProperty("openfda") && !b.hasOwnProperty("openfda")) {
          return -1;
        } else if (
          !a.hasOwnProperty("openfda") &&
          b.hasOwnProperty("openfda")
        ) {
          return 1;
        }
        return 0;
      });
      const columns = this.findMaxColums(results);
      this.setState({ drugData, columns: columns });
    });
  }
  renderTable(results, columns) {
    const keyColumn = columns.length > 0 ? "key" : null;
    return (
      <div>
        <ToolkitProvider
          keyField={keyColumn}
          data={results}
          columns={columns}
          search
        >
          {(props) => (
            <div>
              {results.length > 0 && (
                <div>
                  <div
                    style={{
                      display: "inline-flex",
                      width: "-webkit-fill-available",
                    }}
                  >
                    <h3>Search by keyword</h3>
                    <SearchBar {...props.searchProps} />
                  </div>
                  <hr />

                  <BootstrapTable
                    pagination={paginationFactory()}
                    {...props.baseProps}
                  />
                </div>
              )}
            </div>
          )}
        </ToolkitProvider>
      </div>
    );
  }

  handleClose = () => {
    var history = this.state.modalWindowHistory;
    history.pop();
    if (history.length == 0) {
      this.setState({
        openViewDataDialog: false,
      });
    } else {
      var data = history[history.length - 1];
      this.setState({
        dialogWindowData: data,
      });
    }
  };
  render() {
    const dialogWindowData = this.state.dialogWindowData;
    const drugData = this.state.drugData;
    const columns = this.state.columns;
    const results = drugData != null ? drugData["results"] : [];
    const open = this.state.openViewDataDialog;
    const dialogWindowColumns = this.findMaxColums(dialogWindowData);
    let closeImg = {
      cursor: "pointer",
      float: "right",
      marginTop: "5px",
      width: "20px",
    };

    return (
      <div>
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="simple-dialog-title"
          open={open}
        >
          <DialogTitle id="simple-dialog-title">
            <img
              src="https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png"
              onClick={this.handleClose}
              style={closeImg}
            />
          </DialogTitle>
          {this.renderTable(dialogWindowData, dialogWindowColumns)}
        </Dialog>
        {this.renderTable(results, columns)}
      </div>
    );
  }
}

export default DrugTable;
