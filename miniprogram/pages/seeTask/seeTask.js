// pages/review/review.js
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task: [],
    images: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    const db = wx.cloud.database();
    db.collection('task').doc(options.id).get().then(res => {
      that.setData({
        task: res.data
      })
    })
    db.collection('reviewed').where({
      task_id: options.id
    }).get().then(res => {
      that.setData({
        images: res.data[0].images
      })
    })
  },

  // 图片预览
  previewImage: function (e) {
    //console.log(this.data.images);
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.images
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