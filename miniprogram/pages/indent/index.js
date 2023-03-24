// pages/indent/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeColor1: '#04f436',
    activeColor2: 'black',
    size1: 36,
    size2: 32,
    indentGoodsYes: [],
    indentGoodsNo: []
  },
  // 待收货
  indentAll() {
    if (this.data.activeColor2 == '#04f436') {
      this.setData({
        activeColor1: '#04f436',
        activeColor2: 'black',
        size1: 36,
        size2: 32,
      })
    }
  },
  // 已完成
  indentObligation() {
    if (this.data.activeColor1 == '#04f436') {
      this.setData({
        activeColor2: '#04f436',
        activeColor1: 'black',
        size2: 36,
        size1: 32,
      })
    }
  },
  // 确认收货/删除订单
  confirmReceipt(e) {
    // console.log(e);
    this.setData({
      indentGoodsNo: [],
      indentGoodsYes: []
    })
    // console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id
    if (this.data.activeColor1 === '#04f436') {
      wx.showModal({
        title: '提示',
        content: '是否确认收货',
        complete: (res) => {
          if (res.confirm) {
            wx.cloud.database().collection('indent').doc(`${id}`).update({
              data: {
                status: 1
              }
            }).then(() => {
              wx.showToast({
                title: '已确认收货',
              })
            })
            setTimeout(() => {
              this.onShow()
            }, 1000)
          } else if (res.cancel) {
            console.log("取消");
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否确认删除订单',
        complete: (res) => {
          if (res.confirm) {
            wx.cloud.database().collection('indent').doc(`${id}`).remove().then(res => {
              wx.showToast({
                title: '已删除',
              })
            })
            setTimeout(() => {
              this.onShow()
            }, 1000)
          } else if (res.cancel) {
            console.log("取消");
          }
        }
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
    console.log();
    // 获取订单商品
    let openid = wx.getStorageSync('user')._id
    wx.cloud.database().collection('indent').get().then(res => {
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].nickName === openid) {
          if (res.data[i].status === 0) {
            this.data.indentGoodsNo.push(res.data[i])
            this.setData({
              indentGoodsNo: this.data.indentGoodsNo
            })
          } else {
            this.data.indentGoodsYes.push(res.data[i])
            this.setData({
              indentGoodsYes: this.data.indentGoodsYes
            })
          }
        }
      }
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