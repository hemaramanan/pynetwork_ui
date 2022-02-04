import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";

class BackupList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backups: [],
    };
  }
  fetchBackups() {
    const arr = [];
    fetch(process.env.REACT_APP_PYNETWORK_URL + "/inventory/backup/cisco/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        const temDat = [data["response"]];
        for (let x of temDat) {
          const newOb = { name: x };
          arr.push(newOb);
        }
        this.setState({ backups: arr });
        console.log("ConvertData:", arr);
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
          <h2>Backup Configuration list</h2>
        </Grid>
        <MaterialTable
          columns={[{ title: "Backups Names", field: "name" }]}
          data={backups}
          options={{ exportButton: true, exportAllData: true }}
          title="Config Files"
        />
      </div>
    );
  }
}
export default BackupList;
