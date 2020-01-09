// pages/task/task.js
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList: [],
    length: 0,
    scrollH: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("start load")
    //用户授权信息判断
    var value = wx.getStorageSync('user');
    if (!value) {
      return;
    } else {
      db.collection('users').doc(value._id).get().then(res => {
        app.globalData = {
          userinfo: res.data
        }
      })
      
    }

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollH: res.windowHeight
        })
      }
    })
    this.loadTask();
  },

  /**
   * 刷新
   */
  shuaxin: function() {
    let data = {
      taskList: [],
      length: 0,
      scrollH: 0
    }
    this.setData(data)
    this.onLoad()
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
    let data = {
      taskList: [],
      length: 0,
      scrollH: 0
    }
    this.setData(data)
    this.onLoad()
    console.log('任务下拉刷新')
    wx.stopPullDownRefresh()
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

  loadTask: function(e) {
    var that = this;
    var task = that.data.taskList;
    wx.cloud.callFunction({
      name: 'getTask',
      data: {
        length: task.length
      },
      success(res) {
        for (var i = 0; i < res.result.length; i++) {
          task.push(res.result[i]);
        }
        that.setData({
          taskList: task,
          length: task.length
        })
      },
      fail: console.error
    })
    console.log('向下滚动加载')
  },

  toSubmit: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/submit/submit?id=' + id,
    })
  }
})