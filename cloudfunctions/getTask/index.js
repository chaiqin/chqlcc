// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'chqlcc-3c2367'
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  let userinfo = event.userInfo;
  let me = '';
  await db.collection('users').where({
    openid: userinfo.openId
  }).get().then(res => {
    me = res.data[0]
  })

  let taskList = '';
  await db.collection('task').where({
    accepter: me._id,
    status: _.in([1,2])
  }).skip(event.length).get().then(res => {
    taskList = res.data
  })

  return taskList;
}