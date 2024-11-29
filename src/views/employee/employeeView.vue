<template>
    <div style="height:100%;">
        <el-container>
            <el-header>
                <div style="float: left;">
                    <label style="margin-left: 20px;margin-right: 20px;">
                        账号状态：
                        <el-select clearable style="width: 150px;" v-model="status" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :value="item.label">
                            </el-option>
                        </el-select>
                    </label>
                    <label style="margin-left: 20px;margin-right: 20px;">
                        用户名：
                        <el-input clearable style="width: 150px;" v-model="username" placeholder="请输入内容"></el-input>
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
                    <el-button @click="goToAddEmployee" type="primary">+新增员工</el-button>
                </div>
            </el-header>
            <el-main>
                <el-table ref="multipleTable" :data="record" tooltip-effect="dark" style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="username" label="用户名"></el-table-column>
                    <el-table-column prop="password" label="密码"></el-table-column>
                    <el-table-column prop="gender" label="性别"></el-table-column>
                    <el-table-column prop="image" label="图片">
                        <template slot-scope="{ row }">
                            <el-image style="width: 80px; height: 40px; border: none; cursor: pointer" :src="row.image">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="idNumber" label="身份证"></el-table-column>
                    <el-table-column prop="number" label="电话"></el-table-column>
                    <el-table-column prop="status" label="账号状态">
                        <template slot-scope="scope">
                            <div>
                                {{ String(scope.row.status) === '0' ? '停售' : '启售' }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间"></el-table-column>
                    <el-table-column prop="updateTime" label="更新时间"></el-table-column>
                    <el-table-column prop="createUser" label="创建人"></el-table-column>
                    <el-table-column prop="updateUser" label="更新人"></el-table-column>
                    <el-table-column label="操作" width="250" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" class="blueBug" @click="modifyEmptype(scope.row.id)">
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
import { getEmployeeList, getEmployeeListByMsg, deleteByIds, enableOrDisableEmployee } from '@/api/Employee'

@Component
export default class extends Vue {
    // 定义属性
    private sizeList = [10, 20, 30, 40, 50];
    private total = 0;
    private record: {
        id: number;
        username: string;
        password: string;
        gender: string;
        image: string;
        idNUmber: string;
        number: string;
        status: string;
        createTime: string;
        updateTime: string;
        createUser: string;
        updateUser: string;
    }[] = [];
    private ids: any[] = [];
    private name = '';
    private pageSize = 10; // 当前页面大小
    private page = 1; // 默认当前页为 1
    private date = '';
    private options = [
        { value: '选项1', label: '启用' },
        { value: '选项2', label: '禁用' }
    ];
    private status = '';
    private username = '';

    private tempSearchParam = {
        username:'',
        status:'',
        date:'',
    }

    mounted() {
        // 在这里执行初始化逻辑，例如获取数据
        this.initPage();
    }

    initPage() {
        this.page = 1;
        this.pageQuery();
        this.putTempSearchParam()
    }

    modifyEmptype(val: any) {
        this.goToAddEmployee('修改', val);
    }

    setTempSearchParam(){
        this.tempSearchParam.date = this.date;
        this.tempSearchParam.status = this.status;
        this.tempSearchParam.username = this.username;
    }

    putTempSearchParam(){
        this.date = this.tempSearchParam.date;
        this.status = this.tempSearchParam.status;
        this.username = this.tempSearchParam.username;
    }

    statusHandle(val: any) {
        enableOrDisableEmployee({ status: val.status ? 0 : 1, id: val.id }).then(() => {
            this.initPage();
            this.handleSuccess("状态修改成功");
        })
    }

    search() {
        this.setTempSearchParam()
        //构建参数
        const param = ({ status: this.status === '启用' ? 1 : 0, username: this.username, startTime: this.date[0], endTime: this.date[1], page: this.page, pageSize: this.pageSize })
        getEmployeeListByMsg(param).then(res => {
            if (res.data.code === 1) {
                this.total = res.data.data.total;
                this.record = res.data.data.record;
            }
            if (this.total === 0) {
                this.handleSuccess('暂无数据')
                this.removeSearchParam()
                this.initPage();
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

    goToAddEmployee(type: any, id: any) {
        if (type === '修改') {
            this.$router.push({ path: '/employee/add', query: { id: id } })
        } else {
            this.$router.push('/employee/add');
        }
    }

    pageQuery() {
        // 构建参数
        const prama = { page: this.page, pageSize: this.pageSize };
        //发送请求

        if (this.status != '' || this.username != '' || this.date != '') {
            this.search()
        } else {
            getEmployeeList(prama).then(res => {
                if (res.data.code == 1) {
                    this.total = res.data.data.total;
                    this.record = res.data.data.record;
                }
            });
        }
    }

    removeSearchParam(){
        this.date = '';
        this.username = '';
        this.status = '';
    }

    handleCurrentChange(val: number) {
        this.page = val;
        this.pageQuery();
    }

    handleSizeChange(val: number) {
        this.pageSize = val;
        this.pageQuery();
    }

    handleSuccess(msg) {
        const h = this.$createElement;
        this.$notify({
            title: '',
            message: h('i', { style: 'color: teal' }, msg)
        });
    }

    handleDelete(msg: any, id: any) {
        if (msg === '单删') {
            let ids: number[] = [id];
            deleteByIds(ids).then(() => {
                this.initPage();
                this.handleSuccess('删除成功');
            })
        } else {
            deleteByIds(this.ids).then(() => {
                this.initPage();
                this.handleSuccess('删除成功');
            }).catch(() => {
                this.handleSuccess('删除失败');
            })
        }
    }
}
</script>

<style>
.el-table__header-wrapper {
    /* 表头行高 */
    line-height: 80px;
}
</style>