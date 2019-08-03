// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'chqlcc-3c2367'
})

const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  let user = null;
  await db.collection('users').doc(event.user_id).get().then(res => {
    user = res.data;
  })

  if (user.integral < event.integral) {
    //积分不足提示
    return {
      code: 400,
      msg: '胖婵，你积分不足',
      data: null
    }
  }

  //减积分
  let newIntegral = user.integral - event.integral;
  await db.collection('users').doc(event.user_id).update({
    data: {
      integral: newIntegral
    }
  })

  //修改商品状态
  var timestamp = Date.parse(new Date());
  var date = new Date(timestamp);
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let exchange_time = Y + '-' + M + '-' + D;
  await db.collection('product').doc(event.product_id).update({
    data: {
      status: 2,
      exchange_time : exchange_time
    }
  })

  return {
    code: 0,
    msg: '兑换成功',
    data: null
  }
}