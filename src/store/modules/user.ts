import { defineStore } from 'pinia'
import type { LoginFormData, LoginResponseData, UserInfoResponseData } from '@/api/user/type'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import { UserState } from './types/type'
import { getLocalToken, setLocalToken, removeLocalToken } from '@/utils/token'
import { constantRoutes } from '@/router/routes'

const useUserStore = defineStore('User', {
    state: (): UserState => {
        const token = getLocalToken()
        return {
            token: token,
            menuRoutes: constantRoutes,
            username: '',
            avatar: '',
        }
    },
    actions: {
        async userLogin(data: LoginFormData) {
            const loginResp: LoginResponseData = await reqLogin(data)
            if (loginResp.code === 200) {
                this.token = loginResp.data as string
                setLocalToken(loginResp.data as string)
                return 'ok'
            } else {
                return Promise.reject(new Error(loginResp.data))
            }
        },
        // 感觉这个逻辑应该放到登录时处理
        async userInfo() {
            const userInfoResp: UserInfoResponseData = await reqUserInfo()
            if (userInfoResp.code === 200) {
                this.username = userInfoResp.data.name
                this.avatar = userInfoResp.data.avatar
                return 'ok'
            } else {
                return Promise.reject(new Error(userInfoResp.message))
            }
        },
        async userLogout() {
            const logoutResp = await reqLogout()
            if (logoutResp.code === 200) {
                this.token = ''
                this.username = ''
                this.avatar = ''
                removeLocalToken()
                return 'ok'
            } else {
                return Promise.reject(new Error(logoutResp.message))
            }
        },
    },
})

export default useUserStore
