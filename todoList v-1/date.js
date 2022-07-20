module.exports = getDate;


function getDate() {
  var today = new Date();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  var day = today.toLocaleDateString("en-In", options);
  return day;
}
