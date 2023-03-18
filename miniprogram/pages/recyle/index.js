// pages/recyle/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   
  },
  // 获取回收商列表
  getRecyle() {
    wx.cloud.database().collection('recyle').get().then (res=>{
      this.setData({
        recyleList:res.data
      })
    })
  },
  // 打电话
  callUp(e){
    //  console.log(e.currentTarget.dataset.phone);
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  // 复制微信
  copy(e){
     wx.setClipboardData({
       data: e.currentTarget.dataset.wechat,
       success(res) {
        wx.showToast({
          title: '已复制',
        })
      }
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
    this.getRecyle()
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