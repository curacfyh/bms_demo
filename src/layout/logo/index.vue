<template>
    <div class="logo" v-if="setting.showLogo">
        <img :src="setting.logo" alt="" />
        <p>后台管理系统模板</p>
    </div>
</template>

<script setup lang="ts">
import setting from '@/setting'
</script>
<script lang="ts">
export default {
    name: 'Logo',
}
</script>
<style scoped lang="scss">
.logo {
    width: 100%;
    height: $base-menu-logo-height;
    color: white;
    display: flex;
    align-items: center;
    padding: 0 10px 0 10px;
    img {
        width: 40px;
        height: 40px;
    }
    p {
        font-size: $base-menu-logo-title-font-size;
        margin-left: 10px;
        white-space: nowrap; // 防止文本换行
        overflow: hidden; // 再次确认文本溢出时隐藏
        text-overflow: ellipsis; // 文本溢出时显示省略号
    }
}
</style>
