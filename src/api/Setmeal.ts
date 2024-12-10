import request from '@/utils/request'


// 分页查询
export const getSetmealList = (params: any) =>
    request({
        'url': `/setmeal/page`,
        'method': 'GET',
        'params': params
    })

// 查询详情接口
export const querySetmealById = (id: string | (string | null)[]) => {
    return request({
        url: `/setmeal/${id}`,
        method: 'GET'
    })
}

//条件分页查询
export const getSetmealListByMsg = (params: any) =>
    request({
        'url': `/setmeal/search`,
        'method': 'POST',
        'data': params
    })

// 启用禁用员工账号
export const enableOrDisablesSetmeal = (params) =>
    request({
        'url': `/setmeal/status/${params.status}`,
        'method': 'POST',
        'params': { id: params.id }
    })

//批量删除
export const deleteByIds = (ids: number[]) =>
    request({
        'url': '/setmeal/delete',
        'method': 'DELETE',
        data: ids
    });

// 新增数据接口
export const addSetmeal = (params: any) => {
    return request({
      url: '/setmeal',
      method: 'post',
      data: { ...params }
    })
  }

  // 修改数据接口
export const modifySetmeal = (params: any) => {
    return request({
      url: '/setmeal',
      method: 'put',
      data: { ...params }
    })
  }