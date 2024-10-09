import { isPhone, isVrcode } from '../../utils/validator'
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify.js'
import { sendCode, checkCode } from '../../apis/user'
import { login } from '../../utils/permission'

var sendBtn // 保存send-code组件的引用

Page({
    data: {
        countries: ['中国(86)'],
        countryIndex: 0,
        countriesShow: false,
        phoneNumber: '',
        vrcode: '',
        needReturn: false,
    },
    onLoad: function (options) {
        // wx.showModal({
        //   title: '说明',
        //   content: "本项目是一个开源项目，数据均为随机生成，仅供演示使用。",
        //   showCancel: false
        // })
    },
    onReady: function () {
        sendBtn = this.selectComponent('#send-btn')
    },
    hideCountries() {
        this.setData({ countriesShow: false });
    },
    showCountries() {
        this.setData({ countriesShow: true });
    },
    onCountryChange: function (e) {
        this.setData({countryIndex: e.detail.index})
        this.hideCountries()
    },
    onInput: function (e) {
        var params = {}
        params[e.currentTarget.dataset.label] = e.detail.value
        this.setData(params)
    },
    onSend: function () {
        if (!isPhone(this.data.phoneNumber)) {
            return Notify('手机号格式不正确')
        }
        sendBtn.prepare()
        sendCode(this.data.phoneNumber).then(() => {
        //   toast.show('验证码将以短信的形式发送至您的手机')
          sendBtn.start()
        }).catch(() => sendBtn.stop())
    },
    onSubmit: function () {
        let { phoneNumber, vrcode } = this.data
        if (!isPhone(phoneNumber)) {
          return Notify('手机号格式不正确')
        }
        if (!isVrcode(vrcode)) {
          return Notify('请输入6位数字验证码')
        }
        wx.showToast({
          title: '加载中',
          icon: 'loading'
        })
        checkCode(phoneNumber, vrcode).then(res => {
          if (!login(res.data.token, res.data.user)) {
            return Promise.reject(new Error('设置登录态失败'))
          }
          // 201：创建了新的用户 200：登录成功
          if (res.statusCode === 201) {
            wx.redirectTo({ url: './children/result' })
          } else {
            wx.switchTab({ url: '/pages/home/home' })
          }
          wx.hideToast()
        })
    }
})