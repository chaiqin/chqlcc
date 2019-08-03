// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'chqlcc-3c2367'
})

const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  let userinfo = event.userInfo;
  let me;
  await db.collection('users').where({
    openid: userinfo.openId
  }).get().then(res => {
    me = res.data[0]
  })

  if (me == null) {
    await db.collection('users').add({
      data: {
        openid: userinfo.openId,
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        integral: 0,
        signIn_num:0,
        signIn_time:String(0),
      }
    })
    await db.collection('users').where({
      openid: userinfo.openId
    }).get().then(res => {
      me = res.data[0]
    })
  }

  return me;
}