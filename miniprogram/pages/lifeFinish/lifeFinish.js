// pages/lifeFinish/lifeFinish.js
var utils = require('../../utils/utils.js')
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: "",
    id: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    this.setData({
      id: options.id,
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
  chooseImage: function() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          img: res.tempFilePaths[0]
        });
      }
    })
  },

  // 图片预览
  previewImage: function(e) {
    //console.log(this.data.images);
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.img
    })
  },
  //图片删除
  delete: function(e) {
    that.setData({
      img: ""
    });
  },

  formSubmit(e) {
    utils.showLoading('加载中...');
    console.log('form发生了submit事件，携带数据为：', e.detail)
    if (that.data.img == "") {
      wx.showModal({
        title: '来自亲的提示',
        content: '请选择图片，胖婵',
        showCancel: false
      })
      utils.hideLoading();
      return;
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000; //时间戳
    wx.cloud.uploadFile({
      cloudPath: 'images/' + timestamp + that.data.img.match(/\.[^.]+?$/)[0], // 上传至云端的路径
      filePath: that.data.img, // 小程序临时文件路径
      success: res => {
        //提交更新数据
        wx.cloud.callFunction({
          name: 'finishLife',
          data: {
            id: that.data.id,
            img: res.fileID,
            mood: e.detail.value.mood,
          },
          success(res) {
            utils.hideLoading();
            wx.showModal({
              title: '提示',
              content: '恭喜你达成目标',
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
      fail: console.error
    })
  },

})