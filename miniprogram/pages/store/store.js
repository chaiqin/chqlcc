var that;
const db = wx.cloud.database();
var app = getApp();
var utils = require('../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollH: 0,
    imgWidth: 0,
    interval: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    length: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userinfo == "") {
      return
    }

    that = this;
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.458;
        let scrollH = wh;
        let interval = ww * 0.028;
        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth,
          interval: interval
        });

        //加载首组图片
        this.loadImages();
      }
    })
    console.log(this.data)
  },

  onImageLoad: function(e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let imgWidth = this.data.imgWidth; //图片设置的宽度
    let scale = imgWidth / oImgW; //比例计算
    let imgHeight = oImgH * scale; //自适应高度

    let images = this.data.images;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img._id === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    //判断当前图片添加到左列还是右列
    if (col1.length <= col2.length) {
      col1.push(imageObj);
    } else {
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    //当前这组图片已加载完毕，则清空图片临时加载区域的内容
    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
  },

  /**
   * 获得商品
   */
  loadImages: function() {
    const _ = db.command
    //获得商品
    let images = [];
    db.collection('product').where({
      creator: app.globalData.userinfo.love_user,
      limit: _.neq(0)
    }).skip(this.data.length).get().then(res => {
      images = res.data;
      //商品数量更新
      let length = this.data.length + images.length;

      that.setData({
        loadingCount: images.length,
        images: images,
        length: length
      });
    })
    console.log('滚动')
  },

  /**
   * 兑换商品
   */
  duihuan: function(e) {
    wx.showModal({
      title: '兑换',
      content: '确定兑换吗？',
      success(res) {
        if (res.confirm) {
          utils.showLoading('加载中...');
          let product_id = e.currentTarget.dataset.id;
          let integral = e.currentTarget.dataset.integral;
          wx.cloud.callFunction({
            name: 'duiHuan',
            data: {
              user_id: app.globalData.userinfo._id,
              product_id: product_id,
              integral: integral
            },
            success(res) {
              utils.hideLoading();
              console.log(res)
              var code = res.result.code;
              wx.showModal({
                title: '提示',
                content: res.result.msg,
                showCancel: false,
                success(res) {
                  if (res.confirm && code == 0) {
                    //刷新商品
                    let data = {
                      scrollH: 0,
                      imgWidth: 0,
                      interval: 0,
                      loadingCount: 0,
                      images: [],
                      col1: [],
                      col2: [],
                      length: 0
                    }
                    that.setData(data);
                    that.onLoad();
                  }
                }
              })
            },
            fail: console.error
          })
        }
      }
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
    if (this.data.scrollH == 0) {
      this.onLoad();
    }
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
    let data = {
      scrollH: 0,
      imgWidth: 0,
      interval: 0,
      loadingCount: 0,
      images: [],
      col1: [],
      col2: [],
      length: 0
    }
    this.setData(data)
    this.onLoad()
    console.log(this)
    wx.stopPullDownRefresh()
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