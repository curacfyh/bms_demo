<template>
    <el-form label-width="100px" style="max-width: 990px">
        <el-form-item label="SPU名称">
            <el-input placeholder="请输入SPU名称" v-model="spuParams.spuName" />
        </el-form-item>
        <el-form-item label="SPU品牌">
            <el-select style="width: 250px" v-model="spuParams.tmId">
                <el-option v-for="item in allTradeMark" :key="item.id" :label="item.tmName" :value="item.id ?? ''" />
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" placeholder="请输入SPU描述" v-model="spuParams.description" />
        </el-form-item>
        <el-form-item label="SPU图标">
            <el-upload
                v-model:file-list="imgList"
                action="/api/admin/product/fileUpload"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :before-upload="handlerUpload"
            >
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="SPU销售属性">
            <el-select
                v-model="saleAttrIdAndValueName"
                :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'"
                style="width: 250px"
            >
                <el-option
                    :value="`${item.id}:${item.name}`"
                    v-for="item in unSelectSaleAttr"
                    :key="item.id"
                    :label="item.name"
                ></el-option>
            </el-select>
            <el-button
                @click="addSaleAttr"
                :disabled="saleAttrIdAndValueName ? false : true"
                style="margin-left: 10px"
                type="primary"
                size="default"
                icon="Plus"
            >
                添加属性
            </el-button>
            <el-table border style="margin: 10px 0px" :data="saleAttr">
                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
                <el-table-column label="销售属性值">
                    <template #default="{ row }">
                        <el-tag
                            style="margin: 0px 5px"
                            @close="row.spuSaleAttrValueList.splice(index, 1)"
                            v-for="(item, index) in row.spuSaleAttrValueList"
                            :key="item.id"
                            class="mx-1"
                            closable
                        >
                            {{ item.saleAttrValueName }}
                        </el-tag>
                        <el-input
                            @blur="saveAndToggleViewMode(row)"
                            v-model="row.saleAttrValue"
                            v-if="row.flag == true"
                            placeholder="请你输入属性值"
                            size="small"
                            style="width: 100px"
                        ></el-input>
                        <el-button
                            @click="toggleEditMode(row)"
                            v-else
                            type="primary"
                            size="small"
                            icon="Plus"
                        ></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template #default="{ $index }">
                        <el-button
                            type="primary"
                            size="small"
                            icon="Delete"
                            @click="saleAttr.splice($index, 1)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button :disabled="saleAttr.length > 0 ? false : true" type="primary" size="default" @click="save">
                保存
            </el-button>
            <el-button type="primary" size="default" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { reqAddOrUpdateSpu, reqAllSaleAttr, reqAllTradeMark, reqSpuImageList, reqSpuSaleAttrs } from '@/api/product/spu'
import {
    AllSaleAttr,
    AllSaleAttrResponseData,
    AllTradeMark,
    SaleAttr,
    SaleAttrResponseData,
    SaleAttrValue,
    SpuData,
    SpuImagesResp,
    SpuImgage,
} from '@/api/product/spu/type'
import { TradeMark } from '@/api/product/trademark/type'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'

let allTradeMark = ref<TradeMark[]>([])
let imgList = ref<SpuImgage[]>([])
let saleAttr = ref<SaleAttr[]>([])
let allSaleAttr = ref<AllSaleAttr[]>([])
let dialogVisible = ref<boolean>(false)
let dialogImageUrl = ref<string>('')

let $emit = defineEmits(['changeScene'])
const cancel = () => {
    $emit('changeScene', { flag: 0, params: 'update' })
}
let spuParams = ref<SpuData>({
    category3Id: '', //收集三级分类的ID
    spuName: '', //SPU的名字
    description: '', //SPU的描述
    tmId: '', //品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
})
let saleAttrIdAndValueName = ref<string>('')
const initSpuData = async (spu: SpuData) => {
    spuParams.value = spu
    let trademarkResp: AllTradeMark = await reqAllTradeMark()
    let spuImagesResp: SpuImagesResp = await reqSpuImageList(spu.id as number)
    let saleAttrResp: SaleAttrResponseData = await reqSpuSaleAttrs(spu.id as number)
    let allSaleAttrResp: AllSaleAttrResponseData = await reqAllSaleAttr()

    allTradeMark.value = trademarkResp.data
    imgList.value = spuImagesResp.data
    saleAttr.value = saleAttrResp.data
    allSaleAttr.value = allSaleAttrResp.data

    imgList.value = spuImagesResp.data.map((item) => {
        return {
            name: item.imgName,
            url: item.imgUrl,
        }
    })
}
const handlePictureCardPreview = (file: any) => {
    dialogImageUrl.value = file.url
    //对话框弹出来
    dialogVisible.value = true
}
//照片墙删除文件钩子
const handleRemove = () => {
    console.log(123)
}
//照片钱上传成功之前的钩子约束文件的大小与类型
const handlerUpload = (file: any) => {
    if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
        if (file.size / 1024 / 1024 < 3) {
            return true
        } else {
            ElMessage({
                type: 'error',
                message: '上传文件务必小于3M',
            })
            return false
        }
    } else {
        ElMessage({
            type: 'error',
            message: '上传文件务必PNG|JPG|GIF',
        })
        return false
    }
}
const unSelectSaleAttr = computed(() => {
    let unSelectArr = allSaleAttr.value.filter((item) => {
        return saleAttr.value.every((item1) => {
            return item.name != item1.saleAttrName
        })
    })
    return unSelectArr
})
const addSaleAttr = () => {
    const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
    let newSaleAttr: SaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
    }
    saleAttr.value.push(newSaleAttr)
    saleAttrIdAndValueName.value = ''
}
const toggleEditMode = (row: SaleAttr) => {
    row.flag = true
    row.saleAttrValue = ''
}
const saveAndToggleViewMode = (row: SaleAttr) => {
    const { baseSaleAttrId, saleAttrValue } = row
    let newSaleAttrValue: SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: saleAttrValue as string,
    }
    if ((saleAttrValue as string).trim() == '') {
        ElMessage({
            type: 'error',
            message: '属性值不能为空的',
        })
        return
    }
    let duplicateValue = row.spuSaleAttrValueList.find((item) => {
        return item.saleAttrValueName == saleAttrValue
    })

    if (duplicateValue) {
        ElMessage({
            type: 'error',
            message: '属性值重复',
        })
        return
    }

    //追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue)
    //切换为查看模式
    row.flag = false
}
const save = async () => {
    spuParams.value.spuImageList = imgList.value.map((item: any) => {
        return {
            imgName: item.name,
            imgUrl: (item.response && item.response.data) || item.url,
        }
    })
    spuParams.value.spuSaleAttrList = saleAttr.value
    let result = await reqAddOrUpdateSpu(spuParams.value)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: spuParams.value.id ? '更新成功' : '添加成功',
        })
        $emit('changeScene', {
            flag: 0,
            params: spuParams.value.id ? 'update' : 'add',
        })
    } else {
        ElMessage({
            type: 'success',
            message: spuParams.value.id ? '更新成功' : '添加成功',
        })
    }
}
const initAddSpu = async (c3Id: number | string) => {
    Object.assign(spuParams.value, {
        category3Id: '',
        spuName: '',
        description: '',
        tmId: '',
        spuImageList: [],
        spuSaleAttrList: [],
    })
    imgList.value = []
    saleAttr.value = []
    saleAttrIdAndValueName.value = ''
    spuParams.value.category3Id = c3Id
    let allTrademarkResp: AllTradeMark = await reqAllTradeMark()
    let allSaleAttrResp: AllSaleAttrResponseData = await reqAllSaleAttr()
    allTradeMark.value = allTrademarkResp.data
    allSaleAttr.value = allSaleAttrResp.data
}
defineExpose({
    initSpuData,
    initAddSpu,
})
</script>

<style scoped></style>
