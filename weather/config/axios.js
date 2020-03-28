import config from './config.js'


function axios(method = 'get', url, data = '') {
  var baseUrl = config.baseUrl
  /*
  params请求需要的参数
  method get post
  url ：
  data：
  */
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      method: method,
      data: data,
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

module.exports = {
  axios: axios,
};