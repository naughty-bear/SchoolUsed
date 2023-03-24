import {
  createStoreBindings
} from 'mobx-miniprogram-bindings'
import {
  store
} from '../../store'
// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartGoodList: [], //加入购物车的商品列表
    totalPrice: 0, //购买商品总额
    checkAll: false, //全选
    checked: false, //单选
    num: 0, //记录勾选商品数量
    indentList: [], //订单商品id
    GoodsList: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 获取加入购物车的商品
  onLoad(options) {
    //引入mobx共享数据
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['goodsList'],
      actions: ['transmit']
    })
    // console.log(options);
    //  console.log(Object.values(options)[0].split(",")[0]);
    if (Object.values(options)[0]) {
      wx.cloud.database().collection('goods').get().then(res => {
        // console.log(res.data[0]._id);
        for (let i = 0; i < Object.values(options)[0].split(",").length; i++) {
          for (let j = 0; j < res.data.length; j++) {
            if (Object.values(options)[0].split(",")[i] === res.data[j]._id ) {
              this.data.GoodsList.push(res.data[j])
            }
          }
        }
        // 保存加入到购物车且未付款的数据
        let list = this.transmit(this.data.GoodsList)
        console.log(list);
        this.setData({
          cartGoodList: [...list],
        })
      })
    }
    
  },
  // 商品删除操作
  deleteHandle(e) {
    //  console.log(e);
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定要删除该商品',
      complete: (res) => {
        if (res.confirm) {
          for (let i = 0; i < this.data.cartGoodList.length; i++) {
            if ((this.data.cartGoodList[i]._id) == id) {
              if (this.data.totalPrice > 0) {
                this.setData({
                  totalPrice: this.data.totalPrice - Number(this.data.cartGoodList[i].price),
                })
              }
              this.data.cartGoodList.splice(i, 1),
                this.setData({
                  cartGoodList: this.data.cartGoodList,
                  checked:false
                })
            }
          }
        } else if (res.cancel) {
          console.log('取消');
        }
      }
    })
  },
  // 单选按钮
  checkboxChange(e) {

    // console.log(e);
    let id = e.currentTarget.dataset.id
    for (let i = 0; i < this.data.cartGoodList.length; i++) {
      if (this.data.cartGoodList[i]._id == id) {
        if (e.detail.value.length == 1) {
          if (!this.data.indentList.includes(id)) {
            // 勾选的商品加入订单中
            this.data.indentList.push(id)
          }
          this.setData({
            totalPrice: this.data.totalPrice + Number(this.data.cartGoodList[i].price),
            num: this.data.num + 1
          })
        } else if (this.data.num > 0 && e.detail.value.length !== 1) {
          if (this.data.indentList.includes(id)) {
            // 取消勾选的从订单商品删除
            this.data.indentList.splice(this.data.indentList.indexOf(id), 1)
          }
          this.setData({
            totalPrice: this.data.totalPrice - Number(this.data.cartGoodList[i].price),
            num: this.data.num - 1
          })
        }
      }
    }
    // 控制全选按钮
    if (this.data.num === this.data.cartGoodList.length) {
      this.setData({
        checked: true,
        checkAll: true,
      })
    } else {
      this.setData({
        checked: false,
      })
    }
  },
  // 全选按钮
  checkboxAll() {
    if (!this.data.checked) {
      for (let i = 0; i < this.data.cartGoodList.length; i++) {
        if (!this.data.indentList.includes(this.data.cartGoodList[i]._id)) {
          this.data.indentList.push(this.data.cartGoodList[i]._id)
        }
      }
      this.setData({
        checkAll: true,
        checked: true,
        totalPrice: 0,
        num: this.data.cartGoodList.length,
        indentList: this.data.indentList
      })
      // 控制单选按钮全选或全不选
      for (let i = 0; i < this.data.cartGoodList.length; i++) {
        this.setData({
          totalPrice: this.data.totalPrice + Number(this.data.cartGoodList[i].price)
        })
      }
    } else {
      this.setData({
        checkAll: false,
        checked: false,
        totalPrice: 0,
        num: 0,
        indentList: []
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  //结算
  payment() {
    // console.log(this.data.indentList);
    // 将商品订单信息加入数据库
    let openid = wx.getStorageSync('user')._id
    let cart = this.data.cartGoodList
    for (let i = 0; i < cart.length; i++) {
      for (let j = 0; j < this.data.indentList.length; j++) {
        if (cart[i]._id === this.data.indentList[j]) {
          wx.cloud.database().collection('indent').add({
            data: {
              openid: openid,
              status: 0,
              address: cart[i].site,
              price: cart[i].price,
              phone: cart[i].phone,
              goods: cart[i].content,
              name: cart[i].name,
              avatarUrl: cart[i].avatarUrl[0]
            }
          }).then(res => {
            wx.showToast({
              title: '下单成功',
            })
            // 删除数据库中已下单的商品
            for (let i = 0; i < this.data.indentList.length; i++) {
              wx.cloud.database().collection('goods').where({
                _id: this.data.indentList[i]
              }).get().then(res => {
                //商品数量大于1
                if (Number(res.data[0].num) > 1) {
                  wx.cloud.database().collection('goods').doc(`${this.data.indentList[i]}`).update({
                    data: {
                      num: String(Number(res.data[0].num) - 1)
                    }
                  }).then(res => {
                    console.log('删除成功');
                  }).catch(() => {
                    console.log('删除失败');
                  })
                } else {
                  // 商品数等于1
                  wx.cloud.database().collection('goods').doc(`${this.data.indentList[i]}`).remove().then(res => {
                    console.log('删除成功');  
                  }).catch((err) => {
                    console.log('删除失败');
                  })
                }
                this.data.cartGoodList.splice(i, 1)
              }) 
            }
            this.setData({
              cartGoodList: this.data.cartGoodList
            })
          }).catch((err) => {
            console.log(err);
            wx.showToast({
              icon: 'error',
              title: '下单失败，稍后重试',
            })
          })
        }
      }
    }
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