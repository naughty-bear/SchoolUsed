import {observable,action} from 'mobx-miniprogram'

//es6导出语法
export const store = observable({
  goodsList: [],
  transmit: action(function (e) {
      e.map(item => {
        this.goodsList.push(item)
      })
    return this.goodsList
  })
})