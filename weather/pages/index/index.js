import getRq from '../../config/axios.js'
import getNow from '../../utils/js/nowDate.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    location: [],
    now: {},
    city: '',
    imageAnimation: '',
    barAnimation: '',
    imgIdx: 0,
    // 天气类型
    weatherCode: 0,
    // 晴 雨/云 风 雪
    weatherColor: ['#dae3fd', '#efefef', '#e6e6e6', '#d5d5d5'],
    // 图片切换
    imgs: ['sun-none.png', 'cloud-none.png',
      'rain-none.png', 'snow-none.png'
    ],
    nowDate: null
  },

  //获取地理位置
  changeRegion: function(e) {
    this.setData({
      location: e.detail.value,
      city: e.detail.value[2]
    })
    wx.showLoading({
      title: '加载中...',
    })
    this.getWeater(); //更新天气
  },

  //获取天气信息
  getWeater(lon, lat) {
    var that = this
    var loca = null;
    (typeof lon !== 'undefined') ? loca = `${lon},${lat}`:
      loca = that.data.city
    var data = {
      location: loca,
      key: '3eb82e2910d44fb2a96fe6ada30e8acf'
    }
    try {
      getRq.axios('get', '/now?', data).then(val => {
        let result = val.HeWeather6[0]
        result.now.type ='℃'
        that.setData({
          now: result.now,
          location: [result.basic.admin_area, result.basic.parent_city, result.basic.location],
          city: result.basic.location
        })
        // 根据天气改变颜色
        that.changeBarColor(result.now.cond_code)
      })
    } catch (e) {
      wx.hideLoading()
      wx.showToast({
        title: '未知错误',
        icon: 'none'
      })
    }
  },

  //获取经纬度
  getLocation(e) {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.getWeater(res.longitude, res.latitude)
      },
      fail: function(res) {
        wx.hideLoading()
        wx.showToast({
          title: '未能成功获取地址',
          icon: 'none'
        })
      }
    })
  },

  // 根据天气编码改变背景颜色
  changeBarColor(code) {
    var idx = 0
    if (this.data.barAnimation == 'animated flipInX')
      this.setData({
        barAnimation: '',
        imageAnimation: ''
      })
    var imgI = this.data.imgIdx
    if (code == 100)
      idx = 0;
    else if (200 < code < 213)
      idx = 1
    else if (300 < code < 400)
      idx = 2
    else
      idx = 3
    this.setData({
      [`imgs[${imgI}]`]: this.data.imgs[imgI].replace('use', 'none'),
      [`imgs[${idx}]`]: this.data.imgs[idx].replace('none', 'use'),
      imgIdx: idx,
    })
    // 动画添加
    this.animate('.weather', [{
        opacity: 1.0,
        backgroundColor: this.data.weatherColor[imgI]
      },
      {
        opacity: 0.6,
        backgroundColor: this.data.weatherColor[idx]
      },
    ], 2000)
    this.animate('.contentText', [{
      translateX: '20px',
      opacity: 0,
      offset: 0,
    }, {
      translateX: '10px',
      opacity: 0.5,
      offset: 0.5,
    }, {
      translateX: '0px',
      opacity: 1.0,
      offset: 1
    }], 2000)
    this.setData({
      imageAnimation: 'animated bounce',
      barAnimation: 'animated flipInX'
    })
    wx.hideLoading()
  },

  //获取当前时间
  getNowDate() {
    var now = getNow.nowDate();
    this.setData({
      nowDate: `${now[0]}/${now[1]}/${now[2]}`
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    wx.showLoading({
      title: '刷新中...',
    })
    this.getNowDate();
    this.getWeater();
    // this.getLocation();
    // this.drawAnimate()
    wx.stopPullDownRefresh()
  },

  // 动画
  drawAnimate(){
    this.animate('.date', [{
      translateX: '20px',
      opacity: 0,
      offset: 0,
    }, {
      translateX: '10px',
      opacity: 0.5,
      offset: 0.5,
    }, {
      translateX: '0px',
      opacity: 1.0,
      offset: 1
    }], 2000)
    this.animate('.details', [{
      translateX: '-20px',
      opacity: 0,
      offset: 0,
    }, {
      translateX: '-10px',
      opacity: 0.5,
      offset: 0.5,
    }, {
      translateX: '0px',
      opacity: 1.0,
      offset: 1
    }], 2000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getNowDate();
    this.getLocation();
  }
})