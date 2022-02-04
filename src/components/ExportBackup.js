import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import axios from "axios";
import GetAppIcon from "@material-ui/icons/GetApp";

class ExportBackup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backups: [],
      selectedRows: [],
    };
  }
  fetchBackups() {
    fetch(process.env.REACT_APP_PYNETWORK_URL + "/inventory/backup/cisco/")
      .then((response) => response.json())
      .then((data) => {
        // console.log("Success:", data);
        const temDat = [data["response"]];
        //   console.log('StemDATA:', temDat[0]);
        const arr = [];
        for (let key of temDat[0]) {
          const obj = {};
          //   console.log("print KEY", key);
          obj.name = key;
          arr.push(obj);
        }
        this.setState({ backups: arr });
      });
  }

  exportBackup(resolve) {
    const selectedFiles = [];
    // const sendData = {}
    for (let x of this.state.selectedRows) {
      selectedFiles.push(x["name"]);
    }
    const sendRow = { configfiles: selectedFiles };
    // console.log("sednROW", sendRow);
    axios({
      method: "post",
      url:
        process.env.REACT_APP_PYNETWORK_URL + "/inventory/backup/cisco/export/",
      data: sendRow,
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Backup_config.zip");
        document.body.appendChild(link);
        link.click();

        this.fetchBackups();
      })
      .catch((error) => {
        console.log("catch one error", error);
        this.fetchBackups();
      });
  }

  componentDidMount() {
    this.fetchBackups();
  }

  render() {
    const { backups } = this.state;
    // console.log("Rendering", backups);
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
          <h2>Export Backup</h2>
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
          columns={[{ title: "Backup file name", field: "name" }]}
          data={backups}
          title=""
          onSelectionChange={(rows) => this.setState({ selectedRows: rows })}
          options={{ selection: true, exportAllData: true }}
          actions={[
            {
              icon: () => <GetAppIcon />,
              tooltip: "Download selected files",
              onClick: () =>
                new Promise((resolve) => {
                  this.exportBackup(resolve);
                }),
            },
          ]}
        />
      </div>
    );
  }
}
export default ExportBackup;
