import service from '@/utils/request'

// 获取展示数据信息
export const getHomeDataService = () => service.get('/home/data')

// 获取消息通知数据
export const getNoticeListService = () => service.get('/home/notice')
