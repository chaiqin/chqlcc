// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'chqlcc-3c2367'
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {

  var timestamp = Date.parse(new Date());
  var date = new Date(timestamp);
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let time = Y + '-' + M + '-' + D;
  let tasks;
  await db.collection('task').where({
    end_time: _.lt(time),
    status: 1
  }).get().then(res => {
    tasks = res.data;
  })

  for (var i = 0; i < tasks.length; i++) {
    //超时处理
    //任务超时更新
    await db.collection('task').doc(tasks[i]._id).update({
      data: {
        status: 4
      }
    })
    let less = 0 - tasks[i].punishment
    await db.collection('users').doc(tasks[i].accepter).update({
      data: {
        integral: _.inc(less)
      }
    })
  }

  console.log(tasks)
  console.log(time)

}