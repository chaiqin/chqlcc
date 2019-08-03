// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'chqlcc-3c2367'
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  let user;
  var timestamp = Date.parse(new Date());
  var date = new Date(timestamp);
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let time = Y + '-' + M + '-' + D;
  
  await db.collection('users').doc(event.user_id).get().then(res=>{
    user = res.data
  })

  //签到时间验证
  if (user.signIn_time == time){
    return {code:400, msg:'今天已签到了', data:null}
  }

  await db.collection('users').doc(event.user_id).update({
    data:{
      signIn_num: _.inc(1),
      integral:_.inc(1),
      signIn_time: time
    }
  })

  return { code: 0, msg: '签到成功，恭喜你获得1积分', data: null }

}