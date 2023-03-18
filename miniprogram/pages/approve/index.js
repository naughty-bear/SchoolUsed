// pages/approve/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: '',
    name: '',
    img: '../../images/icon-touxiang.png'
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
    wx.cloud.database().collection('user').where({
      _id: user._id
    }).get().then(res => {
      // console.log(res);
      let val = res.data[0]
      this.setData({
        user: res.data[0],
        name: val.nickName,
        // img: val.avatarUrl
      })
    })
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
    if (name !== nickName) {
      wx.cloud.database().collection('user').doc(`${id}`).update({
        data: {
          nickName: this.data.name,
        }
      }).then(res => {
        wx.showToast({
          title: '修改成功',
        })
      })
    }
    //判断头像是否修改
    debugger
    
      //图片的上传
console.log(this.data.img);
      wx.cloud.uploadFile({
        cloudPath: this.data.user._id + Date.parse(new Date())+'.png',
        filePath: this.data.img.tempFilePath, // 文件路径
      }).then(res => {
        console.log('res',res);
        // get resource ID
        wx.cloud.getTempFileURL({
          fileList:[res.fileID]
        })
        wx.showLoading({
          title: '头像上传中'
        })
        let fileID = res.fileID
        wx.cloud.database().collection('user').doc(`${id}`).update({
          data: {
            avatarUrl: fileID,
          }
        }).then(res => {
          //图片加载成功后隐藏上传效果
          wx.hideLoading()
          wx.showToast({
            title: '修改成功',
          })
        })
      }).catch(error => {
        wx.hideLoading()
        console.log("上传失败", error)
      })
    
    // 跳转页面
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/me/index'
      })
    }, 1500)

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
        console.log('res',res);
        let id = this.data.user._id
        // wx.cloud.database().collection('user').doc(`${id}`).update({
        //   data: {
        //     avatarUrl: res.tempFiles[0].tempFilePath,
        //   }
        // }).then(res => {
        //   console.log(res);
        // })
        // console.log("选择图片成功", res)
        this.setData({
          img: res.tempFiles[0]
        })
        console.log(this.data.img);
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