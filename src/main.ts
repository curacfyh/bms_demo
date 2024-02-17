import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import zhCn from 'element-plus/es/locale/lang/zh-cn'
//@ts-expect-error: Element Plus locale file import issue
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import App from './App.vue'
import 'virtual:svg-icons-register'
import globeComponents from '@/components/index'
import '@/styles/index.scss'
import router from '@/router'
import pinia from './store'

const app = createApp(App)

app.use(ElementPlus, {
    locale: zhCn,
})
app.use(globeComponents)
app.use(router)
app.use(pinia)

app.mount('#app')
