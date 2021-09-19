import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import BuildIcon from "@material-ui/icons/Build";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";

class CreateBackups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      ErrorMessages: [],
      SucessMessages: [],
      selectedRows: [],
      setIserror: false,
      setIssucess: false,
    };
  }

  tableStyle = {
    width: `calc(100% - 240px)`,
    marginLeft: "240px",
  };

  fetchDevices() {
    fetch(process.env.REACT_APP_PYNETWORK_URL + "/inventory/devices/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        this.setState({ devices: data });
      });
  }

  createBackup(resolve) {
    const errorList = [];
    const sucessList = [];
    const selectedDevices = [];
    // const sendData = {}
    for (let x of this.state.selectedRows) {
      const hostName = x["host"];
      selectedDevices.push(hostName);
    }
    const formatedDatatoSend = { devices: selectedDevices };
    // console.log("formatedDatatoSend devices",formatedDatatoSend)
    axios({
      method: "post",
      url: process.env.REACT_APP_PYNETWORK_URL + "/inventory/backup/cisco/",
      data: formatedDatatoSend,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        console.log(res.data.response);
        const actualResp = res.data.response;
        for (const [key, value] of Object.entries(actualResp)) {
          const msg = String(key) + " - " + String(value);
          if (msg.includes("completed")) {
            console.log("Completed", msg);
            sucessList.push(msg);
            this.setIssucess = true;
          }
          if (!msg.includes("completed")) {
            console.log("Problem", msg);
            errorList.push(msg);
            this.setIserror = true;
          }
        }

        this.ErrorMessages = errorList;
        this.SucessMessages = sucessList;
        this.fetchDevices();
        resolve();
      })
      .catch((error) => {
        this.state.ErrorMessages.push("Cannot add data. Server error!");
        this.setIserror = true;
        this.fetchDevices();
        resolve();
      });
  }

  componentDidMount() {
    this.fetchDevices();
  }

  render() {
    const { devices } = this.state;
    return (
      <div className="container" style={{ maxWidth: "100%" }}>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <h2>Create config backups</h2>
          <Button
            variant="contained"
            onClick={() => {
              this.fetchDevices();
            }}
          >
            Retrive Nodes
          </Button>
        </Grid>
        <Grid iteam direction="column">
          <div float="right">
            {this.setIserror && (
              <Alert severity="error">
                {this.ErrorMessages.map((msg, i) => {
                  return <div key={i}>{msg}</div>;
                })}
              </Alert>
            )}
          </div>
          <div>
            {this.setIssucess && (
              <Alert severity="success">
                {this.SucessMessages.map((msg, i) => {
                  return <div key={i}>{msg}</div>;
                })}
              </Alert>
            )}
          </div>
        </Grid>
        <Grid>
          <MaterialTable
            className="tableStyle"
            title="Device list"
            columns={[{ title: "Hostname", field: "host", defaultSort: "asc" }]}
            data={devices.devices}
            onSelectionChange={(rows) => this.setState({ selectedRows: rows })}
            options={{
              selection: true,
              exportAllData: true,
            }}
            actions={[
              {
                icon: () => <BuildIcon />,
                tooltip: "Delete all selected rows",
                onClick: () =>
                  new Promise((resolve) => {
                    this.createBackup(resolve);
                  }),
              },
            ]}
          />
        </Grid>
      </div>
    );
  }
}
export default CreateBackups;
