<template>
    <div class="d">
        <div class="mainDiv">
            <div class="loginDiv">
                <el-form ref="loginForm" label-width="80px" :model="loginForm" :rules="loginRules">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="loginForm.password" @keyup.enter.native="handleLogin"></el-input>
                    </el-form-item>
                </el-form>
                <div style="position: relative;left: 150px;">
                    <el-button type="primary" @click.native.prevent="handleLogin" :loading="loading"
                        style="width: 100px;">
                        <span v-if="!loading">登录</span>
                        <span v-else>登录中...</span>
                    </el-button>
                    <el-button type="danger" @click.native.prevent="handleEnroll" style="width: 100px;">注册</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">

import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { Form as ElForm, Input } from 'element-ui'
@Component
export default class extends Vue {

    private validateUsername = (rule: any, value: string, callback: (error?: Error) => void) => {
        if (!value) {
            callback(new Error('请输入用户名'))
        } else {
            callback()
        }
    }
    private validatePassword = (rule: any, value: string, callback: (error?: Error) => void) => {
        if (value.length < 6) {
            callback(new Error('密码必须在6位以上'))
        } else {
            callback()
        }
    }
    private loading = false
    private loginForm = {//登录默认信息
        username: 'admin',
        password: '123456',
    } as {//对类型断言
        username: string
        password: string
    }


    loginRules = {
        username: [{ validator: this.validateUsername, trigger: 'blur' }],
        password: [{ validator: this.validatePassword, trigger: 'blur' }],
    }

    handleEnroll() {
        this.$router.push("/enroll")
    }

    handleLogin() {
        (this.$refs.loginForm as ElForm).validate(async (valid: boolean) => {
            if (valid) {
                this.loading = true
                UserModule.Login(this.loginForm as any)
                    .then((res: any) => {
                        if (res.code === 1) {
                            //跳转到首页
                            this.$router.push('/main');
                        } else {
                            //设置继续加载
                            this.loading = false;
                        }
                    }).catch(() => {
                        this.$message.error('用户名或密码错误！')
                        this.loading = false
                    })
            } else {
                return false;
            }
        });
    }
}
</script>

<style scoped>
.loginDiv {
    width: 500px;
    display: flex;
    flex-direction: column;
    position: relative;
    left: 350px;
    top: 220px;

}

.mainDiv {
    position: relative;
    top: 120px;
    left: 235px;
    width: 1200px;
    height: 600px;
    background: url("E:\html\my-take-out\src\image\login.png");
    border-radius: 30px;
}
.d{
    height: 100vh;
    border-radius: 30px;
    background: #cebeb;  /* fallback for old browsers */      background: -webkit-linear-gradient(to right, rgb(12, 235, 235), rgb(32, 227, 178), rgb(41, 255, 198));  /* Chrome 10-25, Safari 5.1-6 */      background: linear-gradient(to right, rgb(12, 235, 235), rgb(32, 227, 178), rgb(41, 255, 198)); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */      
}
</style>