import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import { CategoryResponseData } from '@/api/product/attr/type'
import { CategoryState } from './types/type'

const useCategoryStore = defineStore('Category', {
    state: (): CategoryState => ({
        c1Arr: [],
        c1Id: '',
        c2Arr: [],
        c2Id: '',
        c3Arr: [],
        c3Id: '',
    }),

    actions: {
        async getC1() {
            const res: CategoryResponseData = await reqC1()
            if (res.code === 200) {
                this.c1Arr = res.data
            }
        },
        async getC2() {
            const res: CategoryResponseData = await reqC2(this.c1Id)
            if (res.code === 200) {
                this.c2Arr = res.data
            }
        },
        async getC3() {
            const res: CategoryResponseData = await reqC3(this.c2Id)
            if (res.code === 200) {
                this.c3Arr = res.data
            }
        },
    },
})

export default useCategoryStore
