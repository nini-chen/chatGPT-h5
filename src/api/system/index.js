/*
 * @Author: neon_chen 1826650603@qq.com
 * @Date: 2023-12-21 15:12:40
 * @LastEditors: neon_chen 1826650603@qq.com
 * @LastEditTime: 2023-12-29 10:30:15
 * @FilePath: \vite-project\src\api\system\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from "../../utils/request"
/**
 * 获取窗口列表
 */
export function getWindowApi(data) {
  return request({
    url: '/talk.php',
    method: 'post',
    data,
  });
}
/**
 * 添加窗口
 */
export function createWindowApi(data) {
  return request({
    url: '/talk.php',
    method: 'post',
    data,
  });
}
export function editSeesion(data) {
  return request({
    url: '/talk.php',
    method: 'post',
    data,
  });
}
/**
 * 提问
 */
export function askQuestion(url, data) {
  return request({
    url: url,
    method: 'post',
    data,
  });
}

/**
 * 回答
 */
export function getAnswer(params) {
  return request({
    url: '/stream.php',
    method: 'get',
    params,
    responseType: 'stream',
    headersp: {
      'Accept': 'text/event-stream'
    }
  });
}

/**
 * 异常上报
 */
export function errorReport(data) {
  return request({
    url: '/report.php',
    method: 'post',
    data,
  });
}
/**
 * 获取历史记录（最近10条问答内容）
 */
export function getHistorySessionApi(data) {
  return request({
    url: '/talk.php',
    method: 'post',
    data,
  });
}

export function deleteSeesion(data) {
  return request({
    url: '/talk.php',
    method: 'post',
    data,
  });
}