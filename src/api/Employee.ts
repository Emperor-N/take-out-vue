import request from '@/utils/request'

//登录
export const login = (data: any) =>
  request({
    'url': '/employee/login',
    'method': 'POST',
    data: data
  })

//批量删除
export const deleteByIds = (ids: number[]) =>
  request({
    'url': '/employee/delete',
    'method': 'DELETE',
    data: ids
  });

//修改密码
export const userModify = (data: string) =>
  request({
    'url': `/employee/password/${data}`,
    'method': 'GET',
  });

// 退出
export const userLogout = (params: any) =>
  request({
    'url': `/employee/logout`,
    'method': 'POST',
    params
  })

// 分页查询
export const getEmployeeList = (params: any) =>
  request({
    'url': `/employee/page`,
    'method': 'GET',
    'params': params
  })

//条件分页查询
export const getEmployeeListByMsg = (params: any) =>
  request({
    'url': `/employee/search`,
    'method': 'POST',
    'data': params
  })

// 启用禁用员工账号
export const enableOrDisableEmployee = (params) =>
  request({
    'url': `/employee/status/${params.status}`,
    'method': 'POST',
    'params': { id: params.id }
  })

// 新增员工
export const addEmployee = (params: any) =>
  request({
    'url': '/employee',
    'method': 'POST',
    'data': params
  })

  // 新增员工
export const enrollEmployee = (params: any) =>
  request({
    'url': '/employee/enroll',
    'method': 'POST',
    'data': params
  })

// 修改员工
export const modifyEmployee = (params: any) =>
  request({
    'url': '/employee/modify',
    'method': 'POST',
    'data': params
  })


// 根据id查询员工
export const queryEmployeeById = (id: number) =>
  request({
    'url': `/employee/${id}`,
    'method': 'GET'
  })

// 修改员工
export const updateEmployee = (params: any) =>
  request({
    'url': '/employee',
    'method': 'PUT',
    'data': params
  })