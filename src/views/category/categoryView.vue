<template>
    <div>
        <el-container>
            <el-header>
                <div style="float: left;">
                    <label style="margin-left: 20px;margin-right: 20px;">
                        分类状态：
                        <el-select clearable style="width: 150px;" v-model="status" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :value="item.label">
                            </el-option>
                        </el-select>
                    </label>
                    <label style="margin-left: 20px;margin-right: 20px;">
                        分类名：
                        <el-input clearable style="width: 150px;" v-model="name" placeholder="请输入内容"></el-input>
                    </label>
                    <label style="margin-left: 20px;margin-right: 20px;">
                        日期选择：
                        <el-date-picker v-model="date" clearable value-format="yyyy-MM-dd HH:mm:ss" range-separator="至"
                            type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                            style="width: 25%; margin-left: 10px" />
                    </label>
                    <el-button type="primary" @click="search">搜索</el-button>
                </div>
                <div style="float: right;">
                    <el-button type="danger" @click="handleDelete('批量', 0)">批量删除</el-button>
                    <el-button @click="goToAddCategory" type="primary">+新增分类</el-button>
                </div>
            </el-header>
            <el-main>
                <el-table ref="multipleTable" :data="record" tooltip-effect="dark" style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="name" label="分类名"></el-table-column>
                    <el-table-column prop="type" label="所属分类">
                        <template slot-scope="scope">
                            <div>
                                {{ String(scope.row.type) === '1' ? '单品' : String(scope.row.type)=== '2' ? '套餐' : '传统菜系' }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="分类状态">
                        <template slot-scope="scope">
                            <div>
                                {{ String(scope.row.status) === '0' ? '停售' : '启售' }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="image" label="图片">
                        <template slot-scope="{ row }">
                            <el-image style="width: 80px; height: 40px; border: none; cursor: pointer" :src="row.image">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="描述"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间"></el-table-column>
                    <el-table-column prop="updateTime" label="更新时间"></el-table-column>
                    <el-table-column prop="createUser" label="创建者"></el-table-column>
                    <el-table-column prop="updateUser" label="更新者"></el-table-column>
                    <el-table-column label="操作" width="250" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" class="blueBug" @click="modifyCatetype(scope.row.id)">
                                修改
                            </el-button>
                            <el-button type="text" size="small" class="delBut"
                                @click="handleDelete('单删', scope.row.id)">
                                删除
                            </el-button>
                            <el-button type="text" size="small" class="non" :class="{
                                blueBug: scope.row.status == '0',
                                delBut: scope.row.status != '0'
                            }" @click="statusHandle(scope.row)">
                                {{ scope.row.status == '0' ? '启用' : '停用' }}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <div>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="page" :page-sizes="sizeList" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </el-container>
    </div>
</template>
<script lang="ts">

import { Vue, Watch } from 'vue-property-decorator'
import Component from 'vue-class-component';
import { getCategoryList, deleteByIds,getCategoryListByMsg,enableOrDisableCategory } from '@/api/Category'

@Component
export default class extends Vue {
    record: {
        id: number,
        name: string,
        type: number,
        status: number,
        image: string,
        description: string,
        createTime: string,
        updateTime: string,
        updateUser: string,
        createUser: string
    }[] = [];

    private options = [
        { value: '选项1', label: '启用' },
        { value: '选项2', label: '停售' }
    ];
    private status = '';
    private name = '';
    private date = '';

    private page = 0;
    private pageSize = 10;
    private ids: any[] = [];
    private total = 0;
    private sizeList = [10, 20, 30, 40, 50];
    private tempSearchParam = {
        name:'',
        status:'',
        date:'',
    }

    mounted() {
        this.init();
    }

    public init() {
        this.page = 1;
        this.pageQuery();
        this.putTempSearchParam();
    }

    setTempSearchParam(){
        this.tempSearchParam.date = this.date;
        this.tempSearchParam.status = this.status;
        this.tempSearchParam.name = this.name;
    }

    putTempSearchParam(){
        this.date = this.tempSearchParam.date;
        this.status = this.tempSearchParam.status;
        this.name = this.tempSearchParam.name;
    }

    handleDelete(msg,id) {
        if (msg === '单删') {
            let ids: number[] = [id];
            deleteByIds(ids).then(() => {
                this.handleSuccess('删除成功');
                this.init();
            })
        } else {
            deleteByIds(this.ids).then(() => { 
                this.handleSuccess('删除成功');
                this.init();
            }).catch(() => {
                this.handleSuccess('删除失败');
            })
        }
    }

    modifyCatetype(val: any) {
        this.goToAddCategory('修改',val);
    }

    goToAddCategory(type: any, id: any) {
        if (type === '修改') {
            this.$router.push({ path: '/category/add', query: { id: id } })
        } else {
            this.$router.push('/category/add');
        }
    }

    //修改状态
    statusHandle(val: any) {
        enableOrDisableCategory({ status: val.status ? 0 : 1, id: val.id }).then(() => {
            this.init();
            this.handleSuccess("状态修改成功");
        })
    }

    //消息弹窗
    handleSuccess(msg) {
        const h = this.$createElement;
        this.$notify({
            title: '',
            message: h('i', { style: 'color: teal' }, msg)
        });
    }

    //处理每页记录总数
    public handleSizeChange(val: any) {
        this.pageSize = val;
        this.pageQuery();
    }

    //当前页面跳转处理
    handleCurrentChange(val: number) {
        this.page = val;
        this.pageQuery();
    }

    //搜索
    search() {
        this.setTempSearchParam()
        //构建参数
        const param = ({ status: this.status === '启用' ? 1 : 0, name: this.name, startTime: this.date[0], endTime: this.date[1], page: this.page, pageSize: this.pageSize })
        getCategoryListByMsg(param).then(res => {
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

    removeSearchParam(){
        this.date = '';
        this.name = '';
        this.status = '';
    }

    pageQuery() {
        // 构建参数
        const param = { page: this.page, pageSize: this.pageSize }
        //发送请求

        if(this.status != '' || this.name != '' || this.date != ''){
            this.search()
        }else{
            getCategoryList(param).then(res => {
            if (res.data.code == 1) {
                this.total = res.data.data.total;
                this.record = res.data.data.record;
            }
        });
        } 
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