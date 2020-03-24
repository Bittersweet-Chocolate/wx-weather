function nowDate() {
  var now = new Date()
  var date = now.getDate()
  var month = now.getMonth() + 1
  var day = now.getDay()
  var year = now.getFullYear()

  if (month < 10) {
    month = '0' + month;
  };
  if (day < 10) {
    day = '0' + day;
  };
  return [year, month, day, date]
}
module.exports = {
  nowDate: nowDate
}