// pages/me/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    img: '../../images/icon-touxiang.png',
    login: true,
    indentList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },
  // 上门回收
  toRecycle() {
    wx.navigateTo({
      url: '/pages/recyle/index',
    })
  },
  // 客服电话
  call() {
    wx.makePhoneCall({
      phoneNumber: '18322075801',
    })
  },
  // 授权登录
  login() {
    // 跳转到登录页 
    wx.navigateTo({
      url: '/pages/login/index',
    })
    // console.log(this.data.img);
    let user = wx.getStorageSync('user')
    wx.cloud.database().collection('user').where({
      _id: user._id
    }).get().then(res => {
      let val = res.data[0]
      this.setData({
        userName: val.nickName,
        img: val.avatarUrl
      })
    })
  },
  // 退出登录
  laginOut() {
    this.setData({
      userName: '',
      img: '../../images/icon-touxiang.png',
      login:false
    })
    // 清除缓存
    wx.setStorageSync('user', '')
  },
  // 跳转到修改页
  changeTnformation() {
    wx.navigateTo({
      url: '/pages/approve/index',
    })
  },
  //跳转到我的发布页
  publish() {
    wx.navigateTo({
      url: '/pages/mypublish/index',
    })
  },
  // 我的订单
  myOrder() {
    wx.navigateTo({
      url: '/pages/indent/index',
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
    if(!this.data.userName){
      wx.showToast({
        icon:'none',
        title: '请先登录账号',
      })
    }
    // console.log(this.data.img);
    // let user = wx.getStorageSync('user')
    // wx.cloud.database().collection('user').where({
    //   _id: user._id
    // }).get().then(res => {
    //   let val = res.data[0]
    //   this.setData({
    //     userName: val.nickName,
    //     img: val.avatarUrl
    //   })
    // })
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