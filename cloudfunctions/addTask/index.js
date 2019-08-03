// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'chqlcc-3c2367'
})

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let userinfo = event.userInfo;
  let me = '';
  await db.collection('users').where({
    openid: userinfo.openId
  }).get().then(res => {
    me = res.data[0]
  })
  
  //收集form_id
  let timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  await db.collection('formIds').add({
    data: {
      user_id: me._id,
      form_id: event.form_id,
      create_time: timestamp
    }
  })

  try {
    return await db.collection('task').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        publisher: me._id,
        accepter: me.love_user,
        title: event.title,
        reward:Number(event.reward),
        punishment: Number(event.punishment),
        start_time: event.start_time,
        end_time: event.end_time,
        status: 1
      }
    })
  } catch (e) {
    console.error(e)
  }

}