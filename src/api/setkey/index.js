import request from "../../utils/request"


/**
 * KEY配置信息-获取列表
 */
export function getSetkeyList(data) {
  return request({
    url: '/setkey.php',
    method: 'post',
    data,
  });
}
/**
 * KEY配置信息-添加
 */
export function createSetkey(data) {
  return request({
    url: '/setkey.php',
    method: 'post',
    data,
  });
}

/**
 * KEY配置信息-启用
 */
export function updateSetkey(data) {
  return request({
    url: '/setkey.php',
    method: 'post',
    data,
  });
}
/**
 * KEY配置信息-删除
 */
export function delectSetkey(data) {
  return request({
    url: '/setkey.php',
    method: 'post',
    data,
  });
}