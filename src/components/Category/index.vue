<template>
    <el-card>
        <el-form :inline="true">
            <el-form-item label="一级分类">
                <el-select :disabled="isDisabled" v-model="categoryStore.c1Id" @change="handler" style="width: 240px">
                    <el-option
                        v-for="(c1, index) in categoryStore.c1Arr"
                        :key="index"
                        :label="c1.name"
                        :value="c1.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select :disabled="isDisabled" v-model="categoryStore.c2Id" @change="handler1" style="width: 240px">
                    <el-option
                        v-for="(c2, index) in categoryStore.c2Arr"
                        :key="index"
                        :label="c2.name"
                        :value="c2.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select :disabled="isDisabled" v-model="categoryStore.c3Id" @change="handler2" style="width: 240px">
                    <el-option
                        v-for="(c3, index) in categoryStore.c3Arr"
                        :key="index"
                        :label="c3.name"
                        :value="c3.id"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category'
import { computed, onMounted } from 'vue'

const props = defineProps({
    scene: Number,
})

const isDisabled = computed(() => props.scene !== 0)

const categoryStore = useCategoryStore()

onMounted(() => {
    categoryStore.getC1()
})

const handler = () => {
    categoryStore.c2Id = ''
    categoryStore.c3Id = ''
    categoryStore.c3Arr = []

    categoryStore.getC2()
}

const handler1 = () => {
    categoryStore.c3Id = ''

    categoryStore.getC3()
}

const handler2 = () => {
    console.log(categoryStore.c3Id)
}
</script>

<style scoped></style>
