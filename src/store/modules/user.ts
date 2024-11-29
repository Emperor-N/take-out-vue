import store from "@/store"
import { Model } from "vue-property-decorator";
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login,userLogout,userModify } from '@/api/Employee'
import Cookies from 'js-cookie'
import { Message } from 'element-ui'

export interface IUserState{
    token:string;
    userInfo:string;
    userName:string;
    oldPassword:string;
    newPassword:string;
}

@Module({ 'dynamic': true, store, 'name': 'user' })//属性1：动态创建，运行时创建实例，2：标识为vues组件，模块名为user
class User extends VuexModule implements IUserState{//继承VuexModule以创建vues标准模块
    public token = '';
    public userInfo;
    public userName;
    public oldPassword;
    public newPassword;

    @Mutation
    private SET_OLDPASSWORD(op:string){
        this.oldPassword = op;
    }

    @Mutation
    private SET_NEWPASSWORD(np:string){
        this.newPassword = np;
    }

    @Mutation
    private SET_TOKEN(token:string){
        this.token = token;
    }

    @Mutation
    private SET_USERINFO(userinfo:string){
        this.userInfo = userinfo;
    }

    @Mutation
    private SET_USERNAME(username:string){
        this.userName = username;
    }

    @Action
    public async Login(userinfo:{username:string,password:string}){
        let {username,password} = userinfo;//获取指定值
        username = username.trim();
        password = password.trim();
        const { data } = await login({ username, password })//调用login方法获取指定data对象,异步等待
        if(String(data.code) === '1'){
            this.SET_USERNAME(username);//设置共享数据
            this.SET_TOKEN(data.data.token);
            this.SET_USERINFO(data.data.password);

            Cookies.set('username', username);//设置cookies
            Cookies.set('user_info', data.data.password);
            Cookies.set("token", data.data.token);

            return data;//将数据返回页面
        }else{
            return Message.error(data.msg)
        }
    }

    @Action
    public async loginOut(){
        const {data} = await userLogout({});
        this.SET_TOKEN('')
        this.SET_USERINFO(null)
        this.SET_USERNAME('')
        Cookies.remove('username');
        Cookies.remove('user_info');
    } 

    @Action
    public async modify(payload:{ oldPassword: string; newPassword: string }){
        const oldPW = Cookies.get('user_info');
        if(payload.oldPassword === payload.newPassword){
            return {msg:'新旧密码相同，请重试',type:2}
        }

        if(oldPW != payload.oldPassword){
            return {msg:'原始密码错误',type:2};
        }

        const { data } = await userModify(payload.newPassword)

        if(data.code === 1){
            Cookies.set('user_info',data.data)
            return {msg:data,type:1};
        }
        return {msg:'请求出错了',type:2}
    }

}

export const UserModule = getModule(User)