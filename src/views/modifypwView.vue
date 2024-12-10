<template>
    <div>
        <el-container>
            <el-header style="border-radius: 10px;background-color: #0bf1af;">
                <div style="float: left;">
                    <span class="backSpan" @click="backToMain" type="info">&lt;&lt;返回 </span>
                    <span style="font-size: 15px;color: black;"> | 修改密码</span>
                </div>
            </el-header>
            <el-main style="border: 3px #0bf1af solid;height: 80vh;">
                <el-form label-width="80px" :model="modifyPassword" class="modifyForm">
                    <el-form-item label="旧密码:" prop="oldPassword" style="width: 500px;color: black;">
                        <el-input type="password" v-model="modifyPassword.oldPassword"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="新密码:" prop="newPassword" style="width: 500px;">
                        <el-input type="password" v-model="modifyPassword.newPassword"></el-input>
                    </el-form-item>
                    <el-form-item class="item" label="确定密码:" prop="certainPassword" style="width: 500px;z-index: 100;">
                        <el-input type="password" v-model="modifyPassword.certainPassword"></el-input>
                    </el-form-item>
                    <div style="position: relative;left: -20px;top: -50px;z-index: 99;">
                        <el-button type="primary" @click="modifypw" style="width: 100px;">
                            <span>修改</span>
                        </el-button>
                        <el-button type="primary" @click="deleteData" style="width: 100px;">
                            <span>全部清空</span>
                        </el-button>
                    </div>
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

    deleteData(){
        this.modifyPassword.oldPassword = '';
        this.modifyPassword.newPassword = '';
        this.modifyPassword.certainPassword = '';
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

<style scoped>
.backSpan:hover {
    color: #ff5722;
}

.modifyForm {
    width: 600px;
    display: flex;
    flex-direction: column;
    position: relative;
    left: 500px;
}
</style>
