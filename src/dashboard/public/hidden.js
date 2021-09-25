/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
$("#opciones").click(function (e) {
  $("#section-data").css("display", "none");
  $("#section-leaderboard").css("display", "none");
  $("#section-opciones").css("display", "block");
});
$("#data").click(function (e) {
  $("#section-opciones").css("display", "none");
  $("#section-data").css("display", "block");
  $("#section-leaderboard").css("display", "none");
});
