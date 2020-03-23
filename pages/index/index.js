import getRq from '../../config/axios.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    location: [],
    now: '',
    city: '',
    weatherCode: 0,
    // 晴 雨 风 雪
    weatherColor: ['#e5e6fe', '#9fa4ad', '#efefef', '#e6e6e6']
  },

  //获取地理位置
  changeRegion: function(e) {
    this.setData({
      location: e.detail.value,
      city: e.detail.value[2]
    })
    wx.showLoading({
      title: '加载中',
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
        var result = val.HeWeather6[0]
        that.setData({
          now: result.now,
          location: [result.basic.admin_area, result.basic.parent_city, result.basic.location]
        })
        // 根据天气改变颜色
        that.changeBarColor(result.now.cond_code)
      })
    } catch (e) {
      wx.hideLoading()
      wx.showToast({
        title: '为止错误',
      })
    }
  },

  //获取经纬度
  getLocation(e) {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res);
        var longitude = res.longitude
        var latitude = res.latitude
        that.getWeater(longitude, latitude)
      }
    })
  },

  // 根据天气编码改变背景颜色
  changeBarColor(code) {
    var color = ''
    if (code == 100)
      color = this.data.weatherColor[0];
    else if (200 < code < 213)
      color = this.data.weatherColor[1];
    else if (300 < code < 400)
      color = this.data.weatherColor[2];
    else
      color = this.data.weatherColor[3];
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color,
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getLocation();
  }
})