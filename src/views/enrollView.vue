<template>
    <div class="d">
        <div class="mainDiv">
            <div class="enrollDiv">
                <el-form ref="enrollForm" label-width="80px" :model="enrollForm" :rules="enrollRules">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="enrollForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="enrollForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="certainPassword">
                        <el-input v-model="enrollForm.certainPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="username" style="width: 500px;">
                        <el-select clearable v-model="enrollForm.gender" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号" prop="number">
                        <el-input v-model="enrollForm.number"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idNumber">
                        <el-input v-model="enrollForm.idNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="员工头像:" prop="image" style="width: 500px;z-index: 100;">
                        <image-upload ref="imageUpload" :prop-image-url="imageUrl" @imageChange="imageChange">
                            <span v-if="enrollForm.image == null || enrollForm.image == ''">
                                图片大小不超过2M,且仅能上传 PNG JPEG JPG类型图片
                            </span>
                        </image-upload>
                    </el-form-item>
                </el-form>
                <div style="position: relative;left: 150px;">
                    <el-button type="primary" @click="backLogin" style="width: 100px;position: relative;left: 80px;">返回</el-button>
                    <el-button type="danger" @click="handleEnroll" style="width: 100px;position: relative;left: 80px;">注册</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">

import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { Form as ElForm, Input } from 'element-ui'
import ImageUpload from '@/components/ImgUpload/index.vue'
import { enrollEmployee } from '@/api/Employee'

@Component({
    name: 'addEmp',
    components: {
        ImageUpload
    }
})
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

    private options = [
        { value: 1, label: '男' },
        { value: 2, label: '女' }
    ]

    private imageUrl:'';
    private loading = false
    private enrollForm = {//登录默认信息
        username: '',
        password: '',
        certainPassword:'',
        gender:'',
        image:'',
        idNumber:'',
        number:''
    } as {//对类型断言
        username: string
        password: string
        certainPassword
        gender
        image:string
        idNumber:string
        number:string
    }


    enrollRules = {
        username: [{ validator: this.validateUsername, trigger: 'blur' }],
        password: [{ validator: this.validatePassword, trigger: 'blur' }],
    }

    imageChange(val: string) {
        this.enrollForm.image = val;
    }

    backLogin(){
        this.$router.push('/')
        
    }

    handleSuccessNoRemove(msg) {
        const h = this.$createElement;
        this.$notify({
            title: '',
            message: h('i', { style: 'color: teal' }, msg)
        })
    }
    handleSuccess(msg) {
        const h = this.$createElement;
        this.$notify({
            title: '',
            message: h('i', { style: 'color: teal' }, msg)
        })
        this.removeData();
    }

    removeData(){
        this.enrollForm.username = '';
        this.enrollForm.gender = '';
        this.enrollForm.idNumber = '';
        this.enrollForm.image = '';
        this.enrollForm.password = '';
        this.enrollForm.certainPassword = '';
        this.enrollForm.number = '';
    }

    async handleEnroll() {
        //构建参数
        const addparam = { username: this.enrollForm.username, gender: this.enrollForm.gender === '男' ? 1 : 2, number: this.enrollForm.number, idNumber: this.enrollForm.idNumber, image: this.enrollForm.image }
        console.log(addparam)
        if (this.enrollForm.idNumber.length != 18 || this.enrollForm.number.length != 11) {
            this.handleSuccessNoRemove("不合法的身份证或手机号")
            return;
        }
        if(this.enrollForm.certainPassword == this.enrollForm.password){      
            await enrollEmployee(addparam).then(res => {
                if(res.data.code === 1){
                    this.handleSuccess("添加成功");
                    this.$router.push('/')
                }else{
                    this.handleSuccessNoRemove(res.data.msg)
                }
            }).catch((msg)=>{
                this.$message.error(msg)
            })
        }else{
            this.handleSuccessNoRemove('两次输入密码不相同');
        }
            
    }
}
</script>

<style scoped>
.enrollDiv {
    width: 500px;
    display: flex;
    flex-direction: column;
    position: relative;
    left: 320px;
    top: 5px;

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