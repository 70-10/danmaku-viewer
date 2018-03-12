const { RtmClient, CLIENT_EVENTS, RTM_EVENTS } = require("@slack/client");
const config = require("config");
const debug = require("debug")("danmaku-viewer:slack");

module.exports = (io, count) => {
  const appData = {};
  const slack = new RtmClient(config.slack.token, { dataStore: false, useRtmConnect: true });
  slack.on(CLIENT_EVENTS.RTM.AUTHENTICATED, connectData => {
    appData.selfId = connectData.self.id;
    debug(`Logged in as ${appData.selfId} of team ${connectData.team.id}`);
  });
  slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
    debug("Ready");
  });
  slack.on(RTM_EVENTS.MESSAGE, msg => {
    if (msg.channel !== config.slack.channel_id) {
      return;
    }
    if (msg.type === "message" && msg.text) {
      io.emit("chat message", { message: msg.text });
      count.comment++;
      io.emit("count", count);
    }
    debug(`Message: ${msg.text}`);
  });

  return slack;
};
