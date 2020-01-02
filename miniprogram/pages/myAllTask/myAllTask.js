const db = wx.cloud.database();
var app = getApp();
var user_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList: [],
    length: 0,
    scrollH: 0,
    is_love:0,
    isShowWrite: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    user_id = options.user_id;
    if (user_id == app.globalData.userinfo.love_user) {
      console.log('ddd')
      this.setData({
        is_love:1
      })
    }
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollH: res.windowHeight
        })
      }
    })
    //防止别人访问看到
    var id = app.globalData.userinfo._id;
    if (id == "XHVd5pT75u22NXek" || id == "XHVd9HffS3SWtvVh") {
      this.setData({
        isShowWrite: true
      })
    }
    this.loadTask();
  },

  /**
   *加载任务
  */
  loadTask: function (e) {
    var that = this;
    var task = that.data.taskList;

    db.collection('task').where({
      accepter: user_id
    }).orderBy('start_time', 'desc').skip(that.data.length).get().then(res => {
      task = task.concat(res.data);
      that.setData({
        taskList: task,
        length: task.length
      })
    }).catch(err => {
      console.error(err)
    })

  },

  /**
   * 查看任务
  */
  toSee: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/seeTask/seeTask?id=' + id,
    })
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
  onPullDownRefresh: function() {},

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

})