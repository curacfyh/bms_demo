//分类相关的数据ts类型
export interface ResponseData {
    code: number
    message: string
    ok: boolean
}

//分类ts类型
export interface CategoryObj {
    id: number | string
    name: string
    category1Id?: number
    category2Id?: number
}

//相应的分类接口返回数据的类型
export interface CategoryResponseData extends ResponseData {
    data: CategoryObj[]
}

export interface AttrValue {
    id?: number
    valueName: string
    attrId?: number
    isEditing?: boolean
}

export type AttrValueList = AttrValue[]

export interface ProductAttr {
    id?: number
    attrName: string
    categoryId: number | string
    categoryLevel: number
    attrValueList: AttrValueList
}

export type AttrList = ProductAttr[]

export interface AttrResponseData extends ResponseData {
    data: AttrList
}
