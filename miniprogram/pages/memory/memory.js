// pages/memory/memory.js
const app = getApp()
var that;
const db = wx.cloud.database();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    length: 0,
    scrollH: 0,
    limit: 10,
    loveUser: "",
    isShowImg: false,
    swiperImgs: [
      "cloud://chqlcc-3c2367.6368-chqlcc-3c2367/images/lunbo-1.jpg",
      "cloud://chqlcc-3c2367.6368-chqlcc-3c2367/images/lunbo-2.jpg",
      "cloud://chqlcc-3c2367.6368-chqlcc-3c2367/images/lunbo-3.jpg",
      "cloud://chqlcc-3c2367.6368-chqlcc-3c2367/images/lunbo-4.jpg",
      "cloud://chqlcc-3c2367.6368-chqlcc-3c2367/images/lunbo-5.jpg",
      "cloud://chqlcc-3c2367.6368-chqlcc-3c2367/images/lunbo-6.jpg",
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userinfo == "") {
      return
    }

    console.log("load");
    that = this;
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollH: res.windowHeight
        })
      }
    })
    db.collection('users').doc(app.globalData.userinfo.love_user).get().then(res => {
      this.setData({
        loveUser: res.data
      })
      this.loadList();
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
    if (this.data.isShowImg) {
      this.setData({
        isShowImg: false
      })
      return
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
    this.refresh()
    console.log('任务下拉刷新')
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //加载列表
  loadList: function (e) {
    var list = that.data.list;
    var userinfo = app.globalData.userinfo;
    var loveUser = that.data.loveUser;
    db.collection('memory').where({
      user_id: _.eq(userinfo._id).or(_.eq(userinfo.love_user))
    }).orderBy('create_time', 'desc')
      .skip(that.data.length).limit(that.data.limit).get().then(res => {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].user_id == userinfo._id) {
            res.data[i].user = userinfo;
          } else if (res.data[i].user_id == loveUser._id) {
            res.data[i].user = loveUser;
          }
        }
        console.log(res);
        list = list.concat(res.data);
        that.setData({
          list: list,
          length: list.length
        })
      }).catch(err => {
        console.error(err)
      })

  },

  //刷新
  refresh: function () {
    let data = {
      list: [],
      length: 0,
      scrollH: 0
    }
    this.setData(data)
    this.onLoad()
  },

  // 图片预览
  previewImage: function (e) {
    this.setData({
      isShowImg: true   //防预览后刷新
    })
    var current = e.target.dataset.src
    var index = e.target.dataset.index
    wx.previewImage({
      current: current,
      urls: this.data.list[index].images
    })
  },

  // 轮播图片预览
  previewLunbo: function (e) {
    this.setData({
      isShowImg: true   //防预览后刷新
    })
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.swiperImgs
    })
  },
})