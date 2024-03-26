<template>
    <div>
        <Category :scene="scene"></Category>
        <el-card style="margin: 10px 0">
            <div v-show="scene == 0">
                <el-button
                    @click="addSpu"
                    type="primary"
                    size="default"
                    icon="Plus"
                    :disabled="categoryStore.c3Id ? false : true"
                >
                    添加SPU
                </el-button>
                <el-table border style="margin: 10px 0" :data="records">
                    <el-table-column label="序号" type="index" align="center" width="80px" />
                    <el-table-column label="SPU名称" prop="spuName" />
                    <el-table-column label="SPU描述" prop="description" show-overflow-tooltip />
                    <el-table-column label="SPU操作">
                        <template #default="{ row }">
                            <el-button
                                type="primary"
                                size="small"
                                icon="Plus"
                                title="添加SKU"
                                @click="addSku(row)"
                            ></el-button>
                            <el-button
                                type="primary"
                                size="small"
                                icon="Edit"
                                title="修改SPU"
                                @click="updateSpu(row)"
                            ></el-button>
                            <el-button
                                type="primary"
                                size="small"
                                icon="Search"
                                title="查看SPU列表"
                                @click="findSku(row)"
                            ></el-button>
                            <el-popconfirm :title="`你确定删除${row.spuName}?`" width="200px" @confirm="deleteSpu(row)">
                                <template #reference>
                                    <el-button type="primary" size="small" icon="Delete" title="删除SPU"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    v-model:current-page="pageNo"
                    v-model:page-size="pageSize"
                    :page-sizes="[3, 5, 7, 9]"
                    :background="true"
                    layout="prev, pager, next, jumper,->,sizes,total"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="getSpuData"
                />
            </div>
            <spuForm ref="spuFormRef" v-show="scene == 1" @changeScene="changeScene"></spuForm>
            <skuForm ref="skuFormRef" v-show="scene == 2" @changeScene="changeScene"></skuForm>
            <el-dialog v-model="show" title="SKU列表">
                <el-table border :data="skuArr">
                    <el-table-column label="SKU名字" prop="skuName"></el-table-column>
                    <el-table-column label="SKU价格" prop="price"></el-table-column>
                    <el-table-column label="SKU重量" prop="weight"></el-table-column>
                    <el-table-column label="SKU图片">
                        <template #default="{ row }">
                            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqGetSpuData, reqRemoveSpu, reqSkuList } from '@/api/product/spu'
import { Records, SkuData, SkuInfoData, SpuData } from '@/api/product/spu/type'
import spuForm from './spuForm.vue'
import skuForm from './skuForm.vue'
import { ElMessage } from 'element-plus'

const categoryStore = useCategoryStore()
let scene = ref<number>(0)
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let records = ref<Records>([])
let total = ref<number>(0)
let spuFormRef = ref<any>()
let skuFormRef = ref<any>()
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)

watch(
    () => categoryStore.c3Id,
    () => {
        if (!categoryStore.c3Id) return
        getSpuData()
    },
)
const getSpuData = async (targetPageNo = 1) => {
    pageNo.value = targetPageNo
    let resp = await reqGetSpuData(pageNo.value, pageSize.value, categoryStore.c3Id)
    if (resp.code === 200) {
        records.value = resp.data.records
        total.value = resp.data.total
    }
}
const handleSizeChange = () => {}
const addSpu = () => {
    scene.value = 1
    spuFormRef.value.initAddSpu(categoryStore.c3Id)
}
const changeScene = (obj: any) => {
    scene.value = obj.flag
    if (obj.params == 'update') {
        getSpuData(pageNo.value)
    } else {
        getSpuData()
    }
}
const updateSpu = (row: SpuData) => {
    scene.value = 1
    spuFormRef.value.initSpuData(row)
}
const addSku = (row: SpuData) => {
    scene.value = 2
    skuFormRef.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
const findSku = async (row: SpuData) => {
    let result: SkuInfoData = await reqSkuList(row.id as number)
    if (result.code == 200) {
        skuArr.value = result.data
        show.value = true
    }
}
const deleteSpu = async (row: SpuData) => {
    let result: any = await reqRemoveSpu(row.id as number)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        //获取剩余SPU数据
        getSpuData(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败',
        })
    }
}

//路由组件销毁前，情况仓库关于分类的数据
onBeforeUnmount(() => {
    categoryStore.$reset()
})
</script>

<style scoped></style>
