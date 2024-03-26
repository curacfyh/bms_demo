import type { App } from 'vue'
import SvgIcon from './SvgIcon/index.vue'
import Category from './Category/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const allGlobalComponents: any = { SvgIcon, Category }

export default {
    install(app: App) {
        Object.keys(allGlobalComponents).forEach((key: string) => {
            app.component(key, allGlobalComponents[key])
        })
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
    },
}
