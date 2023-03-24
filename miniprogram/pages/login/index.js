// pages/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },
  //跳转到注册页
  enroll() {
    wx.navigateTo({
      url: '/pages/enroll/index',
    })
  },
  // 获取输入电话号码
  getPhone(e) {
    // console.log(e.detail.value);
    if (e) {
      this.setData({
        phone: e.detail.value
      })
    }

  },
  //获取登录密码
  getPassword(e) {
    // console.log(e.detail.value);
    if (e) {
      this.setData({
        password: e.detail.value
      })
    }

  },
  // 登录
  submit() {
    if (!this.data.phone) {
      wx.showToast({
        icon: 'error',
        title: '请输入手机号',
      })
      return;
    }
    if (!this.data.password) {
      wx.showToast({
        icon: 'error',
        title: '请输入登录密码',
      })
      return;
    }

    // 从数据库获取注册信息
    if (this.data.phone && this.data.password) {
      wx.cloud.database().collection('user')
        .where({
          phone: this.data.phone,
          password: this.data.password
        }).get().then(res => {
          if (this.data.password == res.data[0].password) {
             wx.setStorageSync('user', res.data[0])
            wx.showToast({
              title: '登录成功',
            })
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/me/index?userInfo=' + res.data[0].nickName + '&tab='  + 1,
              })
            }, 1500)
          }
        }).catch(err => {
          wx.showToast({
            icon: 'error',
            title: '密码错误',
          })
          return
        })
    }
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