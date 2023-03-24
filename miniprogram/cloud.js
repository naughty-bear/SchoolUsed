// 定义云函数
async function getPhoneNum(event) {
  var moblie = event.weRunData.data.phoneNumber;
  return moblie
}
export default getPhoneNum