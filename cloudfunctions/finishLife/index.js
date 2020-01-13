// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'chqlcc-3c2367'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('lifeList').doc(event.id).update({
    data: {
      img: event.img,
      mood: event.mood,
    }
  })
}