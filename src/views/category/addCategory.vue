<template>
    <div>
        <el-container>
            <el-header>
                <div style="float: left;">
                    <el-button @click="backToCategory" type="info">&lt;&lt;返回</el-button>
                </div>
            </el-header>
            <el-main>
                <el-form label-width="80px" :model="addCategory">
                    <el-form-item label="分类名" prop="name">
                        <el-input v-model="addCategory.name"></el-input>
                    </el-form-item>
                    <el-form-item label="所属类型" prop="type">
                        <el-select v-model="addCategory.show" placeholder="请选择" @change="getLabel">
                            <el-option v-for="item in options" :key="item.value" :value="item.value"
                                :label="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分类描述" prop="description">
                        <el-input v-model="addCategory.description"></el-input>
                    </el-form-item>
                    <el-form-item label="菜品图片:" prop="image">
                        <image-upload ref="imageUpload" :prop-image-url="imageUrl" @imageChange="imageChange">
                            图片大小不超过2M<br>仅能上传 PNG JPEG JPG类型图片<br>建议上传200*200或300*300尺寸的图片
                        </image-upload>
                    </el-form-item>
                    <el-button type="primary" @click="handleAddCateAndBack">
                        <span v-if="type">添加</span>
                        <span v-else>修改</span>
                    </el-button>
                    <span v-if="type">
                        <el-button type="primary" @click="handleAddCate" style="margin-left: 10px;">
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
import { modifyCategory, addCategory, queryCategoryById } from '@/api/Category'
import ImageUpload from '@/components/ImgUpload/index.vue'

@Component({
    name: 'addCate',
    components: {
        ImageUpload
    }
})
export default class extends Vue {

    private options = [
        { value: '3', label: '传统菜系' },
        { value: '2', label: '套餐' },
        { value: '1', label: '单品' },
    ];
    private value;
    private addCategory = {
        name: '',
        type: '',
        image: '',
        description:'',
        show: '',
    } as {
        name: string,
        type: string,
        image: string,
        description:string,
        show: string,
    }

    getLabel(val: any) {
        const selectedOption = this.options.find(item => item.value === val);
        this.addCategory.show = selectedOption ? selectedOption.label : '';
        this.addCategory.type = val
    }

    private type = true;
    private id;
    private imageUrl;

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
        queryCategoryById(val).then(res => {
            if (res.data.code === 1) {
                this.addCategory.name = res.data.data.name;
                this.addCategory.show = res.data.data.type === 1 ? '单品' : (res.data.data.type=== 2 ? '套餐':'传统菜系');
                this.addCategory.image = res.data.data.image;
                this.addCategory.description = res.data.data.description;
                this.imageUrl = res.data.data.image;
                this.addCategory.type = res.data.data.type;
            }
        }).catch(msg =>
            this.$message.error(msg)
        )
    }

    imageChange(val: string) {
        this.addCategory.image = val;
    }

    removeData() {
        this.addCategory.name = '';
        this.addCategory.type = '';
        this.addCategory.name = '';
        this.addCategory.image = '';
        this.addCategory.show = '';
        (this.$refs.imageUpload as InstanceType<typeof ImageUpload>).remove();
        this.addCategory.description = '';
    }

    handleSuccess(msg) {
        const h = this.$createElement;
        this.$notify({
            title: '',
            message: h('i', { style: 'color: teal' }, msg)
        })
        this.removeData();
    }

    async handleAddCateAndBack() {
        await this.handleAddCate();
        this.backToCategory();
    }

    async handleAddCate() {
        //构建参数
        const addparam =
            { name: this.addCategory.name, type: this.addCategory.type, image: this.addCategory.image,description:this.addCategory.description }

        const modifyparam =
            { id: this.id, name: this.addCategory.name, type: this.addCategory.type, image: this.addCategory.image,description:this.addCategory.description }
        
        if (this.type) {
            await addCategory(addparam).then(res => {
                this.handleSuccess("添加成功");
            })
        } else {
            await modifyCategory(modifyparam).then(res => {
                this.handleSuccess("修改成功");
                this.type = true;
            })
        }
    }

    backToCategory() {
        this.$router.push('/category')
    }
}
</script>

<style></style>
