<template>
    <div class="tabbar">
        <div class="tabbar_left">
            <Breadcrumb></Breadcrumb>
        </div>
        <div class="tabbar_right">
            <Setting></Setting>
        </div>
    </div>
</template>

<script setup lang="ts">
import Breadcrumb from '@/layout/tabbar/breadcrumb/index.vue'
import Setting from '@/layout/tabbar/settingbar/index.vue'
</script>
<script lang="ts">
export default {
    name: 'Tabbar',
}
</script>
<style scoped lang="scss">
.tabbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    .tabbar_left {
        display: flex;
        align-items: center;
    }
    .tabbar_right {
        display: flex;
        align-items: center;
    }
}
</style>
