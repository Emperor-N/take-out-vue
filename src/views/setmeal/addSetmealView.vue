<template>
    <div style="border: 3px #0bf1af solid;">
        <el-container>
            <el-header style="border-radius: 10px;background-color: #0bf1af;">
                <div style="float: left;">
                    <span class="backSpan" @click="backToSetmeal" type="info">&lt;&lt;返回 </span>
                    <span v-if="id" style="font-size: 15px;color: black;"> | 添加套餐</span>
                    <span v-else style="font-size: 15px;color: black;"> | 修改套餐</span>
                </div>
                <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" width="80%"
                    style="margin-top: -80px; height: 100%;" :before-close="handleClose">
                    <el-input v-model="dishName" placeholder="请输入菜品名称进行搜索"
                        style="width: 1000px;padding: 0;background-color: #1fab89; height: 40px" size="small" clearable>
                        <i slot="prefix" style="cursor: pointer" @click="seachHandle" />
                    </el-input>
                    <AddDish v-if="dialogVisible" ref="adddish" :check-list="checkList" :seach-param="seachParam"
                        :dish-list="dishList" @checkList="getCheckList" />
                    <span slot="footer" style="position: relative;top: 20px;left: -180px;">
                        <el-button style="background-color: #0bf1af;color: white;" @click="handleClose">取 消</el-button>
                        <el-button type="primary" @click="addTableList">添 加</el-button>
                    </span>
                </el-dialog>
            </el-header>
            <el-main>
                <el-form class="addSetForm" ref="addSetmealForm" :model="addSetmealForm" v-loading="loading">
                    <div>
                        <el-form-item label="套餐名称:" prop="name" style="width: 500px;">
                            <el-input v-model="addSetmealForm.name" placeholder="请填写套餐名称" />
                        </el-form-item>
                        <el-form-item label="套餐分类:" prop="categoryType" style="width: 500px;">
                            <el-select v-model="addSetmealForm.categoryType" placeholder="请选择套餐分类"
                                @change="$forceUpdate()">
                                <el-option v-for="(item, index) in setMealList" :key="index" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="套餐价格（单位：元）:" prop="price" style="width: 500px;">
                            <el-input v-model="addSetmealForm.price" placeholder="请设置套餐价格" />
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="套餐菜品:" style="width: 500px;" required>
                            <el-form-item>
                                <div class="addDish">
                                    <span v-if="dishTable.length == 0" @click="openAddDish('new')">
                                        + 添加菜品</span>
                                    <div v-if="dishTable.length != 0">
                                        <div style="margin-bottom: 20px" @click="openAddDish('change')">
                                            + 添加菜品
                                        </div>
                                        <div>
                                            <el-table :data="dishTable" style="width: 100%">
                                                <el-table-column prop="name" label="名称" align="center" />
                                                <el-table-column prop="price" label="原价" align="center">
                                                    <template slot-scope="scope">
                                                        {{ (Number(scope.row.price).toFixed(2) * 100) / 100 + '元' }}
                                                    </template>
                                                </el-table-column>
                                                <el-table-column prop="address" label="份数" align="center">
                                                    <template slot-scope="scope">
                                                        <el-input-number v-model="scope.row.copies" size="small"
                                                            :min="1" :max="99" label="描述文字" />
                                                    </template>
                                                </el-table-column>
                                                <el-table-column prop="address" label="操作" width="180px;"
                                                    align="center">
                                                    <template slot-scope="scope">
                                                        <el-button type="text" size="small"
                                                            @click="delDishHandle(scope.$index)">
                                                            删除
                                                        </el-button>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </div>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="套餐图片:" required prop="image" style="width: 500px;">
                            <image-upload :prop-image-url="imageUrl" @imageChange="imageChange">
                                图片大小不超过2M,且仅能上传 PNG JPEG JPG类型图片
                            </image-upload>
                        </el-form-item>
                    </div>
                    <div class="address">
                        <el-form-item label="套餐描述:" style="width: 500px;">
                            <el-input v-model="addSetmealForm.description" type="textarea" :rows="3" maxlength="200"
                                placeholder="套餐描述，最长200字" />
                        </el-form-item>
                    </div>
                    <div class="subBox address">
                        <el-form-item>
                            <el-button @click="() => $router.back()">
                                取消
                            </el-button>
                            <el-button type="primary" :class="{ continue: actionType === 'add' }"
                                @click="submitForm('addSetmealForm', false)">
                                保存
                            </el-button>
                            <el-button v-if="actionType == 'add'" type="primary"
                                @click="submitForm('addSetmealForm', true)">
                                保存并继续添加
                            </el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Vue, Watch } from 'vue-property-decorator'
import ImageUpload from '@/components/ImgUpload/index.vue'
import { dishCategoryList, } from '@/api/Category'
import { querySetmealById, addSetmeal, modifySetmeal } from '@/api/Setmeal'
import AddDish from './addDishView.vue'


@Component({
    name: 'addShop',
    components: {
        AddDish,
        ImageUpload
    }
})
export default class extends Vue {

    private addSetmealForm = {//添加所包括的数据
        id: 0,
        name: '',
        categoryId: '',
        price: '',
        image: '',
        description: '',
        dishList: [],//套餐内包含的菜品
        status: true,
        categoryType: ''//在category中所属套餐的id，
    }
    private dishTable: [] = []//目前套餐所含菜品
    private actionType = 'add'
    private dialogVisible = false
    private seachParam = ''
    private checkList: any[] = []//子组件所选择的菜品
    private dishList: [] = []//可供选择的所有菜品
    private dishName = ''
    private setMealList: [] = []//展示框展示数据
    private imageUrl = ''
    private id;//修改时的套餐id，新增时不赋值
    private loading = true;

    init() {
        setTimeout(() => {
            if (this.$route.query.id != null) {
                this.id = this.$route.query.id
                this.actionType = "modify"
                this.modify();
            }
            this.loading = false
        }, 500)
    }

    modify() {
        querySetmealById(this.$route.query.id).then(res => {
            if (res && res.data && res.data.code === 1) {
                this.addSetmealForm = res.data.data
                this.addSetmealForm.status = res.data.data.status == '1'
                    ; (this.addSetmealForm as any).price = res.data.data.price
                this.imageUrl = res.data.data.image
                this.checkList = res.data.data.setmealDishes
                this.dishTable = res.data.data.setmealDishes.reverse()
                this.addSetmealForm.categoryId = res.data.data.categoryId
                this.addSetmealForm.categoryType = res.data.data.categoryId
            } else {
                this.$message.error(res.data.msg)
            }
        })
    }

    mounted() {
        this.init()
        this.getDishTypeList();
    }

    imageChange(val: any) {
        this.imageUrl = val;
        this.addSetmealForm.image = val;
    }

    // 获取套餐分类
    private getDishTypeList() {
        dishCategoryList({ type: 2 }).then(res => {
            if (res && res.data && res.data.code === 1) {
                this.setMealList = res.data.data.map((obj: any) => ({//拿到实体类属性，并赋予新属性用于选项框展示
                    ...obj,
                    categoryType: obj.id
                }))
            } else {
                this.$message.error(res.data.msg)
            }
        })
    }

    handleClose() {
        this.dialogVisible = false;
    }

    openAddDish(type: any) {
        this.seachParam = ''
        this.dialogVisible = true
    }

    removeParam() {
        this.addSetmealForm.name = '',
            this.addSetmealForm.categoryId = '',
            this.addSetmealForm.price = '',
            this.addSetmealForm.image = '',
            this.addSetmealForm.description = '',
            this.addSetmealForm.dishList = [],
            this.addSetmealForm.status = true,
            this.addSetmealForm.categoryType = '',
            this.dishList = []
        this.dishTable = []
        this.imageUrl = ''
    }

    submitForm(formName: any, val: any) {
        //构建参数
        const setmealDishes = this.dishTable.map((obj: any) => ({
            setmealId: this.id,
            copies: obj.copies,
            dishId: obj.dishId,
            name: obj.name,
            price: obj.price
        }))
        const param =
            ({
                id: this.addSetmealForm.id
                , name: this.addSetmealForm.name
                , categoryId: this.addSetmealForm.categoryType
                , price: this.addSetmealForm.price
                , status: this.addSetmealForm.status === true ? 1 : 0
                , description: this.addSetmealForm.description
                , image: this.addSetmealForm.image
                , setmealDishes: setmealDishes
            })

        //判断actionType是否为真，为真表示添加，反之修改
        if (this.actionType === 'add') {
            //调用添加请求添加
            addSetmeal(param).then(res => {
                if (res.data.code === 1) {
                    this.handleSuccess("套餐添加成功");
                }
            }).catch(err => {
                this.$message.error('请求出错了：' + err.message)
            })
        } else {//反之表示修改
            //调用修改请求修改
            modifySetmeal(param).then(res => {
                if (res.data.code === 1) {
                    this.handleSuccess("套餐修改成功");
                }
            }).catch(err => {
                this.$message.error('请求出错了：' + err.message)
            })
        }
        setTimeout(() => {
            if (val === true) {//表示继续添加，并跳转至添加套餐页面
                //不跳转，清空所有数据
                this.removeParam();
            } else {//跳转至套餐页面
                //跳转前，清空所有数据
                this.removeParam();
                this.$router.push("/setmeal")
            }
        }, 1000)

    }

    handleSuccess(msg) {
        const h = this.$createElement;
        this.$notify({
            title: '',
            message: h('i', { style: 'color: teal' }, msg)
        });
    }

    delDishHandle(index: any) {
        console.log(1)
    }

    addTableList() {
        this.dishTable = JSON.parse(JSON.stringify(this.checkList))
        this.dishTable.forEach((n: any) => {
            n.copies = 1
        })
        console.log(this.dishTable)
        this.dialogVisible = false
    }

    // 监听子组件对于该值的更改，当子组件更改后赋值给父组件的该值
    private getCheckList(value: any) {
        this.checkList = [...value].reverse()
        console.log(this.checkList);
    }

    seachHandle() {
        console.log(1)
    }

    backToSetmeal() {
        this.$router.push('/setmeal')
    }

}
</script>

<style>
.addSetForm {
    display: flex;
    flex-direction: column;
    width: 600px;
    position: relative;
    left: 500px;
}
</style>
