// pages/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     goodslist:[],
     checkedList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(JSON.parse(options.res));
    let value = JSON.parse(options.res)
    this.setData({
      goodslist:value
    })
  },
  // 加入购物车
  addGoods (e){
    //  console.log(e);
     let id = e.currentTarget.dataset.id
     if(this.data.checkedList.includes(id)){
       this.data.checkedList.splice(this.data.checkedList.indexOf(id),1)
       this.setData({
         checkedList:this.data.checkedList
       })
     }else{
       this.data.checkedList.push(id)
       this.setData({
        checkedList:this.data.checkedList
      })
     }
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