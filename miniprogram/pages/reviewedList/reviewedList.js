// pages/review/review.js
var that;
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList: [],
    length: 0,
    scrollH: 0,
    love_user_id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollH: res.windowHeight,
          love_user_id:options.love_user_id
        })
      }
    })
    this.loadTask();
  },

  /**
   * 任务加载
   */
  loadTask: function () {
    let task = that.data.taskList;
    db.collection('task').where({
      accepter: this.data.love_user_id,
      status: 2
    }).skip(this.data.length).get().then(res => {
      for (var i = 0; i < res.data.length; i++) {
        task.push(res.data[i]);
      }
      that.setData({
        taskList: task,
        length: task.length
      })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      taskList: [],
      length: 0
    })
    this.loadTask()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})