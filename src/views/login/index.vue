<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="login_form">
                    <h1>hello</h1>
                    <h2>欢迎查看BMS DEMO</h2>
                    <el-form-item>
                        <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item>
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
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'

let loginForm = reactive({
    username: 'admin',
    password: '111111',
})
let loading = ref(false)

let userStore = useUserStore()
let router = useRouter()

const login = async () => {
    loading.value = true
    try {
        await userStore.userLogin(loginForm)
        router.push('/')
        ElNotification({
            title: '登录成功',
            type: 'success',
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
    background: url('@/assets/images/background2.jpg') no-repeat;
    background-size: cover;
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
