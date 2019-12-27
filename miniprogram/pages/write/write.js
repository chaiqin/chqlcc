// pages/write/write.js
var utils = require('../../utils/utils.js')
var date = require('../../utils/date')
var that;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
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

  /**
   * 选择图片
   */
  chooseImage: function() {
    var length = that.data.images.length;
    wx.chooseImage({
      count: 9 - length, //限制还能上传个数
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          images: that.data.images.concat(tempFilePaths)
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
      urls: this.data.images
    })
  },
  //图片删除
  delete: function(e) {
    var index = e.currentTarget.dataset.index;
    var images = that.data.images;
    images.splice(index, 1);
    that.setData({
      images: images
    });
  },

  //提交
  formSubmit: function(e) {
    utils.showLoading('加载中...');
    if (this.data.images.length == 0 && e.detail.value.content == "") {
      wx.showModal({
        title: '警告',
        content: '发表内容为空！',
        showCancel: false
      })
      utils.hideLoading();
      return
    }

    
    var arr = this.data.images;
    var uploadedImages = [];
    let uploadNum = 0; //上传成功次数
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000; //时间戳
    if (arr.length == 0){
      //发布
      that.save(e.detail.value.content, uploadedImages);
    }else{
      //上传图片并发布
      for (var i = 0; i < arr.length; i++) {
        wx.cloud.uploadFile({
          cloudPath: 'images/' + timestamp + i + arr[i].match(/\.[^.]+?$/)[0], // 上传至云端的路径
          filePath: arr[i], // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            uploadedImages.push(res.fileID);
            uploadNum++;
            if (uploadNum == arr.length) {
              that.save(e.detail.value.content, uploadedImages);
            }
          },
          fail: console.error
        })
      }
    }
  },

  //发布
  save: function(content, uploadedImages) {
    //提交审核数据
    wx.cloud.callFunction({
      name: 'addMemory',
      data: {
        content: content,
        images: uploadedImages,
        user_id: app.globalData.userinfo._id,
        create_time: date.getDateTime()
      },
      success(res) {
        utils.hideLoading();
        wx.showModal({
          title: '提示',
          content: '发布成功',
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
  }

})