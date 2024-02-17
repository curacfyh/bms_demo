import { defineStore } from 'pinia'
import type { LoginForm } from '@/api/user/type'
import { reqLogin } from '@/api/user'

const useUserStore = defineStore('User', () => {
    const state = {
        userName: 'admin',
        password: '111111',
    }
    let token = localStorage.getItem('token') ?? ''

    const userLogin = async (data: LoginForm) => {
        const result: any = await reqLogin(data)
        if (result.code === 200) {
            token = result.data.token
            localStorage.setItem('token', token)
            return 'ok'
        } else {
            return Promise.reject(new Error(result.data.message))
        }
    }
    return { state, token, userLogin }
})

export default useUserStore
