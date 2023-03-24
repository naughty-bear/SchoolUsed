// pages/approve/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: '',
    name: '',
    img: '../../images/icon-touxiang.png',
    Url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let user = wx.getStorageSync('user')
    wx.cloud.database().collection('user').where({
      _id: user._id
    }).get().then(res => {
      let val = res.data[0]
      this.setData({
        user: res.data[0],
        name: val.nickName,
        img: val.avatarUrl
      })
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
    
  },
  // 获取更新的name
  getusername(e) {
    // console.log(e);
    this.setData({
      name: e.detail.value
    })
  },
  //提交事件
  submit() {
    //更新数据到数据库
    let id = this.data.user._id
    let nickName = this.data.user.nickName
    let name = this.data.name
    //判断是否修改昵称
    if (name !== nickName || this.data.user.avatarUrl !== this.data.Url) {
      wx.cloud.database().collection('user').doc(`${id}`).update({
        data: {
          nickName: this.data.name,
          avatarUrl: this.data.Url ? this.data.Url : this.data.user.avatarUrl,
        }
      }).then(res => {
        wx.showToast({
          title: '修改成功',
        })
        // 跳转页面
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/me/index'
          })
        }, 1500)
      }).catch(error => {
        console.log("修改失败", error)
      })
    }


  },
  // 修改头像
  approveImg() {
    // console.log(this.data.img);
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'], //可以指定是原图还是压缩图，这里用压缩
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        // 图片上传
        wx.cloud.uploadFile({
          cloudPath: 'test/' + Date.parse(new Date()) + '.png',
          filePath: res.tempFiles[0].tempFilePath, // 文件路径
        }).then(res => {
          wx.showLoading({
            title: '头像上传中'
          })
          //替换云存储图片临时地址
          wx.cloud.getTempFileURL({
            fileList: [res.fileID]
          }).then(res => {

            this.setData({
              Url: res.fileList[0].tempFileURL,
              img: res.fileList[0].tempFileURL
            })
            wx.hideLoading()
          }).catch(err => {
            console.log("修改失败");
          })
        })

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