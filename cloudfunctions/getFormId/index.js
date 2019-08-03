// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'chqlcc-3c2367'
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  let formId = null
  let form_id = null
  let timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000 - 6 * 24 * 60 * 60
  await db.collection('formIds').where({
    user_id: event.id,
    create_time: _.gt(timestamp)
  }).limit(1).get().then(res => {
    form_id = res.data[0].form_id
    formId = res.data[0]._id
    console.log(res)
  })

  //删除使用过的form_id
  await db.collection('formIds').doc(formId).remove()

  return form_id;
}