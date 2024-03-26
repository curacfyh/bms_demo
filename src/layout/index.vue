<template>
    <div class="layout_container">
        <div class="layout_slider" :class="{ fold: layoutSettingStore.fold ? true : false }">
            <Logo></Logo>
            <el-scrollbar class="scroll_bar">
                <el-menu
                    :collapse="layoutSettingStore.fold ? true : false"
                    background-color="001529"
                    text-color="white"
                    :default-active="$route.path"
                >
                    <Sidebar :menuList="userStore.menuRoutes"></Sidebar>
                </el-menu>
            </el-scrollbar>
        </div>
        <div class="layout_right">
            <div class="layout_tabbar">
                <Tabbar></Tabbar>
            </div>
            <div class="layout_main">
                <Main></Main>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Logo from '@/layout/logo/index.vue'
import Sidebar from '@/layout/sidebar/index.vue'
import Main from '@/layout/main/index.vue'
import Tabbar from '@/layout/tabbar/index.vue'
import useUserStore from '@/store/modules/user'
import useLayoutSettingStore from '@/store/modules/setting'
let userStore = useUserStore()
let layoutSettingStore = useLayoutSettingStore()

let $route = useRoute()
</script>
<script lang="ts">
export default {
    name: 'Layout',
}
</script>
<style scoped lang="scss">
.layout_container {
    display: flex;
    width: 100%;
    height: 100vh;

    .layout_slider {
        width: $base-menu-width;
        height: 100vh;
        background: $base-menu-background;
        color: white;
        transition: 0.3s;
        .scroll_bar {
            width: 100%;
            height: calc(100vh - $base-menu-logo-height);
            .el-menu {
                border-right: none;
            }
        }
        &.fold {
            width: $base-menu-min-width;
            transition: 0.3s;
        }
    }

    .layout_right {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        // height: 100vh;

        .layout_tabbar {
            width: 100%;
            height: $base-tabbar-height;
            flex-shrink: 0;
        }

        .layout_main {
            flex-grow: 1;
            padding: 20px;
            overflow: auto;
        }
    }
}
</style>
