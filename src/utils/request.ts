import axios from 'axios'
import { UserModule } from '@/store/modules/user'
import router from '@/router'

const service = axios.create({
    baseURL: "/api",//请求统一前缀
    'timeout': 600000//10分钟
})

service.interceptors.request.use(
    (config: any) => {
        
      if (UserModule.token) {
        config.headers['token'] = UserModule.token;
      } else if (config.url !== '/employee/login') {
        window.location.href = '/login';
        return Promise.reject('Redirecting to login');
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

service.interceptors.response.use(
    (response)=>{
        if(response.data.status === 401){
            router.push('/login')
        }
        response.config.url = response.config.url.replace('/api', '');//去除前缀
        return response;
    }
)

export default service//导出模块