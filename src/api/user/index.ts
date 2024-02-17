import request from '@/utils/request'
import { LoginForm, LoginResponseData, UserReponseData } from './type'

enum API {
    LOGIN_URL = '/user/login',
    USERINFO_URL = '/user/info',
}

export const reqLogin = (data: LoginForm) => request.post<any, LoginResponseData>(API.LOGIN_URL, data)

export const reqUserInfo = () => request.get<any, UserReponseData>(API.USERINFO_URL)
