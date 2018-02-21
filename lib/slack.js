const { RtmClient, CLIENT_EVENTS, RTM_EVENTS } = require("@slack/client");

const token = "";

module.exports = (io, count) => {
  const appData = {};
  const slack = new RtmClient(token, { dataStore: false, useRtmConnect: true });
  slack.on(CLIENT_EVENTS.RTM.AUTHENTICATED, connectData => {
    appData.selfId = connectData.self.id;
    console.log(`Logged in as ${appData.selfId} of team ${connectData.team.id}`);
  });
  slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
    console.log(`Ready`);
  });
  slack.on(RTM_EVENTS.MESSAGE, msg => {
    if (msg.type === "message" && msg.text) {
      io.emit("chat message", { message: msg.text });
      count.comment++;
      io.emit("count", count);
    }
    console.log(`Message: ${JSON.stringify(msg, null, 2)}`);
  });

  return slack;
};
