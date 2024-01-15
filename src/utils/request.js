import axios from 'axios'
import qs from 'qs'
import {
  showToast
} from 'vant';
console.log(
  import.meta.env.VITE_BASE_URL)
// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000 // request timeout
})


service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    if (config.params) {
      config.params = config.params._rawValue
    }
    if (config.data) {
      console.info(config.data._rawValue)
      config.data = qs.stringify(config.data._rawValue)
    }
    return config
  },
  error => {
    console.log('request---',
      error) // for debug
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const toast = document.getElementsByClassName('van-toast')
    if (toast.length) {
      toast[0].style.backgroundColor = '#fff';
    }
    showToast({
      message: `<div style="height:22px;display:flex;justify-content: center;align-items: center;"><i class="van-icon van-icon-fail" style="font-size:16px;margin-right:5px;color:#000"></i><span style="color:#000">请求失败，请联系管理员</span></div>`,
      type: 'html'
    });

    console.log('response---err' + error) // for debug
    return Promise.reject(error)
  })

export default service