import request from '@/utils/request'
import {
    AllSaleAttrResponseData,
    AllTradeMark,
    HasSpuResponseData,
    SaleAttrResponseData,
    SkuData,
    SkuInfoData,
    SpuData,
    SpuImagesResp,
} from './type'

// SPU 相关 API
enum SpuApi {
    LIST = '/admin/product/',
    ADD = '/admin/product/saveSpuInfo',
    UPDATE = '/admin/product/updateSpuInfo',
    DELETE = '/admin/product/deleteSpu/',
    IMAGES_LIST = '/admin/product/spuImageList/',
    SALE_ATTRS_LIST = '/admin/product/spuSaleAttrList/',
}

// SKU 相关 API
enum SkuApi {
    ADD = '/admin/product/saveSkuInfo',
    LIST_BY_SPU = '/admin/product/findBySpuId/',
}

// 商品销售属性相关 API
enum SaleAttrApi {
    LIST_ALL = '/admin/product/baseSaleAttrList',
}

// 品牌相关 API
enum TrademarkApi {
    LIST_ALL = '/admin/product/baseTrademark/getTrademarkList',
}

export const reqGetSpuData = (page: number, limit: number, category3Id: number | string) =>
    request.get<any, HasSpuResponseData>(`${SpuApi.LIST}${page}/${limit}?category3Id=${category3Id}`)

export const reqAddOrUpdateSpu = (data: SpuData) => {
    if (data.id) {
        return request.post<any, any>(SpuApi.UPDATE, data)
    } else {
        return request.post<any, any>(SpuApi.ADD, data)
    }
}

export const reqRemoveSpu = (spuId: number | string) => request.delete<any, any>(SpuApi.DELETE + spuId)

export const reqSpuImageList = (spuId: number) => request.get<any, SpuImagesResp>(SpuApi.IMAGES_LIST + spuId)

export const reqSpuSaleAttrs = (spuId: number) => request.get<any, SaleAttrResponseData>(SpuApi.SALE_ATTRS_LIST + spuId)

export const reqAddSku = (data: SkuData) => request.post<any, any>(SkuApi.ADD, data)

export const reqSkuList = (spuId: number | string) => request.get<any, SkuInfoData>(SkuApi.LIST_BY_SPU + spuId)

export const reqAllSaleAttr = () => request.get<any, AllSaleAttrResponseData>(SaleAttrApi.LIST_ALL)

export const reqAllTradeMark = () => request.get<any, AllTradeMark>(TrademarkApi.LIST_ALL)
