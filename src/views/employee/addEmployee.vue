<template>
    <div>
        <el-container>
            <el-header>
                <div style="float: left;">
                    <el-button @click="backToMain" type="info">&lt;&lt;返回</el-button>
                </div>
            </el-header>
            <el-main>
                <el-form label-width="80px" :model="addEmpFrom">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addEmpFrom.username"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="username">
                        <el-select v-model="addEmpFrom.gender" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号" prop="number">
                        <el-input v-model="addEmpFrom.number"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idNumber">
                        <el-input v-model="addEmpFrom.idNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="菜品图片:" prop="image">
                        <image-upload ref="imageUpload" :prop-image-url="imageUrl" @imageChange="imageChange">
                            图片大小不超过2M<br>仅能上传 PNG JPEG JPG类型图片<br>建议上传200*200或300*300尺寸的图片
                        </image-upload>
                    </el-form-item>
                    <el-button type="primary" @click="handleAddEmpAndBack">
                        <span v-if="type">添加</span>
                        <span v-else>修改</span>
                    </el-button>
                    <span v-if="type">
                        <el-button type="primary" @click="handleAddEmp" style = "margin-left: 10px;">
                            <span>继续添加</span>
                        </el-button>
                    </span>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script lang="ts">

import { Vue, Watch } from 'vue-property-decorator'
import Component from 'vue-class-component';
import ImageUpload from '@/components/ImgUpload/index.vue'
import { modifyEmployee, addEmployee, queryEmployeeById } from '@/api/Employee'
import { defineComponent, ref } from 'vue';

@Component({
    name: 'addEmp',
    components: {
        ImageUpload
    }
})


export default class extends Vue {

    private type = true;
    private id;

    mounted() {
        // 在这里执行初始化逻辑，例如获取数据
        this.initPage();
    }

    initPage() {
        if (this.$route.query.id != null) {
            this.modify(this.$route.query.id)
            this.type = false;
            this.id = this.$route.query.id
        }
    }

    modify(val: any) {
        queryEmployeeById(val).then(res => {
            if (res.data.code === 1) {
                this.addEmpFrom.username = res.data.data.username;
                this.addEmpFrom.idNumber = res.data.data.idNumber;
                this.addEmpFrom.number = res.data.data.number;
                this.addEmpFrom.image = res.data.data.image;
                this.imageUrl = res.data.data.image;
                const selectedOption = this.options.find(item => item.value === res.data.data.gender);
                this.addEmpFrom.gender = selectedOption ? selectedOption.label : '';
            }
        }).catch(msg =>
            this.$message.error(msg)
        )
    }

    private options = [
        { value: 1, label: '男' },
        { value: 2, label: '女' }
    ]

    imageChange(val: string) {
        this.addEmpFrom.image = val;
    }

    removeData() {
        this.addEmpFrom.idNumber = '';
        this.addEmpFrom.number = '';
        this.addEmpFrom.username = '';
        this.addEmpFrom.image = '';
        this.addEmpFrom.gender = '';
        (this.$refs.imageUpload as InstanceType<typeof ImageUpload>).remove();
        this.imageUrl = '';
    }

    handleSuccess(msg) {
        const h = this.$createElement;
        this.$notify({
            title: '',
            message: h('i', { style: 'color: teal' }, msg)
        })
        this.removeData();
    }

    async handleAddEmpAndBack() {
        await this.handleAddEmp();
        this.backToMain();
    }

    async handleAddEmp() {
        //构建参数
        const addparam = { username: this.addEmpFrom.username, gender: this.addEmpFrom.gender === '男' ? 1 : 2, number: this.addEmpFrom.number, idNumber: this.addEmpFrom.idNumber, image: this.addEmpFrom.image }
        const modifyparam = { id: this.id, username: this.addEmpFrom.username, gender: this.addEmpFrom.gender === '男' ? 1 : 2, number: this.addEmpFrom.number, idNumber: this.addEmpFrom.idNumber, image: this.addEmpFrom.image }
        if (this.type) {
            await addEmployee(addparam).then(res => {
                this.handleSuccess("添加成功");
            })
        } else {
            await modifyEmployee(modifyparam).then(res => {
                this.handleSuccess("修改成功");
                this.type = true;
            })
        }

    }

    private imageUrl: string;

    private addEmpFrom = {
        username: '',
        gender: '',
        number: '',
        idNumber: '',
        image: ''
    } as {
        username: string,
        gender: any,
        number: string,
        idNumber: string,
        image: string,
    }

    backToMain() {
        this.$router.push('/main')
    }
}
</script>

<style></style>
