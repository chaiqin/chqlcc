// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'chqlcc-3c2367'
})

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
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

  try {
    //保存提交的审核数据
    await db.collection('reviewed').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        task_id: event.task_id,
        images: event.images
      }
    })
    //更新任务状态
    await db.collection('task').doc(event.task_id).update({
      data:{
        status:2
      }
    })
  } catch (e) {
    console.error(e)
  }
}