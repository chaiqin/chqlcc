// pages/lifeList/lifeList.js
var utils = require('../../utils/utils.js')
const db = wx.cloud.database();
const _ = db.command
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    list:[],
    totalNum:0,
    finishNum:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    db.collection('lifeList').count().then(res => {
      that.setData({
        totalNum: res.total,
      });
    })
    db.collection('lifeList').where({
      img:_.neq("")
    }).count().then(res => {
      that.setData({
        finishNum: res.total,
      });
    })
    this.loadData();
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
    // this.onLoad();
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
    let data = {
      title: "",
      list: [],
      totalNum: 0,
      finishNum: 0,
    }
    this.setData(data)
    this.onLoad()
    console.log('任务下拉刷新')
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  formSubmit(e) {
    utils.showLoading('发布中...');
    console.log('form发生了submit事件，携带数据为：', e.detail)
    if(e.detail.value.title==""){
      wx.showModal({
        title: '来自亲的提示',
        content: '请输入标题，胖婵',
        showCancel: false
      })
      utils.hideLoading();
      return;
    }
    db.collection('lifeList').add({
      data: {
        title: e.detail.value.title,
        img:"",
      }
    })
      .then(res => {
        that.setData({
          title:""
        });
        utils.hideLoading();
        console.log(res)
        wx.showModal({
          title: '提示',
          content: '添加成功',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              that.onLoad();
            }
          }
        })
      })
  },

  // 图片预览
  previewImage: function (e) {
    console.log(e.target.dataset.src)
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },

  //加载数据
  loadData: function (e){
    db.collection('lifeList').skip(this.data.list.length).get().then(res => {
      that.setData({
        list: that.data.list.concat(res.data),
      });
    })
  }
})