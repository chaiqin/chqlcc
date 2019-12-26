// pages/publish/publish.js
var utils = require('../../utils/utils.js')
var date = require('../../utils/date')
const app = getApp();
const db = wx.cloud.database();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    end_date: '',
    love_user: null,
    now_date: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    db.collection('users').doc(app.globalData.userinfo.love_user).get().then(res => {
      this.setData({
        love_user: res.data
      })
    })
    var nowDate = date.getDate();
    this.setData({
      date: nowDate,
      end_date: nowDate,
      now_date: nowDate,
    });
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

  bindDateChangeEnd(e) {
    this.setData({
      end_date: e.detail.value
    })
  },

  formSubmit(e) {
    utils.showLoading('发布中...');
    console.log('form发生了submit事件，携带数据为：', e.detail)
    //模板数据
    let data = {
      touser: this.data.love_user.openid,
      template_id: '7ykO8rp40A-0SGR8K32bqg0C-kYYpixL41gx9Na-xcg',
      keyword1: e.detail.value.title,
      keyword2: app.globalData.userinfo.nickName,
      keyword3: this.data.now_date,
      keyword4: e.detail.value.start_time + '-' + e.detail.value.end_time
    };
    e.detail.value.form_id = e.detail.formId;
    wx.cloud.callFunction({
      name: 'addTask',
      data: e.detail.value,
      success(res) {
        that.sendTemplate(data);
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
   * 发送模板信息
   */
  sendTemplate(data) {
    wx.cloud.callFunction({
      name: 'getFormId',
      data: {
        id: app.globalData.userinfo.love_user
      },
      success(res) {
        console.log(res)
        if (res.result) {
          wx.request({
            url: 'https://cook.xionggouba.com/index/template/newTask?touser=' + data.touser + '&template_id=' + data.template_id + '&form_id=' + res.result + '&keyword1=' + data.keyword1 + '&keyword2=' + data.keyword2 + '&keyword3=' + data.keyword3 + '&keyword4=' + data.keyword4, // 仅为示例，并非真实的接口地址
            success(res) {
              console.log(res.data)
            }
          })
        }
      },
      fail: console.error
    })

  },


})