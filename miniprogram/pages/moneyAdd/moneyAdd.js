// pages/moneyAdd/moneyAdd.js
var that;
const db = wx.cloud.database();
const _ = db.command;
var date = require('../../utils/date')
var utils = require('../../utils/utils.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1, //给一个默认值，默认第一个选中
    currentIcon: "",
    list: [],
    length: 0,
    date: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.loadList();
    var nowDate = date.getDate();
    this.setData({
      date: nowDate,
    });
  },

  changTab: function (event) {
    this.setData({
      currentTab: parseInt(event.target.dataset.current)
    })
    this.loadList();
  },

  //选择icon
  selectIcon: function (event) {
    this.setData({
      currentIcon: event.currentTarget.dataset.icon
    })
  },

  loadList:function(){
    db.collection('icon').where({
      type: that.data.currentTab
    }).orderBy('sort', 'asc').get().then(res => {
      console.log(res.data)
      that.setData({
        list: res.data,
        length: res.data.length
      })
    }).catch(err => {
      console.error(err)
    })
  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  formSubmit(e) {
    utils.showLoading('胖婵努力提交中...');
    console.log('form发生了submit事件，携带数据为：', e.detail)
    var data = e.detail.value;
    if (that.data.currentIcon == "" || data.money == "" || data.describe == "") {
      wx.showModal({
        title: '胖婵警告',
        content: '我是猪，内容还没填好！',
        showCancel: false
      })
      utils.hideLoading();
      return
    }
    //提交审核数据
    wx.cloud.callFunction({
      name: 'addMoneyRecord',
      data: {
        type: that.data.currentTab,
        icon: that.data.currentIcon,
        money: Number(data.money),
        describe: data.describe,
        date: data.date,
        user_id: app.globalData.userinfo._id,
        create_time: date.getDateTime()
      },
      success(res) {
        utils.hideLoading();
        wx.showModal({
          title: '提示',
          content: '添加成功',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      },
      fail: console.error
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