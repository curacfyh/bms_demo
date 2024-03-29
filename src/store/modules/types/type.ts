import { CategoryObj } from '@/api/product/attr/type'
import { RouteRecordRaw } from 'vue-router'

export interface UserState {
    token: string | null
    menuRoutes: RouteRecordRaw[]
    username: string
    avatar: string
}

export interface CategoryState {
    c1Id: string | number
    c2Id: string | number
    c3Id: string | number
    c1Arr: CategoryObj[]
    c2Arr: CategoryObj[]
    c3Arr: CategoryObj[]
}
