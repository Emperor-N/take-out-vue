<template>
    <el-container>
        <el-header style="border-radius: 10px;background-color: #0bf1af;">
            <div style="float: left;">
                <label style="margin-left: 20px;margin-right: 20px;">
                    套餐名称
                    <el-input clearable style="width: 150px;" v-model="name" placeholder="请输入内容"></el-input>
                </label>
                <label style="margin-left: 20px;margin-right: 20px;">
                    套餐分类：
                    <el-select clearable style="width: 150px;" v-model="type" placeholder="请选择">
                        <el-option v-for="item in setmealTypeList" :key="item.value" :value="item.label">
                        </el-option>
                    </el-select>
                </label>
                <label style="margin-left: 20px;margin-right: 20px;">
                    套餐状态：
                    <el-select clearable style="width: 150px;" v-model="status" placeholder="请选择">
                        <el-option v-for="item in setmealStatus" :key="item.value" :value="item.label">
                        </el-option>
                    </el-select>
                </label>
                <el-button type="primary" @click="search" style="border-radius: 10px;width: 100px;">搜索</el-button>
            </div>
            <div style="float: right;">
                <el-button type="danger" style="border-radius: 10px;" @click="handleDelete('批量', 0)">批量删除</el-button>
                <el-button style="border-radius: 10px;" @click="goToAddSetmeal" type="primary">+新增套餐</el-button>
            </div>
        </el-header>
        <el-main>
            <el-table ref="multipleTable" :data="record" tooltip-effect="dark"
                style="width: 100%;box-shadow: 0 5px 12px 0 rgba(0, 0, 0, 0.3)"
                @selection-change="handleSelectionChange" v-loading="loading">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="套餐名"></el-table-column>
                <el-table-column prop="categoryName" label="所属分类"></el-table-column>
                <el-table-column prop="price" label="价格">
                    <template slot-scope="scope">
                        <div>
                            {{ scope.row.price + '元' }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="售卖状态">
                    <template slot-scope="scope">
                        <div>
                            {{ String(scope.row.status) === '0' ? '停售' : '启售' }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
                <el-table-column prop="image" label="套餐概念图">
                    <template slot-scope="{ row }">
                        <el-image style="width: 80px; height: 40px; border: none; cursor: pointer" :src="row.image">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" :formatter="formatDate"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" :formatter="formatDate"></el-table-column>
                <el-table-column prop="createUserName" label="创建人"></el-table-column>
                <el-table-column prop="updateUserName" label="更新人"></el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" style="color:#67C23A" class="blueBug"
                            @click="modifyMealtype(scope.row.id)">
                            修改详情
                        </el-button>
                        <el-button type="text" size="small" style="color:#F56C6C" class="delBut"
                            @click="openDialog">
                            删除
                        </el-button>
                        <el-button type="text" size="small" style="color:#E6A23C" class="non" :class="{
                            blueBug: scope.row.status == '0',
                            delBut: scope.row.status != '0'
                        }" @click="statusHandle(scope.row)">
                            {{ scope.row.status == '0' ? '启用' : '停用' }}
                        </el-button>
                        <el-dialog style="box-shadow: 0 5px 12px 0 rgba(0, 0, 0, 0.4)" title="删除提示" :visible.sync="dialogVisible" width="20%" :before-close="handleClose">
                            <span style="color: #F56C6C;">正在执行删除记录...</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="handleDelete('单删', scope.row.id)">确 定</el-button>
                            </span>
                        </el-dialog>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script lang="ts">

import { Vue, Watch } from 'vue-property-decorator'
import Component from 'vue-class-component';
import { getSetmealList, getSetmealListByMsg, enableOrDisablesSetmeal, deleteByIds } from '@/api/Setmeal'
import { dishCategoryList } from '@/api/Category'

@Component
export default class extends Vue {

    private setmealTypeList: { value: string; label: string }[] = [];

    private setmealStatus = [
        { value: 1, label: '起售' },
        { value: 0, label: '停售' }
    ]

    private page = 1;
    private pageSize = 10;
    private name = '';
    private type = '';
    private status = '';
    private total = 0;
    private loading = true;

    private tempSearchParam = {
        name: '',
        type: '',
        status: '',
    }

    private record: {
        categoryId,
        categoryName,
        name,
        price,
        status,
        description,
        image,
        createTime,
        updateTime,
        createUser,
        createUserName,
        updateUser,
        updateUserName,
    }[] = []
    private ids: any[] = [];

    private dialogVisible = false;

    openDialog() {
        this.dialogVisible = true;
    }

    handleClose() {
        this.dialogVisible = false;
    }

    mounted() {
        this.init();
    }

    formatDate(row, column) {
        let date = row[column.property];
        if (date != null) {
            let dt = new Date(date);
            let month = dt.getMonth()
            return dt.getFullYear() + '-' + (month + 1) + '-' + dt.getDate();
        } else {
            return null
        }
    }

    init() {
        setTimeout(() => {
            this.pageQuery();
            this.getSetmealTypeList();
            this.loading = false;
        }, 500)

    }

    getSetmealTypeList() {
        dishCategoryList({
            type: 2
        }).then(res => {
            if (res && res.data && res.data.code === 1) {
                this.setmealTypeList = (
                    res.data &&
                    res.data.data &&
                    res.data.data
                ).map(item => {
                    return { value: item.id, label: item.name };
                });
            }
        });
    }

    pageQuery() {
        // 构建参数
        const prama = { page: this.page, pageSize: this.pageSize };
        //发送请求

        if (this.name != '' || this.status != '' || this.type != '') {
            this.search()
        } else {
            getSetmealList(prama).then(res => {
                if (res.data.code == 1) {
                    this.total = res.data.data.total;
                    this.record = res.data.data.record;
                }
                if (this.total === 0) {
                    this.handleSuccess('暂无数据')
                    this.removeSearchParam()
                    this.init();
                }
            });
        }
    }

    modifyMealtype(val) {
        this.goToAddSetmeal('修改', val);
        this.init();
    }

    goToAddSetmeal(type, id) {
        if (type === '修改') {
            this.$router.push({ path: '/setmeal/add', query: { id: id } })
        } else {
            this.$router.push('/setmeal/add');
        }
        this.init();
    }

    statusHandle(val: any) {
        enableOrDisablesSetmeal({ status: val.status ? 0 : 1, id: val.id }).then(() => {
            this.init();
            this.handleSuccess("状态修改成功");
        })
    }

    handleDelete(msg: any, id: any) {
        this.dialogVisible = false;
        if (msg === '单删') {
            let ids: number[] = [id];
            deleteByIds(ids).then(() => {
                this.init();
                this.handleSuccess('删除成功');
            })
        } else {
            deleteByIds(this.ids).then(() => {
                this.init();
                this.handleSuccess('删除成功');
            }).catch(() => {
                this.handleSuccess('删除失败');
            })
        }
    }

    handleSuccess(msg) {
        const h = this.$createElement;
        this.$notify({
            title: '',
            message: h('i', { style: 'color: teal' }, msg)
        });
    }

    setTempSearchParam() {
        this.tempSearchParam.name = this.name;
        this.tempSearchParam.type = this.type;
        this.tempSearchParam.status = this.status;
    }

    putTempSearchParam() {
        this.name = this.tempSearchParam.name;
        this.type = this.tempSearchParam.type;
        this.status = this.tempSearchParam.status;
    }

    removeSearchParam() {
        this.name = '';
        this.type = '';
        this.status = '';
    }

    search() {
        this.setTempSearchParam()
        const selectedOption = this.setmealTypeList.find(item => item.label === this.type);
        //构建参数
        const param = ({ name: this.name, type: selectedOption ? selectedOption.value : '', status: this.status === "停售" ? 0 : 1, page: this.page, pageSize: this.pageSize })
        getSetmealListByMsg(param).then(res => {
            if (res.data.code === 1) {
                this.total = res.data.data.total;
                this.record = res.data.data.record;
            }
            if (this.total === 0) {
                this.handleSuccess('暂无数据')
                this.removeSearchParam()
                this.init();
            }
        })
    }

    handleSelectionChange(val: any) {
        let chackArr: any[] = [];
        val.forEach((n) => {
            chackArr.push(n.id);
        })
        this.ids = chackArr;
    }

}
</script>
