import { BASE_URL, get, post } from './request'

module.exports = {
  sendCode: function (phone) {
    return post(`/codes?phone=${phone}&type=wechat`)
  },
  checkCode: function (phone, code) {
    return get('/codes/check', { phone, code, type: 'wechat' })
  },
}
