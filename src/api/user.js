import request from '@/utils/request'
import qs from 'qs'

// 登录系统
export const loginAPI = (data) => request.post("/managerLogin", qs.stringify(data))

// 获取用户信息（姓名，头像）
export const getInfoAPI = (token) => request.post("/getInfo", qs.stringify(token))


// 添加用户
export const addUserInfAPI = (params) => request.post("/user/addUser", qs.stringify(params))

// 获取用户列表
export const getUserListAPI = (params) => request.get("/user/userList", { params })

// 获取用户回收站列表
export const getUserDeletedListAPI = (params) => request.get("/user/userDeletedList", { params })

// 退出系统
export const logoutAPI = () => request.get("/logOut")

// 获取站点列表
export const getSiteListAPI = () => request.get("/site/getSiteList")

// 更新用户信息
export const updateUserInfAPI = (params) => request.put("/user/updateUserInf", qs.stringify(params))

// 逻辑删除用户
export const deleteUserInfAPI = (params) => request.delete(`/user/removeUser/${params}`)

// 物理删除用户
export const removeUserDeletedAPI = (params) => request.delete(`/user/removeUserDeleted/${params}`)

// 恢复回收站用户
export const recoverUserDeletedAPI = (params) => request.put(`/user/recoverUserDeleted/${params}`)
