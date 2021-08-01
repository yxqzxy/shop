import request from './requier'
export function getHomeGoods(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
