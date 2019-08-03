/**
 * 返回日期
*/
module.exports = function (value) {
  var timestamp = Date.parse(new Date());
  var date = new Date(timestamp);
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let time = Y + '-' + M + '-' + D;

  return time;
}