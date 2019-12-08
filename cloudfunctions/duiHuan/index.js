// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'chqlcc-3c2367'
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  let user = null;
  let product = null;
  await db.collection('users').doc(event.user_id).get().then(res => {
    user = res.data;
  })
  await db.collection('product').doc(event.product_id).get().then(res => {
    product = res.data;
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

  //减剩余兑换次数
  await db.collection('product').doc(event.product_id).update({
    data: {
      limit: _.inc(-1)
    }
  })

  //新增兑奖记录
  var timestamp = Date.parse(new Date());
  var date = new Date(timestamp);
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let exchange_time = Y + '-' + M + '-' + D;
  await db.collection('exchange').add({
    data:{
      creator: product.creator,
      exchange_time: exchange_time,
      image:product.image,
      integral:product.integral,
      name:product.name,
      price:product.price,
      status:2
    }
  })

  return {
    code: 0,
    msg: '兑换成功',
    data: null
  }
}