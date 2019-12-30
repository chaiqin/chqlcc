//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'chqlcc-3c2367'
      })
    }

    this.globalData = {
      userinfo:""
    }

  console.log('执行了app.js')
  },

  checkIsLog:function(){
    if (this.globalData.userinfo == "") {
      wx.showModal({
        title: '温馨提示',
        content: '登录信息已失效，请重新登录',
        success(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/authorize/authorize',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }
    return true;
  }
})
