import service from '@/utils/request'

export const getDepartmentService = () => service.get('/company/department')

// 获取部门负责人信息
export const getManagerList = () => service.get('/sys/user/simple')

// 新增组织

export const addDepartmentService = (data) => service.post('company/department', data)

// 获取要更新的组件信息或指定id的组件信息

export const getDepartmentDetailService = (id) => service.get(`/company/department/${id}`)

// 更新表单

export const updateDepartmentService = (data) => service.put(`/company/department/${data.id}`, data)

// 删除组织
export const delDepartment = (id) => service.delete(`/company/department/${id}`)
