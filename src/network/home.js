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
// 获取权限列表
export function getRights(type) {
  return request({
    url: "rights/" + type,
    method: "get"
  })
}
// 获取角色列表
export function getRoles() {
  return request({
    url: "roles",
    method: "get"
  })
}
// 添加角色
export function addroless(roleName, roleDesc) {
  return request({
    url: "roles",
    method: "post",
    data: {
      roleName,
      roleDesc
    }
  })
}
//获取角色id
export function getRolesID(ID) {
  return request({
    url: "roles/" + ID,
    method: "get"
  })
}
// 编辑提交角色
export function putRoles(ID, roleName, roleDesc) {
  return request({
    url: "roles/" + ID,
    method: "put",
    data: {
      roleName,
      roleDesc
    }
  })
}
//删除角色
export function deleteRolesList(ID) {
  return request({
    url: "roles/" + ID,
    method: "delete"
  })
}
// 删除用户指定权限

export function deleteRolesRight(rolesID, rightID) {
  return request({
    url: "roles/" + rolesID + "/rights/" + rightID,
    method: "delete"
  })
}
// 获取所有的权限
export function showSetRightVisiable() {
  return request({
    url: "rights/tree",
    method: "get"
  })
}

// 角色授权
export function pushRolesRight(rolesID, rids) {
  return request({
    url: "roles/" + rolesID + "/rights/",
    method: "post",
    data: {
      rids
    }
  })
}
// 分配用户角色
export function pushRolesUser(rolesID, rid) {
  return request({
    url: "users/" + rolesID + "/role",
    method: "put",
    data: {
      rid
    }
  })
}