<template>
    <div>
        <router-view v-slot="{ Component }">
            <transition name="fade">
                <component :is="Component" :key="componentKey" />
            </transition>
        </router-view>
    </div>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { ref, watchEffect } from 'vue'
const layoutSettingStore = useLayoutSettingStore()
const componentKey = ref(0)
watchEffect(() => {
    if (layoutSettingStore.refresh) {
        componentKey.value++
        layoutSettingStore.resetRefresh()
    }
})
</script>
<script lang="ts">
export default {
    name: 'MainContent',
}
</script>
<style scoped>
.fade-enter-from {
    opacity: 0;
    transform: scale(0);
}
.fade-enter-active {
    transition: all 1s;
}
.fade-enter-to {
    opacity: 1;
    transform: scale(1);
}
</style>
