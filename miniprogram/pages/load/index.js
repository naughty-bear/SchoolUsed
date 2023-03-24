// pages/load/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    avatarUrl: '',
    phone: '',
    userInfo: []
  },

  //微信授权登录
  loadByWechat() {
    wx.getUserProfile({
        desc: '用户完善会员资料',
      })
      .then(res => {
        // console.log("用户允许了微信授权登录", res.userInfo);
        this.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })
      })
      .catch(err => {
        console.log("用户拒绝了微信授权登录", err);
      })
  },
  //跳转到账号密码登录页
  loadByAccount() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },
  // 调用云函数
  // 获取手机号
  getPhone(e) {
    let phone = e.detail.value
    this.setData({
      phone: phone
    })
  },
  // 登录
  load() {
    // 判断号码是否已被绑定
    wx.cloud.database().collection('user').where({
      _id: this.data.phone
    }).get().then(res => {
      // console.log(res);
      wx.setStorageSync('user', res.data[0])
      //将用户信息添加到数据库
    }).catch(() => {
      wx.cloud.database().collection('user').add({
        data: {
          _id: this.data.phone,
          avatarUrl: this.data.avatarUrl,
          nickName: this.data.nickName,
          phone: this.data.phone
        }
      }).then(res => {
        this.load()
      })
    })
    wx.showToast({
        title: '登录成功',
      })
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/me/index?name=' + this.data.nickName + '&img=' + this.data.avatarUrl + '&phone=' + this.data.phone,
        })
      }, 1500)
  },
  // 返回开始页
  goback() {
    this.setData({
      nickName: '',
      avatarUrl: '',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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