<template>
    <el-card class="box-card">
        <el-button type="primary" size="default" icon="Plus" @click="addTradeMark">添加品牌</el-button>
        <el-table style="margin: 10px 0" border :data="trademarkArr">
            <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
            <el-table-column label="品牌名称">
                <template #default="{ row }">
                    <pre>{{ row.tmName }}</pre>
                </template>
            </el-table-column>
            <el-table-column label="品牌LOGO">
                <template #default="{ row }">
                    <el-image style="width: 100px; height: 100px" :src="row.logoUrl" fit="cover" />
                </template>
            </el-table-column>
            <el-table-column label="品牌操作">
                <template #default="{ row }">
                    <el-button type="primary" icon="Edit" @click="updateTradeMark(row)"></el-button>
                    <el-popconfirm
                        :title="`确定删除${row.tmName}吗？`"
                        icon="Delete"
                        width="250px"
                        @confirm="removeTradeMark(row.id)"
                    >
                        <template #reference>
                            <el-button type="primary" icon="Delete"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @current-change="getHasTrademark"
            @size-change="sizeChange"
            v-model:current-page="pageNo"
            v-model:page-size="limit"
            :page-sizes="[3, 5, 10, 20]"
            layout="prev, pager, next, jumper, ->, sizes, total"
            :total="total"
        />
    </el-card>
    <el-dialog :title="trademarkForm.id ? '修改品牌' : '添加品牌'" v-model="dialogFormVisible">
        <el-form style="width: 80%" :model="trademarkForm" :rules="rules" ref="formRef">
            <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                <el-input placeholder="请您输入品牌名称" v-model="trademarkForm.tmName"></el-input>
            </el-form-item>
            <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                <el-upload
                    class="avatar-uploader"
                    action="/api/admin/product/fileUpload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                    <img v-if="trademarkForm.logoUrl" :src="trademarkForm.logoUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <span>
                <el-button type="primary" @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqAddOrUpdateTrademark, reqDeleteTrademark, reqHasTrademark } from '@/api/product/trademark'
import type { Records, TradeMark } from '@/api/product/trademark/type'
import { TradeMarkResponseData } from '@/api/product/trademark/type'
import { ElMessage, FormRules, type UploadProps } from 'element-plus'

const pageNo = ref(1)
const limit = ref(5)
const total = ref(0)
const trademarkArr = ref<Records>([])
const dialogFormVisible = ref<boolean>(false)
const trademarkForm = reactive<TradeMark>({
    id: 0,
    tmName: '',
    logoUrl: '',
})
let formRef = ref()

const getHasTrademark = async (pager = 1) => {
    pageNo.value = pager
    const res: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
    if (res.code === 200) {
        total.value = res.data.total
        trademarkArr.value = res.data.records
    }
}
onMounted(() => {
    getHasTrademark()
})

const sizeChange = () => {
    pageNo.value = 1
    getHasTrademark()
}

const clearFormValidation = () => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
}

const addTradeMark = () => {
    Object.assign(trademarkForm, {
        id: 0,
        tmName: '',
        logoUrl: '',
    })
    dialogFormVisible.value = true
    nextTick(() => {
        clearFormValidation()
    })
}

const updateTradeMark = (row: TradeMark) => {
    dialogFormVisible.value = true
    Object.assign(trademarkForm, row)
    nextTick(() => {
        clearFormValidation()
    })
}

const removeTradeMark = async (id: number) => {
    try {
        const res = await reqDeleteTrademark(id)
        if (res.code === 200) {
            ElMessage({ message: '删除成功', type: 'success' })
            getHasTrademark(trademarkArr.value.length === 1 ? pageNo.value - 1 : pageNo.value)
        } else {
            ElMessage({ message: '删除失败', type: 'error' })
        }
    } catch (error) {
        ElMessage({ message: '删除失败', type: 'error' })
    }
}

const cancel = () => {
    dialogFormVisible.value = false
}

const confirm = async () => {
    console.log(formRef.value.validate)
    await formRef.value.validate()
    try {
        const result = await reqAddOrUpdateTrademark(trademarkForm)
        if (result.code === 200) {
            dialogFormVisible.value = false
            ElMessage({ message: '添加成功', type: 'success' })
            getHasTrademark()
        } else {
            ElMessage({ message: '添加失败', type: 'error' })
        }
    } catch (error) {
        ElMessage({ message: '添加失败', type: 'error' })
    }
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
    trademarkForm.logoUrl = response.data
    formRef.value.clearValidate('logoUrl')
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif']
    const maxSize = 4 * 1024 * 1024 // 4MB

    if (!allowedTypes.includes(rawFile.type)) {
        ElMessage({ message: '上传图片只能是 JPG/PNG/GIF 格式!', type: 'error' })
        return false
    }

    if (rawFile.size > maxSize) {
        ElMessage({ message: '上传图片大小不能超过4M', type: 'error' })
        return false
    }

    return true
}

const validatorTmName = (_: any, value: any, callback: any) => {
    if (value.length < 2 || value.length > 10) {
        callback(new Error('品牌名称长度在 2 到 10 个字符'))
    } else {
        callback()
    }
}

const validatorLogoUrl = (_: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error('请上传品牌LOGO'))
    } else {
        callback()
    }
}

const rules = reactive<FormRules>({
    tmName: [{ required: true, message: '请输入品牌名称', trigger: 'blur', validator: validatorTmName }],
    logoUrl: [{ required: true, message: '请上传品牌LOGO', validator: validatorLogoUrl }],
})
</script>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
