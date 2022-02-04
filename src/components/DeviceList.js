import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";

class DeviceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
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

  componentDidMount() {
    this.fetchDevices();
  }

  render() {
    const { devices } = this.state;
    console.log("Rendering", devices);
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
          <h2>Inventory</h2>
        </Grid>
        <MaterialTable
          title=""
          columns={[
            { title: "Hostname", field: "host", defaultSort: "asc" },
            { title: "Username", field: "username" },
            { title: "SSH Port", field: "port" },
            { title: "Password", field: "password", hidden: true },
          ]}
          data={devices.devices}
          options={{ exportButton: true, exportAllData: true }}
        />
      </div>
    );
  }
}
export default DeviceList;
