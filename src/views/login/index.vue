<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginFormRef">
                    <h1>hello</h1>
                    <h2>欢迎查看BMS DEMO</h2>
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input
                            type="password"
                            :prefix-icon="Lock"
                            v-model="loginForm.password"
                            show-password
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" class="login_btn" type="primary" @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getDayPeriod } from '@/utils/time'

let loginForm = reactive({
    username: 'admin',
    password: '111111',
})

const validateUsername = (_rule: any, value: any, callback: any) => {
    if (value.length >= 5) {
        callback()
    } else {
        callback(new Error('用户名长度不能小于5'))
    }
}
const validatePassword = (_rule: any, value: any, callback: any) => {
    if (value.length >= 6) {
        callback()
    } else {
        callback(new Error('密码长度不能小于6'))
    }
}
const rules = reactive({
    username: [
        // { required: true, message: '请输入用户名', trigger: 'blur' },
        // { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
        { trigger: 'change', validator: validateUsername },
    ],
    password: [
        // { required: true, message: '请输入密码', trigger: 'blur' }
        { trigger: 'change', validator: validatePassword },
    ],
})
let loading = ref(false)
let loginFormRef = ref()

let userStore = useUserStore()
let $router = useRouter()
let $route = useRoute()

const login = async () => {
    await loginFormRef.value.validate()
    loading.value = true
    try {
        await userStore.userLogin(loginForm)
        $router.push({ path: ($route.query.redirect as string) || '/' })
        ElNotification({
            title: '登录成功',
            type: 'success',
            message: `${getDayPeriod()}好`,
        })
    } catch (error) {
        ElNotification({
            title: '登录失败',
            message: (error as Error).message,
            type: 'error',
        })
    } finally {
        loading.value = false
    }
}
</script>

<style scoped lang="scss">
.login_container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.webp') no-repeat;
    background-size: cover;
    // box-shadow: 0 14px 18px rgba(0, 0, 0, 0.5);
    .login_form {
        position: relative;
        width: 60%;
        top: 30vh;
        background: url('@/assets/images/login_form.png') no-repeat;
        background-size: cover;
        padding: 40px;
        h1 {
            font-size: 40px;
            color: #fff;
        }
        h2 {
            font-size: 20px;
            color: #fff;
            margin: 20px 0;
        }
        .login_btn {
            width: 100%;
        }
    }
}
</style>
