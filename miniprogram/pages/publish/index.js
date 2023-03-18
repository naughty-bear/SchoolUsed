// pages/publish/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeArr: ['电子产品', '书籍资料', '体育用品', '生活用品', '衣物'],
    _type: '请选择商品类型',
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    urls: '',
    goodstype: '',
    goodsname: '',
    goodsprice: '',
    goodsnumber: '',
    goodsdescription: '',
    goodsphone: '',
    goodssite:'',
    goodsimg: '',
    tab: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  //选择商品类型
  selectType(e) {
    this.setData({
      _type: this.data.typeArr[e.detail.value],
    })
  },
  // 删除图片
  clearImg(e) {
    // console.log(e);
    var nowList = []; //新数据
    var uploaderList = this.data.uploaderList; //原数据
    for (let i = 0; i < uploaderList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        continue;
      } else {
        nowList.push(uploaderList[i])
      }
    }
    this.setData({
      uploaderNum: this.data.uploaderNum - 1,
      uploaderList: nowList,
      showUpload: true
    })
  },
  //展示图片
  showImg(e) {
    var that = this;
    wx.previewImage({
      urls: that.data.uploaderList,
      current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
  },
  //上传图片
  upload() {
    let that = this
    wx.chooseMedia({
      //默认为1的直接把num值变就可以了
      count: 4 - that.data.uploaderNum,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFiles[0].tempFilePath;
        let uploaderList = that.data.uploaderList.concat(tempFilePaths);
        // console.log(uploaderList);
        if (uploaderList.length == 4) {
          that.setData({
            showUpload: false
          })
        }
        that.setData({
          uploaderList: uploaderList,
          uploaderNum: uploaderList.length,
        })
      }
    })
  },
  // 获取商品信息
  publish(e) {
    // console.log(e);
    let user = wx.getStorageSync('user')
    if(!user){
      wx.showToast({
        icon:'none',
        title: '请先登录账号',
      })
      return
    }
    // 上传数据库
    let name = e.detail.value.goodsName
    let _type = e.detail.value._type
    // console.log(e);
    // console.log(_type);
    let price = e.detail.value.goodsPrice
    let uploaderList = this.data.uploaderList
    let site = e.detail.value.site
    if (!this.data.tab) {
      if (name && _type !== '请选择商品类型' && price && uploaderList.length > 0 && site) {
        wx.cloud.database().collection('goods').add({
          data: {
            name: e.detail.value.goodsName,
            price: e.detail.value.goodsPrice,
            _type: e.detail.value._type,
            num: e.detail.value.goodsNumber,
            content: e.detail.value.description,
            phone: e.detail.value.phone,
            avatarUrl: this.data.uploaderList,
            phoneID: user._id,
            site:e.detail.value.site
          }
        }).then(res => {
          wx.showToast({
            title: '发布成功',
          })
          //清空输入框
          this.setData({
            _type: '请选择商品类型',
            goodstype: '',
            goodsname: '',
            goodsprice: '',
            goodsnumber: '',
            goodsdescription: '',
            goodsphone: '',
            goodssite:'',
            uploaderList: [],
          })
        }).catch(() => {
          wx.showToast({
            icon: 'error',
            title: '发布失败',
          })
        })
      } else {
        wx.showToast({
          icon: 'error',
          title: '请完整填写信息',
        })
      }
    } else {
      wx.cloud.database().collection('goods').doc(this.data._id).update({
        data: {
          name: e.detail.value.goodsName,
          price: e.detail.value.goodsPrice,
          _type: e.detail.value._type,
          num: e.detail.value.goodsNumber,
          content: e.detail.value.description,
          phone: e.detail.value.phone,
          site:e.detail.value.site
        }
      }).then(res => {
        //清空输入框
        this.setData({
          _type: '请选择商品类型',
          goodsname: '',
          goodsprice: '',
          goodsnumber: '',
          goodsdescription: '',
          goodsphone: '',
          goodssite:'',
          tab:''
        })

        wx.navigateTo({
          url: '/pages/mypublish/index',

        })
        wx.showToast({
          title: '修改成功',
        }, 2000)
      }).catch(() => {
        wx.showToast({
          icon: 'error',
          title: '修改失败',
        })
      })

    }

  },

  // 取消编辑
  goback() {
    wx.navigateTo({
      url: '/pages/mypublish/index',
    })
    this.setData({
      _type: '请选择商品类型',
      goodsname: '',
      goodsprice: '',
      goodsnumber: '',
      goodsdescription: '',
      goodsphone: '',
      goodssite:'',
      tab:''
    })
    wx.clearStorageSync()
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
    // 获取小程序的页面栈
    let pages = getCurrentPages();
    //数组中索引最大的页面--当前页面
    let currentPage = pages[pages.length - 1]
    // console.log(JSON.parse(currentPage.options.res));
    // console.log(currentPage.options.id)
    this.setData({
      tab: currentPage.options.id
    })
    if (pages && this.data.tab) {
      // console.log(currentPage.options._id);
      let value = JSON.parse(currentPage.options.res)
      this.setData({
        _type: this.data.typeArr[value[0]._type],
        goodsname: value[0].name,
        goodsprice: value[0].price,
        goodsnumber: value[0].num,
        goodsdescription: value[0].content,
        goodsphone: value[0].phone,
        goodssite:value[0].site,
        _id: currentPage.options._id
      })
    }
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