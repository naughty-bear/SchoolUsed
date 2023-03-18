// pages/mypublish/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: ''
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
    let user = wx.getStorageSync('user')
    //  console.log(user);
    wx.cloud.database().collection('goods').where({
      phoneID: user._id
    }).get().then(res => {
      // console.log(res);
      this.setData({
        goods: res.data
      })
    }).catch(() => {
      wx.showToast({
        icon: 'error',
        title: '获取数据失败',
      })
    })
  },
  // 下架商品
  deleteGoods(e) {

    //  console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id
    //确认操作
    wx.showModal({
      title: '提示',
      content: '确定要下架该商品',
      complete: (res) => {
        if (res.confirm) {
          console.log('确定');
          wx.cloud.database().collection('goods').doc(`${id}`).remove({}).then(res => {
            wx.showLoading({
              title: '删除中...'
            })
            this.onShow()
            wx.hideLoading()
          }).catch(err => {
            wx.showToast({
              icon: 'error',
              title: '下架失败',
            })
          })
          
        } else if (res.cancel) {
          console.log('取消');
        }
      }
    })
  },
  // 编辑商品信息
  compileMsg(e) {
    // console.log(e);
    wx.cloud.database().collection('goods').where({
      _id: e.currentTarget.dataset.id
    }).get().then(res => {
      // console.log(res);
      let value = JSON.stringify(res.data)
      // console.log(value);
      wx.reLaunch({
        url: '/pages/publish/index?res='+value +'&id='+ 1 + '&_id='+ res.data[0]._id,
      })
    }).catch(() => {
      console.log('编辑失败');
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