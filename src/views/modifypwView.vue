<template>
    <div>
        <el-container>
            <el-header>
                <div style="float: left;">
                    <el-button @click="backToMain" type="info">&lt;&lt;返回</el-button>
                </div>
            </el-header>
            <el-main>
                <el-form label-width="80px" :model="modifyPassword">
                    <el-form-item label="旧密码" prop="username">
                        <el-input type="password" v-model="modifyPassword.oldPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="username">
                        <el-input type="password" v-model="modifyPassword.newPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="确定密码" prop="username">
                        <el-input type="password" v-model="modifyPassword.certainPassword"></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="modifypw">
                        <span>修改</span>
                    </el-button>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script lang="ts">

import { Vue, Watch } from 'vue-property-decorator'
import Component from 'vue-class-component';
import { UserModule } from '@/store/modules/user'

@Component
export default class extends Vue {

    private modifyPassword = {
        oldPassword: '',
        newPassword: '',
        certainPassword: ''
    } as {
        oldPassword: string,
        newPassword: string,
        certainPassword: string
    }

    handleSuccess(msg) {
        const h = this.$createElement;
        this.$notify({
            title: '',
            message: h('i', { style: 'color: teal' }, msg)
        });
    }

    modifypw() {
        if (this.modifyPassword.oldPassword != null && this.modifyPassword.newPassword != null) {
            if (this.modifyPassword.certainPassword === this.modifyPassword.newPassword) {
                const payload = { oldPassword: this.modifyPassword.oldPassword, newPassword: this.modifyPassword.newPassword }
                this.$store.dispatch('modify', payload).then(res => {
                    if (res.type === 1) {
                        this.handleSuccess('修改成功,即将跳转至登录页面');
                        setTimeout(() => {
                            this.$router.replace('/');
                        }, 1500)
                        return res.msg;
                    } else {
                        alert(res.msg);
                    }

                })
            } else {
                alert("两次输入密码不相同，请重新输入")
            }

        } else {
            alert('密码获取错误，请联系管理员')
        }
    }

    backToMain() {
        this.$router.push('/main')
    }

}
</script>
