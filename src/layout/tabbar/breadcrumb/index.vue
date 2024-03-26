<template>
    <el-icon @click="changeIcon">
        <component :is="layoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
    </el-icon>
    <el-breadcrumb separator-icon="ArrowRight" style="margin-left: 10px">
        <el-breadcrumb-item v-for="(item, index) in route.matched" :key="index" :to="item.path">
            <el-icon>
                <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router'

let layoutSettingStore = useLayoutSettingStore()
const changeIcon = () => {
    layoutSettingStore.fold = !layoutSettingStore.fold
}
const route = useRoute()
</script>
<script lang="ts">
export default {
    name: 'Breadcrumb',
}
</script>
<style scoped></style>
