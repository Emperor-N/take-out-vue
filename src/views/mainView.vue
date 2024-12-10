<template>
    <div>
        <el-container>
            <el-header style="height: 80px; border: 1px solid #eee;background-color: #15dab9;">

                <div class="avatar-wrapper" style="margin-top: 15px;">
                    <div style="float:left;width:200px;position: relative;bottom: 10px;font-size: 25px;">
                        主页 | {{ navTitel }}
                    </div>
                    <div @mouseover="setDrawer = true" @mouseleave="mouseLeaves"
                        style=" color:white;border-radius: 25px;box-shadow: 0 5px 12px 0 rgba(0, 0, 0, 0.3);background-color: #393e46; z-index: 100;float:right;width:150px;position: relative;bottom: 10px;">
                        设置
                    </div>
                    <el-drawer size="20%" title="设置" :visible.sync="setDrawer" :direction="setDirection"
                        :before-close="handleClose">
                        <el-button class="el-button" @click="modify"
                            style="width: 100%;color:white;background-color: #393e46;align-content: center;font-size: 16px;">
                            修改密码<i />
                        </el-button>
                        <br>
                        <el-button class="el-button" @click="logout"
                            style="width: 100%;color:white;background-color: #393e46;align-content: center;font-size: 16px;">
                            退出登录<i />
                        </el-button>
                    </el-drawer>
                </div>
            </el-header>
            <el-container>
                <el-aside width=50px style="line-height: 100%;background-color: #d7fbe8;height: 90vh;">
                    <div style="line-height: 780px;" @mouseover="navDrawer = true">
                        <p1>></p1>
                    </div>
                </el-aside>
                <el-drawer size="20%" class="custom - drawer" style="width: 100%;line-height: 10px;font-size: 20px;"
                    title="导航栏" :visible.sync="navDrawer" :direction="navDirection" :before-close="handleClose">
                    <el-aside style="width: 100%;height: 100%;background-color: #62d2a2">
                        <div>
                            <router-link to="/spacework" @click.native="closeNavDrawer('工作台')">工作台</router-link>
                            <router-link to="/data" @click.native="closeNavDrawer('数据统计')">数据统计</router-link>
                            <router-link to="/order" @click.native="closeNavDrawer('订单管理')">订单管理</router-link>
                            <router-link to="/dish" @click.native="closeNavDrawer('菜品管理')">菜品管理</router-link>
                            <router-link to="/setmeal" @click.native="closeNavDrawer('套餐管理')">套餐管理</router-link>
                            <router-link to="/category" @click.native="closeNavDrawer('分类管理')">分类管理</router-link>
                            <router-link to="/employee" @click.native="closeNavDrawer('员工管理')">员工管理</router-link>
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
    private navDrawer = false;
    private navDirection = 'ltr';
    private setDirection = 'rtl';
    private hover = false;
    private show = false;
    private oldPassword = null;
    private newPassword = null;
    private setDrawer = false;
    private navTitel = '员工管理';

    closeNavDrawer(Str: string) {
        this.navDrawer = false
        this.navTitel = Str;
    }

    closeSetDrawer() {
        this.setDrawer = false
    }

    handleClose(done) {
        done();
    }

    modify() {
        this.$router.push('/modify');
        this.closeSetDrawer();
    }

    handleSuccess(msg) {
        const h = this.$createElement;
        this.$notify({
            title: '',
            message: h('i', { style: 'color: teal' }, msg)
        });
    }

    logout() {
        this.$store.dispatch('loginOut').then(() => {
            this.handleSuccess('退出成功');
            setTimeout(() => {
                this.$router.replace('/');
            }, 500)
            this.closeSetDrawer();
        })
    }

    toggleShow() {
        this.show = true;
    }

    mouseLeaves() {
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
    width: 100%;
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