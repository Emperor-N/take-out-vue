import request from '@/utils/request'

export const getDishList = (params: any) => {
  return request({
    url: '/dish/page',
    method: 'get',
    params
  })
}

//条件分页查询
export const getDishListByMsg = (params: any) =>
  request({
    'url': `/dish/search`,
    'method': 'POST',
    'data': params
  })

//批量删除
export const deleteByIds = (ids: number[]) =>
  request({
    'url': '/dish/delete',
    'method': 'DELETE',
    data: ids
  });

  
// 修改员工
export const modifyDish = (params: any) =>
  request({
    'url': '/dish/modify',
    'method': 'POST',
    'data': params
  })

// 启用禁用员工账号
export const enableOrDisableDish = (params) =>
  request({
    'url': `/dish/status/${params.status}`,
    'method': 'POST',
    'params': { id: params.id }
  })

// 删除接口
export const deleteDish = (ids: string) => {
  return request({
    url: '/dish',
    method: 'delete',
    params: { ids }
  })
}

// 修改接口
export const editDish = (params: any) => {
  return request({
    url: '/dish',
    method: 'put',
    data: { ...params }
  })
}

// 新增接口
export const addDish = (params: any) => {
  return request({
    url: '/dish',
    method: 'post',
    data: { ...params }
  })
}

// 查询详情
export const queryDishById = (id: string | (string | null)[]) => {
  return request({
    url: `/dish/${id}`,
    method: 'get'
  })
}

// 获取菜品分类列表
export const getCategoryList = (params: any) => {
  return request({
    url: '/category/list',
    method: 'get',
    params
  })
}

// 查菜品列表的接口
export const queryDishList = (params: any) => {
  return request({
    url: '/dish/list',
    method: 'get',
    params
  })
}

// 文件down预览
export const commonDownload = (params: any) => {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/common/download',
    method: 'get',
    params
  })
}

// 起售停售---批量起售停售接口
export const dishStatusByStatus = (params: any) => {
  return request({
    url: `/dish/status/${params.status}`,
    method: 'post',
    params: { id: params.id }
  })
}

//菜品分类数据查询
export const dishCategoryList = (params: any) => {
  return request({
    url: `/category/list`,
    method: 'get',
    params: { ...params }
  })
}


