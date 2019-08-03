// pages/submit/submit.js
var utils = require('../../utils/utils.js')
var that;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task: [],
    images: [],
    love_user: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    const db = wx.cloud.database();
    db.collection('task').doc(options.id).get().then(res => {
      that.setData({
        task: res.data
      })
      if (this.data.task.status == 2) {
        //正在审核的资料
        db.collection('reviewed').where({
          task_id: options.id
        }).get().then(res => {
          that.setData({
            images: res.data[0].images
          })
        })
      }
    })
    db.collection('users').doc(app.globalData.userinfo.love_user).get().then(res => {
      this.setData({
        love_user: res.data
      })
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
    // console.log(app.globalData.userinfo.openid)
    // return
    utils.showLoading('加载中...');
    if (this.data.images.length == 0) {
      wx.showModal({
        title: '来自亲的提示',
        content: '某婵，请乖乖上传图片',
        showCancel: false
      })
      return
    }
    //上传图片
    var arr = this.data.images;
    var uploadedImages = [];
    let uploadNum = 0; //上传成功次数
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000; //时间戳
    for (var i = 0; i < arr.length; i++) {
      wx.cloud.uploadFile({
        cloudPath: 'images/' + timestamp + i + arr[i].match(/\.[^.]+?$/)[0], // 上传至云端的路径
        filePath: arr[i], // 小程序临时文件路径
        success: res => {
          // 返回文件 ID
          uploadedImages.push(res.fileID);
          uploadNum++;
          if (uploadNum == arr.length) {
            //提交审核数据
            wx.cloud.callFunction({
              name: 'addReviewed',
              data: {
                task_id: that.data.task._id,
                images: uploadedImages,
                form_id: e.detail.formId,
                user_id: app.globalData.userinfo._id
              },
              success(res) {
                utils.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: '提交成功',
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
        },
        fail: console.error
      })
    }

  },


})