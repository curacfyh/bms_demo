<template>
    <el-button size="small" icon="Refresh" circle @click="refresh"></el-button>
    <el-button size="small" icon="FullScreen" circle @click="toggleFullscreen"></el-button>
    <el-button size="small" icon="Setting" circle></el-button>
    <img :src="userStore.avatar" alt="" style="width: 24px; height: 24px; margin: 0 10px" />
    <el-dropdown>
        <span class="el-dropdown-link">
            {{ userStore.username }}
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'
import screenfull from 'screenfull'
import { useRouter, useRoute } from 'vue-router'

const layoutSettingStore = useLayoutSettingStore()
const refresh = () => {
    layoutSettingStore.refresh = !layoutSettingStore.refresh
}
let userStore = useUserStore()
let $router = useRouter()
let $route = useRoute()

function toggleFullscreen() {
    if (screenfull.isEnabled) {
        screenfull.toggle().catch((err) => {
            console.error(`全屏切换失败: ${err}`)
        })
    } else {
        console.error('此浏览器不支持全屏模式')
    }
}

const logout = async () => {
    await userStore.logout()
    $router.push({ name: 'login', query: { redirect: $route.path } })
}
</script>

<style scoped></style>
