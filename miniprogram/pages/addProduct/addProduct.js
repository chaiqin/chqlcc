// pages/addProduct/addProduct.js
var utils = require('../../utils/utils.js')
var that;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
  },

  chooseImage: function() {
    // 选择图片
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          image: res.tempFilePaths[0]
        });
      }
    })
  },
  // 图片预览
  previewImage: function(e) {
    wx.previewImage({
      current: this.data.image,
      urls: [this.data.image]
    })
  },
  //图片删除
  delete: function(e) {
    that.setData({
      image: null
    });
  },
  //提交
  formSubmit: function(e) {
	  utils.showLoading('加载中...');
    var product = e.detail.value;
    //类型转换
    product.integral = Number(product.integral)
    product.limit = Number(product.limit)
    //上传图片
    var image = this.data.image;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000; //时间戳
    wx.cloud.uploadFile({
      cloudPath: 'images/' + timestamp + image.match(/\.[^.]+?$/)[0], // 上传至云端的路径
      filePath: image, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        product.image = res.fileID;
        product.creator = app.globalData.userinfo._id;
        product.exchange_time = String(0);
        //提交数据
        const db = wx.cloud.database();
        db.collection('product').add({
          data: product
        }).then(res => {
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
        }).catch(console.error)

      },
      fail: console.error
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

  }
})