function nowDate() {
  var now = new Date()
  var day = now.getDate()
  var month = now.getMonth() + 1
  var week = now.getDay()
  var year = now.getFullYear()

  if (month < 10) {
    month = '0' + month;
  };
  if (day < 10) {
    day = '0' + day;
  };
  return [year, month, day, week]
}
module.exports = {
  nowDate: nowDate
}