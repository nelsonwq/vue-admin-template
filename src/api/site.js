import request from '@/utils/request'
import qs from 'qs'


// 获取站点列表
export const getSiteListAPI = (params) => request.get("/site/getSiteList", { params })

// 添加站点
export const addSiteAPI = (params) => request.post("/site/getSiteListByPage", qs.stringify(params))