import service from '@/utils/request'

export const userLoginService = (data) => service.post('/sys/login', data)

export const getUserInfoService = () => service.get('/sys/profile')

// 修改密码
export const changePasswordService = (data) => service.put('/sys/user/updatePass')

export const getUserDetailById = (id) => service.put(`/sys/user/updatePass/${id}`)

