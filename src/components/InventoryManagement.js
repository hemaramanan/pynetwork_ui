import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";

class InventoryManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      ErrorMessages: [],
      setIserror: false,
    };
  }
  fetchDevices() {
    fetch(process.env.REACT_APP_PYNETWORK_URL + "/inventory/devices/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        this.setState({ devices: data });
      });
  }
  deviceAdd(newDeviceInfo, resolve) {
    //validation
    let errorList = [];
    if (
      newDeviceInfo.host === undefined ||
      this.validateIP(newDeviceInfo.host) === false
    ) {
      errorList.push("Please enter a valid IP Address");
    }
    if (newDeviceInfo.username === undefined) {
      errorList.push("Please enter the Username");
    }
    if (newDeviceInfo.password === undefined) {
      errorList.push("Please enter a password");
    }
    if (newDeviceInfo.port === undefined) {
      newDeviceInfo.port = 22;
      console.log(newDeviceInfo.port);
    }

    if (this.validatePort(newDeviceInfo.port) === false) {
      errorList.push("Please enter a valid port");
    }

    if (errorList.length < 1) {
      //no error
      console.log("SendROWDELETE", newDeviceInfo);
      axios({
        method: "post",
        url: "http://192.168.100.100:5000/inventory/devices/",
        data: newDeviceInfo,
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          this.ErrorMessages = null;
          this.setIserror = false;
          this.fetchDevices();
          resolve();
        })
        .catch((error) => {
          this.fetchDevices();
          resolve();
          this.ErrorMessages.push("Cannot add data. Server error!");
          this.setIserror = true;
        });
    } else {
      this.ErrorMessages = errorList;
      this.setIserror = true;
      this.fetchDevices();
      resolve();
    }
  }
  deviceUpdate(newDeviceInfo, oldDeviceInfo, resolve) {
    //validation
    let errorList = [];
    if (newDeviceInfo.host !== oldDeviceInfo.host) {
      errorList.push(
        "Not allowed to change the IP but You can delete the record"
      );
    }
    if (newDeviceInfo.username === undefined) {
      errorList.push("Please enter the Username");
    }
    if (newDeviceInfo.password === undefined) {
      errorList.push("Please enter a password");
    }
    if (newDeviceInfo.port === undefined) {
      newDeviceInfo.port = 22;
      console.log(newDeviceInfo.port);
    }

    if (errorList.length < 1) {
      axios({
        method: "patch",
        url: "http://192.168.100.100:5000/inventory/devices/device/",
        data: newDeviceInfo,
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          this.ErrorMessages = null;
          this.setIserror = false;
          this.fetchDevices();
          resolve();
        })
        .catch((error) => {
          this.ErrorMessages.push("Cannot add data. Server error!");
          this.setIserror = true;
          this.fetchDevices();
          resolve();
        });
    } else {
      this.ErrorMessages = errorList;
      this.setIserror = true;
      this.fetchDevices();
      resolve();
    }
  }

  inventoryManagement(oldDeviceInfo, resolve) {
    const sendRow = { host: oldDeviceInfo.host };
    console.log(sendRow);
    axios({
      method: "delete",
      url: "http://192.168.100.100:5000/inventory/devices/device/",
      data: sendRow,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        this.fetchDevices();
        resolve();
      })
      .catch((error) => {
        this.ErrorMessages.push("Cannot add data. Server error!");
        this.setIserror = true;
        this.fetchDevices();
        resolve();
      });
  }

  validateIP(host) {
    const regIPP =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regIPP.test(String(host));
  }

  validatePort(port) {
    if (port >= 0 && port <= 65535) return true;
  }

  componentDidMount() {
    this.fetchDevices();
  }

  render() {
    const { devices } = this.state;
    return (
      <div className="container" style={{ maxWidth: "100%" }}>
        <div>
          {this.setIserror && (
            <Alert severity="error">
              {this.ErrorMessages.map((msg, i) => {
                return <div key={i}>{msg}</div>;
              })}
            </Alert>
          )}
        </div>
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
          <h2>Inventory Management</h2>
          <Button
            variant="contained"
            onClick={() => {
              this.fetchDevices();
            }}
          >
            Referesh Table
          </Button>
        </Grid>
        <MaterialTable
          title=""
          columns={[
            { title: "Hostname", field: "host", defaultSort: "asc" },
            { title: "Username", field: "username" },
            { title: "SSH Port", field: "port" },
            { title: "Password", field: "password" },
          ]}
          data={devices.devices}
          editable={{
            onRowUpdate: (newDeviceInfo, oldDeviceInfo) =>
              new Promise((resolve) => {
                this.deviceUpdate(newDeviceInfo, oldDeviceInfo, resolve);
              }),
            onRowAdd: (newDeviceInfo) =>
              new Promise((resolve) => {
                this.deviceAdd(newDeviceInfo, resolve);
              }),
            onRowDelete: (oldDeviceInfo) =>
              new Promise((resolve) => {
                this.inventoryManagement(oldDeviceInfo, resolve);
              }),
          }}
        />
      </div>
    );
  }
}
export default InventoryManagement;
