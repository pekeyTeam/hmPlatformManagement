import service from '@/utils/request'

// 获取员工数据

export const getEmployeeListService = (params) => service.get('/sys/user', {
  params
})

// 获取员工excel数据

export const getExcelEmployee = () => service.get('/sys/user/export', {
  responseType: 'blob'
})

// 获取员工导入模板

export const getTemplateService = () => service.get('/sys/user/import/template', {
  responseType: 'blob'
})

// 上传员工表
export const upLoadTemplateService = (data) => service.post('/sys/user/import', data)

// 删除员工

export const delEmployeeService = (id) => service.delete(`/sys/user/${id}`)

// 新增员工
export const addEmployeeService = (data) => service.post('/sys/user', data)

// 获取员工详情

export const getEmployeeDetailService = (id) => service.get(`/sys/user/${id}`)

// 修改员工信息

export const updateEmployeeDetailService = (data) => service.put(`/sys/user/${data.id}`, data)

// 获取已启用的员工角色
export const getEnableRolePermissionService = () => service.get('/sys/role/list/enabled')

// 修改员工角色

export const updateRolePermissionService = (data) => service.put('/sys/user/assignRoles', data)
