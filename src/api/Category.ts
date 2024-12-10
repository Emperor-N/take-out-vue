import request from '@/utils/request'

// 修改分类
export const modifyCategory = (params: any) =>
  request({
    'url': '/category/modify',
    'method': 'POST',
    'data': params
  })
//新增分类
export const addCategory = (params: any) =>
  request({
    'url': '/category',
    'method': 'POST',
    'data': params
  })
// 根据id查询分类
export const queryCategoryById = (id: number) =>
  request({
    'url': `/category/${id}`,
    'method': 'GET'
  })

// 分页查询
export const getCategoryPage = (params: any) =>
  request({
    'url': `/category/page`,
    'method': 'GET',
    'params': params
  })

//条件分页查询
export const getCategoryPageByMsg = (params: any) =>
  request({
    'url': `/category/search`,
    'method': 'POST',
    'data': params
  })

// 分页查询
export const dishCategoryList = (params: any) =>
  request({
    'url': `/category/list`,
    'method': 'GET',
    'params': params
  })

//批量删除
export const deleteByIds = (ids: number[]) =>
  request({
    'url': '/category/delete',
    'method': 'DELETE',
    data: ids
  });

export const enableOrDisableCategory = (params) =>
  request({
    'url': `/category/status/${params.status}`,
    'method': 'POST',
    'params': { id: params.id }
  });
