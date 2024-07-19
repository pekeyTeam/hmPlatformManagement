import service from '@/utils/request'

// 获取角色数据

export const getRoleListService = (params) => service.get('/sys/role', {
  params
})

// 新增角色数据

export const addRoleService = (data) => service.post('/sys/role', data)

// 更新角色数据

export const updateRoleService = (data) => service.put(`/sys/role/${data.id}`, data)
// export const updateRoleService = (data) => service({
//   url: `/sys/role/${data.id}`,
//   method: 'put',
//   data
// })

// 删除角色

export const delRoleService = (id) => service.delete(`/sys/role/${id}`)

// 获取角色详情

export const getRoleDetailService = (id) => service.get(`/sys/role/${id}`)

// 分配角色权限

export const givePermService = (data) => service.put('/sys/role/assignPrem', data)
