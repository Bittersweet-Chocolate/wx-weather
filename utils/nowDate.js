function nowDate() {
  var now = new Date()
  var date = now.getDate()
  var month = now.getMonth()+1+'月'
  var day = now.getDay()
  var year = now.getFullYear()

  if (day < 10) {
    day = '0' + day;
  };
  return [year, month, day, month]
}
module.exports = {
  nowDate: nowDate
}