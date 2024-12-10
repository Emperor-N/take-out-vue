<!--  -->
<template>
    <div class="tab-change">
      <div v-for="item in changedOrderList"
           :key="item.value"
           class="tab-item"
           :class="{ active: item.value === currentStatus }"
           @click="tabChange(item.value)">
        <el-badge class="item"
                  :value="item.num > 99 ? '99+' : item.num"
                  :hidden="!([2, 3, 4].includes(item.value) && item.num)"
                  >
          {{ item.label }}
        </el-badge>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
  import { getOrderDetailPage } from '@/api/Order'
  
  @Component({
    name: 'TabChange'
  })
  export default class extends Vue {
    @Prop({ default: '' }) orderStatics: any
    @Prop({ default: '' }) defaultActivity: any
    private currentStatus = 0
  
    @Watch('defaultActivity')
    private onChange(val) {
      this.currentStatus = Number(val)
    }
  
    get changedOrderList() {
      return [
        {
          label: '全部订单',
          value: 0
        },
        {
          label: '待接单',
          value: 2,
          num: this.orderStatics.toBeConfirmed
        },
        {
          label: '待派送',
          value: 3,
          num: this.orderStatics.confirmed
        },
        {
          label: '派送中',
          value: 4,
          num: this.orderStatics.deliveryInProgress
        },
        {
          label: '已完成',
          value: 5
        },
        {
          label: '已取消',
          value: 6
        }
      ]
    }
  
    private tabChange(paramStatus) {
      this.currentStatus = paramStatus
      this.$emit('tabChange', paramStatus)
    }
  }
  </script>

<style lang="scss">

.tab-change {
    display: flex;
    position: relative;
    align-content: center;
   .tab-item{
       .item{
            width: 80px;
            line-height: 50px;
            display: flex;
            justify-content: center;
            align-items: center; 
        }
    }
   .active {
        background-color: #ffc200;
        font-weight: bold;
    }
   .tab-item:first-child {
        border-left: 1px solid #e5e4e4;
    }
}


</style>
  