// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [{
      swiperimg: '../../images/lunbo.png'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 跳转到二手回收业
  toRecycle() {
    wx.navigateTo({
      url: '/pages/recyle/index',
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
    this.getSwiperImg()
  },
  getSwiperImg() {
    wx.cloud.database().collection('swiperImg').get().then(res => {
      // console.log(res);
      if (res.data && res.data.length > 0) {
        this.setData({
          swiperList: res.data
        })
      }
    })
    //获取热销商品
    wx.cloud.database().collection('goods').where({
      recommend: true
    }).get().then(res => {
      // console.log(res);
      this.setData({
        recommentGoods: res.data
      })

    })
  },
  //跳转商品详情页
  togoodsDetail(e) {
    //  console.log(e);
    wx.navigateTo({
      url: '/pages/detailgoods/index?id=' + e.currentTarget.dataset.id,
    })

  },
  //进入搜索页
  toSearch(e) {
    //  console.log(e);
    wx.cloud.database().collection('goods').where({
      name: wx.cloud.database().RegExp({
        regexp: e.detail.value,
        options: 'i'
      })
    }).get().then(res => {

      // console.log(res);
      let value = JSON.stringify(res.data)
      wx.navigateTo({
        url: `/pages/search/index?res=${value}`,
      })
      this.setData({
        iptvalue: null
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