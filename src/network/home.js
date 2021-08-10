import request from './requier'
export function getHomeGoods(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
export function getMenuitems() {
  return request({
    url: "menus",
    method: "get"
  })
}
export function getUserList(query, pagenum, pagesize) {
  return request({
    url: "users",
    method: "get",
    params: {
      query: query,
      pagenum: pagenum,
      pagesize: pagesize
    }
  })
}
export function putUserStatus(uId, type) {
  return request({
    url: "users/" + uId + "/state/" + type,
    method: "put"
  }
  )
}
// 添加用户
export function putUserInfo(username, password, email, mobile) {
  return request({
    url: "users",
    method: "post",
    data: {
      username,
      password,
      email,
      mobile
    }
  }
  )
}
// 根据ID查询角色
export function getUerId(id) {
  return request({
    url: "users/" + id,
    method: "get"
  })
}
// 修改用户发送请求
export function editUserInfo(id, email, mobile) {
  return request({
    url: "users/" + id,
    method: "put",
    data: {
      email,
      mobile
    }
  })
}
// 删除用户发送请求
export function deleteUerId(id) {
  return request({
    url: "users/" + id,
    method: "delete"
  })
}
