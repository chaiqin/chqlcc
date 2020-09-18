// pages/money/money.js
const app = getApp()
var that;
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    total:0,
    loveUser: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    db.collection('users').doc(app.globalData.userinfo.love_user).get().then(res => {
      this.setData({
        loveUser: res.data
      })
      this.loadList();
    })
  },

  //加载列表
  loadList: function (e) {
    var total=0;
    var userinfo = app.globalData.userinfo;
    var loveUser = that.data.loveUser;
    db.collection('moneyRecord').orderBy('date', 'desc').get().then(res => {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].user_id == userinfo._id) {
            res.data[i].user = userinfo;
          } else if (res.data[i].user_id == loveUser._id) {
            res.data[i].user = loveUser;
          }
        }
        console.log(res);
        that.setData({
          list: res.data
        })
      }).catch(err => {
        console.error(err)
      })

      const $ = db.command.aggregate
      db.collection('moneyRecord')
        .aggregate()
        .group({
          _id: '$type',
          money: $.sum('$money')
        })
        .end()
        .then(res =>{
          for (var i = 0; i < res.list.length; i++) {
            total += res.list[i].money
          }
          that.setData({
            total:total
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
    this.loadList()
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