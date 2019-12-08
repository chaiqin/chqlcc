// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'chqlcc-3c2367'
})

const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  //修改奖品为已使用
  try {
    var resolve = await db.collection('exchange').doc(event.product_id).update({
      data: {
        status: 3
      }
    })
  } catch (e) {
    console.error(e)
    return {
      code: 1,
      msg: '系统错误!',
      data: e
    }
  }
  console.log(event);
  return {
    code: 0,
    msg: '使用成功',
    data: resolve
  }
}