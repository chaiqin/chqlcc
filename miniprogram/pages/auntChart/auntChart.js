var echarts = require('../../utils/ec-canvas/echarts')
var utils = require('../../utils/utils.js')
var date = require('../../utils/date')
const db = wx.cloud.database();
let chart = null;
var that;

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: that.data.xAxis,
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: that.data.series,
      type: 'line'
    }]
  };


  chart.setOption(option);
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    date: '',
    xAxis: ['2019/01', '2019/02'],
    series: [20, 4],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var nowDate = date.getDate();
    this.setData({
      date: nowDate,
    });
    db.collection('aunt').orderBy("create_time", 'asc').get().then(res => {
      var series = [];
      var xAxis = [];
      for (var i = 0; i < res.data.length; ++i) {
        series.push(res.data[i].day);
        xAxis.push(res.data[i].year + "/" + res.data[i].month);
      }
      that.setData({
        series: xAxis,
        xAxis: xAxis,
      });
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  formSubmit(e) {
    utils.showLoading('发布中...');

    console.log('携带数据为：', e.detail)
    var dateArr = e.detail.value.create_time.split('-');
    db.collection('aunt').add({
        data: {
          year: dateArr[0],
          month: dateArr[1],
          day: dateArr[2],
          create_time: e.detail.value.create_time,
        }
      })
      .then(res => {
        utils.hideLoading();
        console.log(res)
        wx.showModal({
          title: '提示',
          content: '添加成功',
          showCancel: false,
          success(res) {
            if (res.confirm) {

            }
          }
        })
      })
  },
})