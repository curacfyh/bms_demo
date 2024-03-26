import router from './router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import useUserStore from './store/modules/user'
import pinia from './store'
import setting from './setting'

nprogress.configure({ showSpinner: false })

const userStore = useUserStore(pinia)

router.beforeEach(async (to, _, next) => {
    document.title = `${setting.title} - ${to.meta.title}`
    nprogress.start()
    const token = userStore.token
    const username = userStore.username
    if (token) {
        if (to.path === '/login') {
            next({ path: '/' })
        } else {
            if (username) {
                next()
            } else {
                try {
                    await userStore.userInfo()
                    next()
                } catch (error) {
                    await userStore.logout()
                    next({ path: '/login', query: { redirect: to.path } })
                }
            }
        }
    } else {
        if (to.path === '/login') {
            next()
        } else {
            next({ path: '/login', query: { redirect: to.path } })
        }
    }
})

router.afterEach(() => {
    nprogress.done()
})
