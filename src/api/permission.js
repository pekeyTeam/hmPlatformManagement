import service from '@/utils/request'

// 获取权限列表

export const getPermissionListService = () => service.get('/sys/permission')

// 获取权限点详情
export const getPerDetailService = (id) => service.get(`/sys/permission/${id}`)

// 新增权限

export const addPermissionService = (data) => service.post('/sys/permission', data)

// 删除权限

export const delPerService = (id) => service.delete(`/sys/permission/${id}`)

