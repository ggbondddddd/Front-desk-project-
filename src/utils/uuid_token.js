import { v4 as uuidv4 } from 'uuid'
// 要生成一个随机字符串，且每次执行不能发生变化，游客身份持久存储
export const getUUID = () => {
    // 先从本地存储获取uuid（看一下本地存储里面是否有）
    let uuid_token = localStorage.getItem('UUIDTOKEN')
    // 如果没用我生成一个uuid
    if (!uuid_token) {
        uuid_token = uuidv4()
        // 本地存储存储这个游客身份
        localStorage.setItem('UUIDTOKEN', uuid_token)
    }
    // 切记一定要有这个返回值 不然别的地方调用你这个函数什么都不显示 undefined
    return uuid_token
}