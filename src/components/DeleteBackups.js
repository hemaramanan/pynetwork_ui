import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import axios from "axios";

class DeleteBackups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backups: [],
      ErrorMessages: [],
      setIserror: false,
    };
  }
  fetchBackups() {
    fetch(process.env.REACT_APP_PYNETWORK_URL + "/inventory/backup/cisco/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        const temDat = [data["response"]];
        //   console.log('StemDATA:', temDat[0]);
        const arr = [];
        for (let key of temDat[0]) {
          const obj = {};
          console.log("print KEY", key);
          obj.name = key;
          arr.push(obj);
        }
        this.setState({ backups: arr });
      });
  }

  backupDelete(backupFileInfo, resolve) {
    const sendRow = { fileName: [backupFileInfo.name] };
    console.log("sednROW", sendRow);
    axios({
      method: "delete",
      url: process.env.REACT_APP_PYNETWORK_URL + "/inventory/backup/cisco/",
      data: sendRow,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        console.log(res);
        this.fetchBackups();
        resolve();
      })
      .catch((error) => {
        this.ErrorMessages.push("Cannot add data. Server error!");
        this.setIserror = true;
        this.fetchDevices();
        resolve();
      });
  }

  componentDidMount() {
    this.fetchBackups();
  }

  render() {
    const { backups } = this.state;
    console.log("Rendering", backups);

    const column = "Configuration List";
    // console.log(backups.response)
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
          <h2>Delete Backup Configurations</h2>
          <Button
            variant="contained"
            onClick={() => {
              this.fetchBackups();
            }}
          >
            Retrive Files
          </Button>
        </Grid>
        <MaterialTable
          columns={[{ title: "Backups Names", field: "name" }]}
          data={backups}
          title="Backup Files"
          editable={{
            onRowDelete: (backupFileInfo) =>
              new Promise((resolve) => {
                this.backupDelete(backupFileInfo, resolve);
              }),
          }}
          options={{ exportButton: true, exportAllData: true }}
        />
      </div>
    );
  }
}
export default DeleteBackups;
