<template>
    <div style="border: 3px #0bf1af solid;">
        <el-container>
            <el-header style="border-radius: 10px;background-color: #0bf1af;">
                <div style="float: left;">
                    <span class="backSpan" @click="backToDish" type="info">&lt;&lt;返回 </span>
                    <span v-if="type" style="font-size: 15px;color: black;"> | 添加菜品</span>
                    <span v-else style="font-size: 15px;color: black;"> | 修改菜品</span>
                </div>
            </el-header>
            <el-main>
                <el-form class="addDishForm" label-width="80px" :model="addDishFrom" style="width: 500px;">
                    <el-form-item label="菜名" prop="name" style="width: 500px;">
                        <el-input v-model="addDishFrom.name"></el-input>
                    </el-form-item>
                        <el-form-item label="所属分类" prop="categoryId" style="width: 500px;">
                            <el-select clearable style="width: 150px;" v-model="categoryId" placeholder="请选择">
                                <el-option v-for="(item, index) in categoryNameList" :key="index" :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="价格:" prop="price" style="width: 500px;">
                            <el-input v-model="addDishFrom.price" placeholder="请设置套餐价格" />
                        </el-form-item>
                    <el-form-item label="菜品图:" prop="image" style="width: 500px;z-index: 100;">
                        <image-upload ref="imageUpload" :prop-image-url="imageUrl" @imageChange="imageChange">
                            <span v-if="addDishFrom.image == null || addDishFrom.image == ''">
                                图片大小不超过2M,且仅能上传 PNG JPEG JPG类型图片
                            </span>
                        </image-upload>
                    </el-form-item>
                    <el-form-item label="描述" prop="description" style="width: 500px;z-index: 100;">
                        <el-input v-model="addDishFrom.description"></el-input>
                    </el-form-item>
                    <div style="position: relative;top: -40px;left: 30px;z-index: 99;">
                        <el-button type="primary" @click="handleAddDishAndBack">
                            <span v-if="type">添加</span>
                            <span v-else>修改</span>
                        </el-button>
                        <span v-if="type">
                            <el-button type="primary" @click="handleAddDish" style="margin-left: 10px;">
                                <span>继续添加</span>
                            </el-button>
                        </span>
                    </div>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script lang="ts">

import { Vue, Watch } from 'vue-property-decorator'
import Component from 'vue-class-component';
import ImageUpload from '@/components/ImgUpload/index.vue'
import { modifyDish, addDish, queryDishById } from '@/api/Dish'
import { defineComponent, ref } from 'vue';
import { dishCategoryList } from '@/api/Dish'

@Component({
    name: 'addDish',
    components: {
        ImageUpload
    }
})
export default class extends Vue {

    private type = true;
    private id;
    private categoryId = '';

    mounted() {
        // 在这里执行初始化逻辑，例如获取数据
        this.initPage();
        this.getDishTypeList()
    }

    initPage() {
        if (this.$route.query.id != null) {
            this.modify(this.$route.query.id)
            this.type = false;
            this.id = this.$route.query.id
        }
    }

    modify(val: any) {
        queryDishById(val).then(res => {
            console.log(res.data.code)
            if (res.data.code === 1) {
                this.addDishFrom.name = res.data.data.name;
                this.addDishFrom.categoryId = res.data.data.categoryId;
                this.addDishFrom.price = res.data.data.price;
                this.addDishFrom.description = res.data.data.description;
                this.addDishFrom.image = res.data.data.image;
                this.categoryId = res.data.data.categoryId;
                this.imageUrl = res.data.data.image;
            }
        }).catch(msg =>
            this.$message.error(msg)
        )
    }

    // 获取套餐分类
    private getDishTypeList() {
        dishCategoryList({ type: 1 }).then(res => {
            if (res && res.data && res.data.code === 1) {
                this.categoryNameList = res.data.data.map((obj: any) => ({
                    ...obj,
                    categoryType: obj.id
                }))
            } else {
                this.$message.error(res.data.msg)
            }
        })

    }

    private categoryNameList: [] = []

    private options = [
        { value: 1, label: '男' },
        { value: 2, label: '女' }
    ]

    imageChange(val: string) {
        this.addDishFrom.image = val;
    }

    removeData() {
        this.addDishFrom.name = '';
        this.addDishFrom.categoryId = '';
        this.addDishFrom.image = '';
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

    handleSuccessNoRemove(msg) {
        const h = this.$createElement;
        this.$notify({
            title: '',
            message: h('i', { style: 'color: teal' }, msg)
        })
    }

    async handleAddDishAndBack() {
        await this.handleAddDish();
        this.backToDish();
    }
    private addDishFrom = {
        name: '',
        categoryId: '',
        price: '',
        image: '',
        description: '',
        status: ''
    } as {
        name: string,
        categoryId: any,
        image: string,
        description: string,
        price: any,
        status: any
    }

    async handleAddDish() {
        //构建参数
        const addparam = { name: this.addDishFrom.name, categoryId: this.categoryId, price: this.addDishFrom.price, image: this.addDishFrom.image, status: this.addDishFrom.status,description:this.addDishFrom.description }
        const modifyparam = { id: this.id, name: this.addDishFrom.name, categoryId: this.categoryId, price: this.addDishFrom.price, image: this.addDishFrom.image, status: this.addDishFrom.status ,description:this.addDishFrom.description}
        if (this.type) {
            await addDish(addparam).then(res => {
                this.handleSuccess("添加成功");
            })
        } else {
            await modifyDish(modifyparam).then(res => {
                this.handleSuccess("修改成功");
                this.type = true;
            })
        }

    }

    private imageUrl: string;



    backToDish() {
        this.$router.push('/dish')
    }
}
</script>

<style>
.addDishForm {
    width: 600px;
    display: flex;
    flex-direction: column;
    position: relative;
    left: 500px;
}
</style>
