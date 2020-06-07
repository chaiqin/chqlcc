// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'chqlcc-3c2367'
})

// 云函数入口函数
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('moneyRecord').add({
      // data 字段表示需新增的 JSON 数据
      data: event
    })
  } catch (e) {
    console.error(e)
  }
}