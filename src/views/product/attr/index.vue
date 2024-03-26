<template>
    <div>
        <Category :scene="scene"></Category>
        <el-card>
            <div v-show="scene == 0">
                <el-button
                    type="primary"
                    size="default"
                    icon="Plus"
                    @click="addAttr"
                    :disabled="categoryStore.c3Id ? false : true"
                >
                    添加属性
                </el-button>
                <el-table border style="margin: 10px 0" :data="attrArr">
                    <el-table-column label="序号" type="index" align="center" width="80px" />
                    <el-table-column label="属性名称" width="120px" prop="attrName" />
                    <el-table-column label="属性值名称">
                        <template #default="{ row }">
                            <el-tag style="margin: 5px" v-for="item in row.attrValueList" :key="item.id" closable>
                                {{ item.valueName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120px">
                        <template #default="{ row }">
                            <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
                            <el-popconfirm
                                :title="`你确定删除${row.attrName}吗？`"
                                width="200px"
                                @confirm="deleteAttr(row.id)"
                            >
                                <template #reference>
                                    <el-button type="primary" size="small" icon="Delete"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="scene == 1">
                <el-form :inline="true">
                    <el-form-item label="属性名称">
                        <el-input placeholder="请输入属性名称" v-model="attrParams.attrName" />
                    </el-form-item>
                </el-form>
                <el-button
                    type="primary"
                    size="default"
                    icon="Plus"
                    :disabled="attrParams.attrName ? false : true"
                    @click="addAttrValue"
                >
                    添加属性值
                </el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
                <el-table border style="margin: 10px 0" :data="attrParams.attrValueList">
                    <el-table-column label="序号" width="80" type="index" align="center" />
                    <el-table-column label="属性值名称">
                        <template #default="{ row, $index }">
                            <el-input
                                :ref="(vc: any) => (inputArr[$index] = vc)"
                                v-if="row.isEditing"
                                @blur="toDisplay(row, $index)"
                                placeholder="请输入属性值名称"
                                v-model="row.valueName"
                            />
                            <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="属性值操作">
                        <template #default="{ $index }">
                            <el-button
                                type="primary"
                                size="small"
                                icon="Delete"
                                @click="attrParams.attrValueList.splice($index, 1)"
                            ></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button
                    type="primary"
                    size="default"
                    @click="save"
                    :disabled="attrParams.attrValueList.length > 0 ? false : true"
                >
                    保存
                </el-button>
                <el-button type="primary" size="default">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reqAddOrUpdateAttr, reqAttr, reqDeleteAttr } from '@/api/product/attr'
import { ProductAttr, AttrList, AttrResponseData, AttrValue } from '@/api/product/attr/type'
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'
import { nextTick, onBeforeMount, reactive, ref, watch } from 'vue'
// import cloneDeep from 'lodash/cloneDeep'

let categoryStore = useCategoryStore()
let attrArr = ref<AttrList>([])
let scene = ref(0)
let attrParams = reactive<ProductAttr>({
    attrName: '',
    categoryId: '',
    categoryLevel: 3,
    attrValueList: [],
})
let inputArr = ref<any>([])

onBeforeMount(() => {
    categoryStore.$reset()
})
watch(
    () => categoryStore.c3Id,
    () => {
        attrArr.value = []
        if (!categoryStore.c3Id) return
        getAttr()
    },
)
const getAttr = async () => {
    const { c1Id, c2Id, c3Id } = categoryStore
    let resp: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
    attrArr.value = resp.data
}
const addAttr = () => {
    Object.assign(attrParams, {
        attrName: '',
        categoryId: categoryStore.c3Id,
        categoryLevel: 3,
        attrValueList: [],
    })
    scene.value = 1
}
const updateAttr = (row: ProductAttr) => {
    scene.value = 1
    attrParams.attrName = row.attrName
    attrParams.categoryId = row.categoryId
    attrParams.categoryLevel = row.categoryLevel
    attrParams.attrValueList = [...row.attrValueList]
}
const cancel = () => {
    scene.value = 0
}
const addAttrValue = () => {
    attrParams.attrValueList.push({ valueName: '', isEditing: true })
    nextTick(() => {
        inputArr.value[attrParams.attrValueList.length - 1].focus()
    })
}
const save = async () => {
    let resp = await reqAddOrUpdateAttr(attrParams)
    if (resp.code === 200) {
        scene.value = 0
        ElMessage({
            type: 'success',
            message: attrParams.id ? '修改成功' : '添加成功',
        })
        // 重新获取属性列表
        getAttr()
    } else {
        ElMessage({
            type: 'error',
            message: attrParams.id ? '修改失败' : '添加失败',
        })
    }
}
const toDisplay = (row: AttrValue, $index: number) => {
    if (row.valueName.trim() === '') {
        attrParams.attrValueList.splice($index, 1)
        ElMessage({
            type: 'error',
            message: '属性值不能为空',
        })
        return
    }
    let isRepeat = attrParams.attrValueList.find((item) => {
        if (item != row) {
            return item.valueName === row.valueName
        }
    })
    if (isRepeat) {
        ElMessage({
            type: 'error',
            message: '属性值不能重复',
        })
        return
    }
    row.isEditing = false
}
const toEdit = (row: AttrValue, $index: number) => {
    row.isEditing = true
    nextTick(() => {
        inputArr.value[$index].focus()
    })
}
const deleteAttr = async (attrId: number) => {
    let resp = await reqDeleteAttr(attrId)
    if (resp.code === 200) {
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        getAttr()
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败',
        })
    }
}
</script>

<style scoped></style>
