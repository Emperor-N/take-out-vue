<template>
    <div>
        <TabChange :order-statics="orderStatics" @tabChange="change" />
        <div>
            <!-- 搜索项 -->
            <div class="tableBar" style="float: left;line-height: 80px;position: relative;left: -60px">
                <label style="margin-right: 10px">订单号：</label>
                <el-input v-model="inputNumber" placeholder="请填写订单号" style="width: 15%" clearable
                    @clear="init(orderStatus)" @keyup.enter.native="initFun(orderStatus)" />
                <label style="margin-left: 20px">手机号：</label>
                <el-input v-model="phone" placeholder="请填写手机号" style="width: 15%" clearable @clear="init(orderStatus)"
                    @keyup.enter.native="initFun(orderStatus)" />
                <label style="margin-left: 20px;margin-right: 20px;">
                    日期选择：
                    <el-date-picker v-model="date" clearable range-separator="至" type="daterange"
                        start-placeholder="开始日期" end-placeholder="结束日期" style="width: 25%; margin-left: 10px" />
                </label>
                <el-button class="normal-btn continue" @click="init(orderStatus)">
                    查询
                </el-button>
            </div>
            <el-table :data="record" stripe class="tableBox"
                style="width: 100%;box-shadow: 0 5px 12px 0 rgba(0, 0, 0, 0.3)" v-loading="loading">
                <el-table-column align="center" key="number" prop="number" label="订单号" />
                <el-table-column v-if="[2, 3, 4].includes(orderStatus)" align="center" key="orderDishes"
                    prop="orderDishes" label="订单菜品" />
                <el-table-column v-if="[0].includes(orderStatus)" align="center" key="status" prop="订单状态" label="订单状态">
                    <template slot-scope="{ row }">
                        <span>{{ getOrderType(row) }}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="[0, 5, 6].includes(orderStatus)" align="center" key="consignee" prop="consignee"
                    label="用户名" show-overflow-tooltip />
                <el-table-column v-if="[0, 5, 6].includes(orderStatus)" align="center" key="phone" prop="phone"
                    label="手机号" />
                <el-table-column v-if="[0, 2, 3, 4, 5, 6].includes(orderStatus)" align="center" key="address"
                    prop="address" label="地址" :class-name="orderStatus === 6 ? 'address' : ''" />
                <el-table-column v-if="[0, 6].includes(orderStatus)" :formatter="formatDate" align="center"
                    key="orderTime" prop="orderTime" label="下单时间" class-name="orderTime" min-width="110" />
                <el-table-column v-if="[6].includes(orderStatus)" align="center" key="cancelTime" prop="cancelTime"
                    class-name="cancelTime" :formatter="formatDate" label="取消时间" min-width="110" />
                <el-table-column v-if="[6].includes(orderStatus)" align="center" key="cancelReason" prop="cancelReason"
                    label="取消原因" class-name="cancelReason" :min-width="[6].includes(orderStatus) ? 80 : 'auto'" />
                <el-table-column v-if="[5].includes(orderStatus)" :formatter="formatDate" align="center"
                    key="deliveryTime" prop="deliveryTime" label="送达时间" />
                <el-table-column v-if="[2, 3, 4].includes(orderStatus)" align="center" key="estimatedDeliveryTime"
                    prop="estimatedDeliveryTime" :formatter="formatDate" label="预计送达时间" min-width="110" />
                <el-table-column v-if="[0, 2, 5].includes(orderStatus)" key="amount" prop="amount" label="实收金额"
                    align="center">
                    <template slot-scope="{ row }">
                        <span>￥{{ (row.amount.toFixed(2) * 100) / 100 }}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="[2, 3, 4, 5].includes(orderStatus)" key="remark" prop="remark" label="备注"
                    align="center" />
                <el-table-column v-if="[2, 3, 4].includes(orderStatus)" key="tablewareNumber" prop="tablewareNumber"
                    label="餐具数量" align="center" min-width="80" />
                <el-table-column prop="btn" label="操作" align="center">
                    <template slot-scope="{ row }">
                        <!-- <el-divider direction="vertical" /> -->
                        <div class="before" style="width: 40px;">
                            <el-button v-if="row.status === 2" style="color:#67C23A" type="text" class="blueBug"
                                @click="orderAccept(row)">
                                接单
                            </el-button>
                            <el-button v-if="row.status === 3" style="color:#67C23A" type="text" class="blueBug"
                                @click="DeliveryOrComplete(3, row.id)">
                                派送
                            </el-button>
                            <el-button v-if="row.status === 4" style="color:#67C23A" type="text" class="blueBug"
                                @click="DeliveryOrComplete(4, row.id)">
                                完成
                            </el-button>
                        </div>
                        <div class="middle" style="width: 40px;">
                            <el-button v-if="row.status === 2" style="color:#F56C6C" type="text" class="delBut"
                                @click="rejectOrder(row)">
                                拒单
                            </el-button>
                            <el-button v-if="[1, 3, 4, 5].includes(row.status)" style="color:#F56C6C" type="text"
                                class="delBut" @click="cancelOrder(row)">
                                取消
                            </el-button>
                        </div>
                        <div class="after" style="width: 40px;">
                            <el-button type="text" class="blueBug non" style="color:#E6A23C"
                                @click="goToDetail(row.id, row.status, row)">
                                查看
                            </el-button>
                        </div>

                        <!-- 取消展示框 -->
                        <el-dialog title="取消" :visible.sync="cancelDialogVisible" width="30%"
                            :before-close="handleCancelClose">
                            <span>选择取消原因</span>

                            <el-form :model="cancelReason">
                                <el-form-item :label="'取消原因：'">
                                    <el-select v-model="cancelReason" :placeholder="'请选择取消原因'">
                                        <el-option v-for="(item, index) in RejectReasonList" :key="index"
                                            :label="item.label" :value="item.label" />
                                    </el-select>
                                </el-form-item>
                            </el-form>

                            <span slot="footer" class="dialog-footer">
                                <el-button @click="cancelDialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="doCancel">确 定</el-button>
                            </span>
                        </el-dialog>

                        <!-- 拒单展示框 -->
                        <el-dialog title="拒单" :visible.sync="rejectDialogVisible" width="30%"
                            :before-close="handleRejectClose">
                            <span>选择拒单原因</span>

                            <el-form :model="rejectReason">
                                <el-form-item :label="'拒单原因：'">
                                    <el-select v-model="cancelReason" :placeholder="'请选择拒单原因'">
                                        <el-option v-for="(item, index) in cancelOrderReasonList" :key="index"
                                            :label="item.label" :value="item.label" />
                                    </el-select>
                                </el-form-item>
                            </el-form>

                            <span slot="footer" class="dialog-footer">
                                <el-button @click="rejectDialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="doReject">确 定</el-button>
                            </span>
                        </el-dialog>

                        <!-- 查看详情展示框-->
                        <el-dialog clearable title="查看" :visible.sync="detailVisible" width="80%"
                            :before-close="handleDetailClose">
                            <el-header class="el-dialog__header">
                                <div style="text-align: center; font-weight: bold;">
                                    <span class="userDivSpan">订单号:</span>
                                    <span>{{ dialogData.number }}</span>
                                </div>
                            </el-header>
                            <el-container>
                                <el-main>
                                    <div class="order-info-section"  style="background-color: red;">
                                        <!--用户信息div-->
                                        <div class="user-info-div">
                                            <span class="userDivSpan">收货人:</span>
                                            <span class="userMsgDivSpan">{{ dialogData.consignee }}</span>
                                        </div>
                                        <div class="user-info-div">
                                            <span class="userDivSpan">地址:</span>
                                            <span>{{ dialogData.address }}</span>
                                        </div>
                                        <div class="user-info-div">
                                            <span class="userDivSpan">手机号:</span>
                                            <span>{{ dialogData.phone }}</span>
                                        </div>
                                        <div class="user-info-div">
                                            <span class="userDivSpan">备注:</span>
                                            <span>{{ dialogData.remark }}</span>
                                        </div>
                                    </div>
                                    <div class="order-info-section" style="background-color: green;">
                                        <div class="order-info-section-left">
                                            <!-- 展示订单号、下单时间等信息 -->
                                            <div class="user-info-div">
                                                <span class="userDivSpan">订单号:</span>
                                                <span>{{ dialogData.number }}</span>
                                            </div>
                                            <div class="user-info-div">
                                                <span class="userDivSpan">下单时间:</span>
                                                <span>{{ dialogData.orderTime }}</span>
                                            </div>
                                        </div>
                                        <div class="order-info-section-right">
                                            <!-- 展示付款状态、付款时间、付款方式等信息 -->
                                            <div style="float: right;">
                                                <span class="userDivSpan">付款状态:</span>
                                                <span>{{ dialogData.payStatus === 0 ? '未支付' : dialogData.payStatus === 1 ?
                                                    '已支付' : '退款' }}</span>
                                            </div>
                                            <div class="user-info-div">
                                                <span class="userDivSpan">付款时间:</span>
                                                <span>{{ dialogData.checkoutTime }}</span>
                                            </div>
                                            <div class="user-info-div">
                                                <span class="userDivSpan">付款方式:</span>
                                                <span>{{ dialogData.payMethod === 1 ? '微信支付' : '支付宝' }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="background-color: #E6A23C;">
                                        <!--订单菜品信息div-->
                                        <div class="dish-list">
                                            <div v-for="(item, index) in dialogData.orderDetailList" :key="index"
                                                class="dish-item">
                                                <div class="dish-name">{{ item.name }}</div>
                                                <div class="dish-num">x{{ item.number }}</div>
                                                <div class="dish-price">￥{{ item.amount ? item.amount.toFixed(2) : '' }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="user-info-div">
                                            <span class="userDivSpan">总金额:</span>
                                            <span>￥{{ dialogData.amount }}</span>
                                        </div>
                                    </div>
                                </el-main>
                                <el-footer class="el-dialog__footer">
                                    <div class="operation-btn-div"
                                        style="width: 40px;display:inline;margin-right: 50px;">
                                        <el-button v-if="row.status === 2" style="color:#67C23A" type="text"
                                            class="blueBug" @click="orderAccept(row)">
                                            接单
                                        </el-button>
                                        <el-button v-if="row.status === 3" style="color:#67C23A" type="text"
                                            class="blueBug" @click="DeliveryOrComplete(3, row.id)">
                                            派送
                                        </el-button>
                                        <el-button v-if="row.status === 4" style="color:#67C23A" type="text"
                                            class="blueBug" @click="DeliveryOrComplete(4, row.id)">
                                            完成
                                        </el-button>
                                    </div>
                                    <div class="operation-btn-div" style="width: 40px;display:inline;">
                                        <el-button v-if="row.status === 2" style="color:#F56C6C" type="text"
                                            class="delBut" @click="rejectOrder(row)">
                                            拒单
                                        </el-button>
                                        <el-button v-if="[1, 3, 4, 5].includes(row.status)" style="color:#F56C6C"
                                            type="text" class="delBut" @click="cancelOrder(row)">
                                            取消
                                        </el-button>
                                    </div>
                                </el-footer>
                            </el-container>
                        </el-dialog>

                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-if="total > 10" class="pageList" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Watch } from 'vue-property-decorator'
import Component from 'vue-class-component';
import { getOrderDetailPage, getNumberOfStatus, orderAccept, deliveryOrder, completeOrder, orderCancel, orderReject, queryOrderDetailById } from '@/api/Order'
import TabChange from './tableChangeView.vue'
import { Loading } from 'element-ui';

@Component({
    components: {
        TabChange
    },
})
export default class extends Vue {

    private orderStatus = 0 //列表字段展示所需订单状态,用于分页请求数据
    private orderStatics = {}

    private inputNumber = '';
    private phone = '';
    private date = '';

    private currentStatus = 0;

    private record = [];
    private loading = true;
    private orderId;

    private page = 1;
    private pageSize = 10;
    private total = 0;

    private id;

    private cancelDialogVisible = false;
    private rejectDialogVisible = false;
    private detailVisible = false;

    private cancelReason = '';
    private rejectReason = '';

    private dialogData = [];

    private cancelOrderReasonList = [
        {
            value: 1,
            label: '订单量较多，暂时无法接单',
        },
        {
            value: 2,
            label: '菜品已销售完，暂时无法接单',
        },
        {
            value: 3,
            label: '餐厅已打烊，暂时无法接单',
        },
        {
            value: 0,
            label: '自定义原因',
        },
    ]

    private RejectReasonList = [
        {
            value: 1,
            label: '订单量较多，暂时无法接单',
        },
        {
            value: 2,
            label: '菜品已销售完，暂时无法接单',
        },
        {
            value: 3,
            label: '骑手不足无法配送',
        },
        {
            value: 4,
            label: '客户电话取消',
        },
        {
            value: 0,
            label: '自定义原因',
        },
    ]

    doCancel() {
        // 构建参数
        const param = ({
            id: this.id,
            cancelReason: this.cancelReason
        })
        this.id = null;
        this.cancelReason = '';
        orderCancel(param).then((res) => {
            if (res.data.code === 1) {
                this.handleSuccess("取消成功")
            }
        })
        this.cancelDialogVisible = false;
        this.init(this.currentStatus);
    }

    doReject() {
        // 构建参数
        const param = ({
            id: this.id,
            rejectionReason: this.rejectReason
        })
        this.id = null;
        this.rejectReason = '';
        orderReject(param).then((res) => {
            if (res.data.code === 1) {
                this.handleSuccess("拒单成功")
            }
        })
        this.rejectDialogVisible = false;
        this.init(this.currentStatus);
    }

    async goToDetail(id: any, status: number, row?: any) {
        const { data } = await queryOrderDetailById({ orderId: id })
        this.dialogData = data.data
        this.detailVisible = true;
    }

    cancelOrder(row: any) {
        this.cancelDialogVisible = true;
        this.id = row.id;
    }

    rejectOrder(row: any) {
        this.rejectDialogVisible = true;
        this.id = row.id;
    }

    handleCancelClose(done) {
        done();
        this.cancelDialogVisible = false;
        this.cancelReason = '';
    }
    handleRejectClose(done) {
        done();
        this.rejectDialogVisible = false;
        this.rejectReason = '';
    }

    handleDetailClose(done) {
        done();
        this.detailVisible = false;
        this.dialogData = [];
    }

    mounted() {
        this.init(this.currentStatus)
    }

    initFun(orderStatus) {
        this.page = 1
        this.init(orderStatus)
    }

    init(pramaStatus = 0) {
        this.loading = true;
        //构建参数
        const param = {
            page: this.page,
            pageSize: this.pageSize,
            number: this.inputNumber || undefined,
            phone: this.phone || undefined,
            startTime:
                this.date
                    ? this.date[0]
                    : undefined,
            endTime:
                this.date
                    ? this.date[1]
                    : undefined,
            status: pramaStatus || undefined
        }
        setTimeout(() => {
            getOrderDetailPage({ ...param }).then((res) => {
                if (res.data.code === 1) {
                    this.record = res.data.data.record
                    this.currentStatus = pramaStatus//init参数表示查询哪种状态的数据
                }
                this.getOrderListBy3Status();
            }).catch((msg) => {
                this.$message.error(msg)
            })
            this.loading = false
        }, 500)
    }

    //获取待处理，待派送，派送中数量
    getOrderListBy3Status() {
        getNumberOfStatus({})
            .then((res) => {
                if (res.data.code === 1) {
                    this.orderStatics = res.data.data
                } else {
                    this.$message.error(res.data.msg)
                }
            })
            .catch((err) => {
                this.$message.error('请求出错了：' + err.message)
            })
    }

    change(paramStatus) {
        if (paramStatus === this.currentStatus) return
        this.init(paramStatus)
        console.log(paramStatus, '接收到了子组件的index')
    }

    handleCurrentChange(val: number) {
        this.page = val;
        // this.pageQuery();
    }

    handleSizeChange(val: number) {
        this.pageSize = val;
        // this.pageQuery();
    }

    handleSuccess(msg) {
        const h = this.$createElement;
        this.$notify({
            title: '',
            message: h('i', { style: 'color: teal' }, msg)
        });
    }

    getOrderType(row: any) {
        if (row.status === 1) {
            return '待付款'
        } else if (row.status === 2) {
            return '待接单'
        } else if (row.status === 3) {
            return '待派送'
        } else if (row.status === 4) {
            return '派送中'
        } else if (row.status === 5) {
            return '已完成'
        } else if (row.status === 6) {
            return '已取消'
        } else {
            return '退款'
        }
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

    orderAccept(row: any) {
        this.orderId = row.id
        // this.dialogOrderStatus = row.status
        orderAccept({ id: this.orderId })
            .then((res) => {
                if (res.data.code === 1) {
                    this.$message.success('操作成功')
                    this.orderId = ''
                    // this.dialogOrderStatus = 0
                    //   this.dialogVisible = false
                    this.init(this.currentStatus)
                } else {
                    this.$message.error(res.data.msg)
                }
            })
            .catch((err) => {
                this.$message.error('请求出错了：' + err.message)
            })
    }

    // 派送，完成
    DeliveryOrComplete(status: number, id: string) {
        const params = {
            status,
            id,
        };
        (status === 3 ? deliveryOrder : completeOrder)(params)
            .then((res) => {
                if (res.data.code === 1) {
                    this.$message.success('操作成功')
                    this.orderId = ''
                    // this.dialogOrderStatus = 0
                    // this.dialogVisible = false
                    this.init(this.currentStatus)
                } else {
                    this.$message.error(res.data.msg)
                }
            })
            .catch((err) => {
                this.$message.error('请求出错了：' + err.message)
            })
    }

}
</script>

<style lang="scss">
.tableBox {
   .cell {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.userDivSpan {
    border-radius: 5px;
    background-color: #0bf1af;
    display: inline-flex;
    align-items: center; 
    justify-content: center; 
    width: 150px;
    height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 10px;
    color: #333;
    overflow: hidden;
}

.chDiv{
    height: 50px;
}

.user-info-div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    height: 50px;
}

.order-info-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.order-info-section-left {
    width: 40%;
    height:50px;
}

.order-info-section-right {
    width: 60%;
    height:100px;
}

.dish-list {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
}

.dish-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
    height: 100px;
}

.el-dialog__header {
    background-color: #f0f0f0;
    padding: 10px;
    text-align: center;
    font-weight: bold;
}

.el-dialog__footer {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
}

.operation-btn-div {
    margin-left: 10px;
}

.el-dialog {
    border: 1px solid #ccc;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    font-family: Arial, sans-serif;
    font-size: 14px;
}

.el-dialog__title {
    color: #666;
}
</style>