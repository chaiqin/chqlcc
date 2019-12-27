// pages/memory/memory.js
var that;
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    length: 0,
    scrollH: 0,
    limit:10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollH: res.windowHeight
        })
      }
    })
    this.loadList();
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
    this.refresh();
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
    this.refresh()
    console.log('任务下拉刷新')
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //加载列表
  loadList: function(e) {
    var list = that.data.list;

    db.collection('memory').orderBy('create_time', 'desc')
      .skip(that.data.length).limit(that.data.limit).get().then(res => {
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

  refresh:function(){
    let data = {
      list: [],
      length: 0,
      scrollH: 0
    }
    this.setData(data)
    this.onLoad()
  }
})