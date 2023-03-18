// pages/enroll/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    passwordDB:'',
    nickName: '',
    openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
     
  },
  //  获取表单数据
  enroll(e) {
    // console.log(e);
    let val = e.detail.value
    this.setData({
      phone: val.phone,
      password: val.password,
      passwordDB:val.passwordDB,
      nickName: val.name
    })
    if (!this.data.phone) {
      wx.showToast({
        icon: 'error',
        title: '请输入手机号',
      })
      return
    }
    if (!this.data.password) {
      wx.showToast({
        icon: 'error',
        title: '请输入密码',
      })
      return
    }
    if (!this.data.nickName) {
      wx.showToast({
        icon: 'error',
        title: '请输入姓名',
      })
      return
    }
    if(this.data.passwordDB !== this.data.password ){
      wx.showToast({
        icon:'error',
        title: '两次密码不同',
      })
      return
    }
    // 提交数据库
    wx.cloud.database().collection('user').add({
      data: {
        phone: this.data.phone,
        password: this.data.password,
        nickName: this.data.nickName,
        avatarUrl:'../../images/icon-touxiang.png',
        _id: this.data.phone //防止重复注册
      }
    }).then((res) => {
      wx.navigateBack({
        delta:1
      })
      wx.showToast({
        title: '注册成功请登录',
      })
      
    }).catch(err => {
      wx.showToast({
        title: '该号码已被注册',
      })
    })
},
/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady() {

},

/**
 * 生命周期函数--监听页面显示
 */
onShow() {
  wx.cloud.database().collection("user").get().then(res=>{
    //  console.log(res);
    this.setData({
      openid:res.data[0].openid
    })
     })
},

/**
 * 生命周期函数--监听页面隐藏
 */
onHide() {

},

/**
 * 生命周期函数--监听页面卸载
 */
onUnload() {

},

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh() {

},

/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom() {

},

/**
 * 用户点击右上角分享
 */
onShareAppMessage() {

}
})