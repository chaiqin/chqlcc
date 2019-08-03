// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'chqlcc-3c2367'
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  let user = '';

  //收集form_id
  let timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  await db.collection('formIds').add({
    data: {
      user_id: event.user_id,
      form_id: event.form_id,
      create_time: timestamp
    }
  })
  
  //完成任务
  await db.collection('task').doc(event.task._id).update({
    data:{
      status:3
    }
  })

  //获取任务完成者并增加积分
  await db.collection('users').doc(event.task.accepter).update({
    data:{
      integral: _.inc(event.task.reward)
    }
  })
}