const jq = require("jquery"),
  main = require("electron").remote.require("./main");

function createServerList() {
  const jsonServers = require("../assets/servers.json");
  if (jsonServers && jsonServers.length > 0) {
    jq("#serverList").append("<!-- AUTO GENERATED BY THE CONTROLLER -->");
    let cpt = 0;
    for(server of jsonServers) {
      let tableRow = jq("<tr/>");
      let name = jq("<td/>").append(server.name);
      let ip = jq("<td/>").append(server.ip);
      let port = jq("<td/>").append(server.port);

      tableRow.attr("id", cpt);
      tableRow.append([name, ip, port]);
      tableRow.click(e => {
        let serverID = parseInt(e.currentTarget.id);
        console.log(main.selectedServer(serverID));
      });

      jq("#serverList").append(tableRow);
      cpt++;
    }
  }
}

function createFavoriteServerList() {
}

jq(document).ready(() => {
  createServerList();

  jq("#addServer").click(e => {
    main.openWindow("add");
  })
});
