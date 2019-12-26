// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'chqlcc-3c2367'
})

// 云函数入口函数
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('memory').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        user_id: event.user_id,
        content: event.content,
        images: event.images,
        create_time: event.create_time,
      }
    })
  } catch (e) {
    console.error(e)
  }
}