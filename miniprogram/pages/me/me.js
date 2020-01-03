// pages/love/love.js
const app = getApp()
var that;
var date = require('../../utils/date')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: null,
    is_qiandao:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userinfo == "") {
      return
    }
    that = this;
    const db = wx.cloud.database();
    db.collection('users').doc(app.globalData.userinfo._id).get().then(res => {
      let is_quandao = 0;
      if (res.data.signIn_time == date.getDate()) {
        is_quandao = 1;
      }
      this.setData({
        userinfo: res.data,
        is_qiandao: is_quandao
      })
    })
  },

  /**
   * 签到
  */
  qiandao:function(e){
    wx.cloud.callFunction({
      name: 'signIn',
      data:{
        user_id: app.globalData.userinfo._id
      },
      success(res){
        console.log(res)
        var code = res.result.code;
        wx.showModal({
          title: '提示',
          content: res.result.msg,
          showCancel: false,
          success(res) {
            if (res.confirm && code == 0) {
              //刷新商品
              that.onLoad();
            }
          }
        })
      }, fail: console.error
    })
  },

  getFormId:function(e){
    console.log(e)
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
    if (this.data.userinfo == null) {
      this.onLoad();
    }
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
    this.onLoad();
    wx.stopPullDownRefresh()
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