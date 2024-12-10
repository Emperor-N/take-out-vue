<template>
    <div>
        <el-container style="height:500px">
            <el-header style="border-radius: 10px;background-color: #0bf1af;">
                添加菜品
            </el-header>
            <el-container style="height:500px">
                <el-aside style="width: 10%;background-color: #d7fbe8;height: 500px;">
                    <div class="asideBar">
                        <span v-for="(item, index) in dishType" :key="index" @click="checkTypeHandle(index, item.id)">{{
                            item.name }}</span>
                    </div>
                </el-aside>
                <el-main style="width:50%;background-color:#9df3c4;height: 500px;">
                    <el-checkbox-group v-loading="loading" v-if="dishList.length > 0" v-model="checkedList"
                        @change="checkedListHandle">
                        <div v-for="(item, index) in dishList" :key="item.name + item.id">
                            <el-checkbox :key="index" :label="item.name">
                                <div class="item">
                                    <span style="flex: 3; text-align: left">{{
                                        item.name
                                    }}</span>
                                    <span>{{ item.status == 0 ? '停售' : '在售' }}</span>
                                    <span>{{ (Number(item.price)).toFixed(2) * 100 / 100 }}</span>
                                </div>
                            </el-checkbox>
                        </div>
                    </el-checkbox-group>
                </el-main>
                <el-aside style="width:40%;background-color: #62d2a2;height: 500px;">
                    <div>
                        已选菜品({{ checkedListAll.length }})
                    </div>
                    <div>
                        <div v-for="(item, ind) in checkedListAll" :key="ind" class="item">
                            <span>{{ item.dishName || item.name }}</span>
                            <span class="price">￥ {{ (Number(item.price)).toFixed(2) * 100 / 100 }} </span>
                            <span class="del" @click="delCheck(item.name)">
                                <img alt="">
                            </span>
                        </div>
                    </div>
                </el-aside>
            </el-container>
        </el-container>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { queryDishList } from '@/api/Dish'
import { dishCategoryList } from '@/api/Category'



@Component
export default class extends Vue {

    @Prop({ default: '' }) private dishName!: number
    @Prop({ default: [] }) private checkList!: any[]
    @Prop({ default: '' }) private seachKey!: string

    private checkedListAll: any[] = []
    private dishType: [] = []
    private dishList: [] = [];
    public checkedList: any[] = []//用户已选中的菜品
    private keyInd = 0
    private ids: any = new Set()
    private allDishList: any[] = []
    private loading = true;

    mounted() {
        this.init();
    }

    init() {
        setTimeout(() => {
            // 菜单列表数据获取
            this.getDishType()
            this.checkedListAll = this.checkList      
            this.loading = false; 
        }, 500)
        
    }

    delCheck(val: any) {
        console.log(1)
    }

    // 获取套餐分类
    public getDishType() {
        dishCategoryList({ type: 1 }).then(res => {
            if (res && res.data && res.data.code === 1) {
                this.dishType = res.data.data
                this.getDishList(res.data.data[0].id)
            } else {
                this.$message.error(res.data.msg)
            }
        })
    }

    private checkTypeHandle(ind: number, id: any) {
        // this.keyInd = ind
        this.getDishList(id)
    }

    private checkedListHandle(value: [string]) {
        const list = this.allDishList.filter((item: any) => {
            let data
            value.forEach((it) => {
                if (item.name == it) {
                    data = item;
                }
            })
            return data
        })
        const dishListCat = [...this.checkedListAll, ...list]
        let arrData: any[] = []//存储选中过的菜品名
        this.checkedListAll = dishListCat.filter((item) => {
            let allArrDate;
            if (arrData.length == 0) {
                arrData.push(item.name);
                allArrDate = item;
            } else {
                const isOrNot = arrData.some(it => item.name == it);
                if (!isOrNot) {
                    arrData.push(item.name)
                    allArrDate = item
                }
            }
            return allArrDate;
        })

        if (value.length < arrData.length) {//表示用户目前选中的菜品数小于用户选中并已经存储在arrData的数目，表示用户手动减少菜品
            //遍历checkListAll，当checkListAll的元素属性name=value的name时表示该元素仍被用户选中直接返回至结果
            this.checkedListAll = this.checkedListAll.filter((item: any) => {
                if (value.some(it => it == item.name)) {
                    return item
                }
            })
        }
        this.$emit('checkList', this.checkedListAll)
    }

    // 通过套餐ID获取菜品列表分类
    private getDishList(id: number) {
        queryDishList({ categoryId: id }).then(res => {
            if (res && res.data && res.data.code === 1) {
                if (res.data.data.length == 0) {
                    this.dishList = []
                    return
                }
                let newArr = res.data.data
                newArr.forEach((n: any) => {
                    n.dishId = n.id//
                    n.copies = 1
                    n.dishName = n.name//
                })
                this.dishList = newArr
                if (!this.ids.has(id)) {
                    this.allDishList = [...this.allDishList, ...newArr]
                }
                this.ids.add(id)
            } else {
                this.$message.error(res.data.msg)
            }
        })
    }

}
</script>

<style>
.asideBar>span {
    display: block;
    text-align: center;
    border-right: solid 2px #f4f4f4;
    cursor: pointer;
    position: relative;
}
</style>
