// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'chqlcc-3c2367'
})

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //修改奖品为已使用
  await db.collection('product').doc(event.product_id).update({
    data: {
      status: 3
    }
  })
  return {
    code: 0,
    msg: '使用成功',
    data: null
  }
}