<template>
    <div>
        <el-container>
            <el-header style="height: 80px; border: 1px solid #eee">
                <div class="avatar-wrapper" style="margin-top: 10px;">
                    <div @mouseenter="toggleShow" @mouseleave="mouseLeaves" style="background-color: white;position: relative; z-index: 100;border:1px red solid;float:right;width:100px">                       
                            系统
                        <div v-if="show" class="userList" style=" z-index: 101;">
                            <el-button @click="modify" style="width: 100%;align-content: center;font-size: 16px;">
                                修改密码<i />
                            </el-button>
                            <br>
                            <el-button @click="logout" style="width: 100%;align-content: center;font-size: 16px;">
                                退出登录<i />
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-header>
            <el-container>
                <el-aside width=50px style="line-height: 100%;">
                    <div style="line-height: 780px;" @mouseover="drawer = true">
                        <p1>></p1>
                    </div>
                </el-aside>
                <el-drawer style="width: 1000px;" title="导航栏" :visible.sync="drawer" :direction="direction"
                    :before-close="handleClose">
                    <el-aside style="width: 100%;">
                        <div>
                            <router-link to="/spacework">工作台</router-link>
                            <router-link to="/data">数据统计</router-link>
                            <router-link to="/order">订单管理</router-link>
                            <router-link to="/dish">菜品管理</router-link>
                            <router-link to="/setmeal">套餐管理</router-link>
                            <router-link to="/category">分类管理</router-link>
                            <router-link to="/employee">员工管理</router-link>
                        </div>
                    </el-aside>
                </el-drawer>

                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script lang="ts">
import { Vue, Watch } from 'vue-property-decorator'
import Component from 'vue-class-component';



@Component
export default class extends Vue {
    private drawer = false;
    private direction = 'ltr';
    private hover = false;
    private show = false;
    private oldPassword = null;
    private newPassword = null;

    handleClose(done) {
        done();
    }

    modify(){
            this.$router.push('/modify');
    }

    handleSuccess(msg) {
        const h = this.$createElement;
        this.$notify({
            title: '',
            message: h('i', { style: 'color: teal' }, msg)
        });
    }

    logout(){
        this.$store.dispatch('loginOut').then(()=>{
            this.handleSuccess('退出成功');
            setTimeout(()=>{
                this.$router.replace('/');
            },500)
        })
    }

    toggleShow(){
        this.show = true;
    }

    mouseLeaves(){
        this.show = false;
    }

}
</script>

<style>

.router-link-active,
a {
    text-decoration: none;
    color: black;
    display: block;
    /* 将元素设置为块级元素 */
    width: 100%;
    /* 使其宽度占满父元素 */
}

a:hover,
.router-link-active:hover {
    background-color: bisque;
}

.el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    padding: 0;
    margin: 0;
}

.el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    height: 780px;
    line-height: 30px;
    padding: 0;
    margin: 0;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
    margin: 0;
}
</style>