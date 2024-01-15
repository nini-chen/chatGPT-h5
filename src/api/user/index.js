/*
 * @Author: neon_chen 1826650603@qq.com
 * @Date: 2023-12-21 14:56:38
 * @LastEditors: neon_chen 1826650603@qq.com
 * @LastEditTime: 2023-12-22 09:47:16
 * @FilePath: \vite-project\src\api\user\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from "../../utils/request"

export function getUserInfoApi(data) {
  return request({
    url: '/talk.php',
    method: 'post',
    data,
  }); 
}


