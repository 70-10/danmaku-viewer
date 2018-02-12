$(() => {
  $("input#name").val(localStorage.name);
  const danmaku = new Danmaku();
  danmaku.init({
    container: document.getElementById("danmaku"),
  });
  const socket = io();
  $("form").submit(() => {
    const name = $("input#name").val();

    if (name && name !== localStorage.name) {
      localStorage.name = name;
    }

    const message = $("#m")
      .val()
      .trim();

    if (!message) {
      return false;
    }

    socket.emit("chat message", { message, name });

    $("#m").val("");
    return false;
  });

  socket.on("chat message", msg => {
    const message = msg.name ? `${msg.message}@${msg.name}` : msg.message;
    danmaku.emit({
      text: message,
      style: {
        fontSize: "25px",
        color: "#fff",
      },
    });
    $("ul#timeline").append(`<li>${message}</li>`);
    $("ul#timeline").scrollTop($("ul#timeline")[0].scrollHeight);
  });

  socket.on("count", count => {
    $("#count").text(count.viewer);
    $("#all-count").text(count.all);
    $("#comment-count").text(count.comment);
  });

  $("button.emoji").on("click", function() {
    socket.emit("chat message", { message: $(this).text() });
  });
});
