// pages/type/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentType: 0,
    totalPrice: 0,
    goodsNum: 0,
    goodslist: '',
    getId: [],
    cart: '',
    checkedList: [],
    id: '',
    success: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 搜索页
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
  //获取分类列表
  getTypeList() {
    wx.cloud.database().collection('shopType').get().then(res => {
      this.setData({
        typeList: res.data
      })
    })
  },
  getGoodsMessage(e) {
    // console.log(e);
    this.setData({
      currentType: e.currentTarget.dataset.index
    })
    this.getgoods()
  },
  //获取商品
  getgoods() {
    // let user = wx.getStorageSync('user')
    // 切换分类时清空getId
    // this.setData({
    //   getId: []
    // })
    wx.showLoading({
      title: '数据加载中...',
    })
    wx.cloud.database().collection('goods').where({
      _type: String(this.data.currentType)
    }).get().then(res => {
      // for (let i = 0; i < res.data.length; i++) {
      //   this.data.getId.push(res.data[i]._id)
      //   this.setData({
      //     getId:this.data.getId
      //   })
      // }
      this.setData({
        goodslist: res.data
      })
      wx.hideLoading()
    })
  },
  //将商品加入购物车
  addGoods(e) {
    // console.log(e);
    let id = e.currentTarget.dataset.id
    // console.log(checkList);
    wx.cloud.database().collection('goods').where({
      _id: id
    }).get().then(res => {
      if (!this.data.checkedList.includes(id) && id !== this.data.id) {
        this.data.checkedList.push(id)
        this.setData({
          checkedList: this.data.checkedList,
          totalPrice: this.data.totalPrice + Number(res.data[0].price),
        })
        // console.log(this.data.checkedList);
      } else if (this.data.checkedList.includes(id)) {
        this.data.checkedList.splice(this.data.checkedList.indexOf(id), 1)
        this.setData({
          checkedList: this.data.checkedList,
          totalPrice: this.data.totalPrice - Number(res.data[0].price),
        })
      }
    })
  },
  // 选好了
  shopEnd() {
    let user = wx.getStorageSync('user')
    if (!user) {
      wx.showToast({
        icon: 'none',
        title: '请先登录账号',
      })
      return
    }
    // console.log(this.data.checkedList);
    //跳转到购物车
    wx.reLaunch({
      url: '/pages/cart/index?commodities =' + this.data.checkedList,
    })
  },
  //跳转详情页
  todetail(e) {
    // console.log(e);
    wx.navigateTo({
      url: '/pages/detailgoods/index?id=' + e.currentTarget.dataset.id,
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
    this.getgoods()
    this.getTypeList()
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