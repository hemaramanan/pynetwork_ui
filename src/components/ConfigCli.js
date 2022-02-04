import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import axios from "axios";

class ConfigCli extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      ErrorMessages: [],
      SucessMessages: {},
      selectedRows: [],
      setIserror: false,
      setIssucess: false,
    };
  }

  tableStyle = {
    marginRight: 20,
  };

  field = {
    marginTop: 10,
    marginBottom: 10,
    display: "block",
  };

  fetchDevices() {
    fetch(process.env.REACT_APP_PYNETWORK_URL + "/inventory/devices/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        this.setState({ devices: data });
      });
  }

  ConfigCli(resolve) {
    const commandsList = document
      .getElementById("showCLIinput")
      .value.split(/\n/);
    // console.log(commandsList)
    console.log(commandsList);

    const errorList = [];
    const sucessList = [];
    const selectedDevices = [];
    for (let x of this.state.selectedRows) {
      const hostName = x["host"];
      selectedDevices.push(hostName);
    }
    const formatedDatatoSend = { devices: selectedDevices };
    formatedDatatoSend.commands = commandsList;
    axios({
      method: "post",
      url: process.env.REACT_APP_PYNETWORK_URL + "/inventory/config/cisco/",
      data: formatedDatatoSend,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        console.log(res.data.response);
        const actualResp = res.data.response;
        for (const [key, value] of Object.entries(actualResp)) {
          const msg = String(key) + " - " + String(value);
          console.log("KEY>>>>>>", key);
          console.log("VALUE>>>>>>", value);

          if (msg.includes("Error")) {
            console.log("Error", msg);
            errorList.push(msg);
            this.setIserror = true;
          } else {
            console.log("Sucesss", String(key));
            // console.log(actualResp)
            sucessList.push({ key: value });
            this.setIssucess = true;
          }
        }

        this.ErrorMessages = errorList;
        this.SucessMessages = actualResp;
        console.log("SucessMessages - ", this.SucessMessages);
        this.fetchDevices();
        resolve();
      })
      .catch((error) => {
        const msg = "Cannot add data. Server error!";
        errorList.push(msg);
        this.ErrorMessages = errorList;
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
      <div>
        <h2>Config CLI</h2>
        <Grid container>
          <Grid item ms={4} style={this.tableStyle}>
            <form noValidate autoComplete="off">
              <TextField
                label="Configurations in seperate lines"
                fullWidth
                variant="outlined"
                id="showCLIinput"
                minRows="5"
                multiline="true"
              ></TextField>
              <Button
                onClick={() => {
                  new Promise((resolve) => {
                    this.ConfigCli(resolve);
                  });
                }}
                color="secondary"
                variant="contained"
                style={this.field}
              >
                Config Execution
              </Button>
            </form>
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/icon?family=Material+Icons"
            />
            <MaterialTable
              title=""
              columns={[
                { title: "Hostname", field: "host", defaultSort: "asc" },
              ]}
              data={devices.devices}
              onSelectionChange={(rows) =>
                this.setState({ selectedRows: rows })
              }
              options={{ selection: true }}
            />
          </Grid>
          <Grid item ms={8}>
            {this.setIssucess && (
              <table border="1">
                <tbody>
                  {Object.keys(this.SucessMessages).map((val, index) => (
                    <tr key={val}>
                      <td>
                        <pre>{val}</pre>
                      </td>
                      <td>
                        {this.SucessMessages[val].map((row) => (
                          <tr key={row}>
                            <td>
                              <pre>{row}</pre>
                            </td>
                            <br />
                          </tr>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default ConfigCli;
