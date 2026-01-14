<template>
  <div class="app-container">
    <div class="aboustform">
      <div class="form-data-header" style="margin-bottom: 0; padding: 0">
        <div class="form-data-header-title" @click="goBack">
          <i class="el-icon-back"></i>
          返回
          <span></span>
        </div>
        <div class="form-data-header-content"></div>
        <div class="form-data-header-tools">
          <!-- 搜索条件 -->
          <el-button @click="saveForm" size="mini" type="primary" :disabled="BCZT">
            保存
          </el-button>
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleCreate" v-if="isregiet"
            v-hasPermi="['instrument:instruments:add']">新增</el-button>
        </div>
      </div>
    </div>
    <div style="padding-top: 40px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="工厂" prop="deptName">
              <el-input v-model="form.deptName" style="width: 100%" placeholder="请选择工厂" class="input-with-select"
                readonly>
                <template #append>
                  <el-button slot="append" icon="el-icon-search" @click="getDept()"></el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备名称" prop="instrumentName">
              <el-input v-model="form.instrumentName" style="width: 100%" placeholder="请输入设备名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备编号" prop="instrumentCode">
              <el-input v-model="form.instrumentCode" style="width: 100%" placeholder="请输入设备编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备型号" prop="mdoelNumber">
              <el-input v-model="form.mdoelNumber" style="width: 100%" placeholder="请输入设备型号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备类型" prop="type">
              <el-input v-model="form.type" style="width: 100%" placeholder="设备类型"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责人" prop="responsiblePerson">
              <el-input v-model="form.responsiblePerson" style="width: 100%" placeholder="负责人"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="制单人" prop="createBy">
              <el-input v-model="form.createByName" placeholder="请输入制单人" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="制单时间" prop="createTime">
              <el-input v-model="form.createTime" placeholder="请输入制单时间" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="cremark">
              <el-input type="textarea" v-model="form.cremark" placeholder="备注" :rows="3" maxlength="500"
                show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件图片">
              <el-upload ref="upload" accept=".jpg, .png" :action="upload.url" :headers="upload.headers"
                :before-upload="beforeAvatarUpload" :data="upload.data" :file-list="upload.fileList"
                list-type="picture-card" :on-success="handleFileUploadSuccess" :on-preview="handleFilePreview"
                :before-remove="handleImgRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogFileOpen">
                <img width="100%" :src="dialogFileImageUrl" alt />
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body>
      <el-form :model="queryParams2" ref="queryForm2" size="small" :inline="true">
        <el-form-item label="工厂名称" prop="deptName">
          <el-input v-model="queryParams2.deptName" placeholder="请输入工厂名称" clearable style="width: 240px"
            @keyup.enter.native="handleQuery2" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery2">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery2">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-table :data="deptList" ref="table" style="width: 100%" height="60vh" @row-click="deptclick">
          <el-table-column label="工厂名称" align="center" prop="deptName" :show-overflow-tooltip="true" />
        </el-table>
        <!-- <pagination v-show="depttotal > 0" :total="depttotal" :page.sync="queryParams2.pageNum"
          :limit.sync="queryParams2.pageSize" @pagination="getDept" /> -->
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import { getpagelist, getdetail, updateobj, addobj } from '@/api/instrument/device';
import { getToken } from '@/utils/auth';
import { getLoginUserDept, listDept } from "@/api/system/dept";
export default {
  name: 'devicecreate',
  dicts: ['characters'],
  data() {
    return {
      deptList: [],
      isregiet: false,
      activeName: '关联单据',
      // 表单参数
      form: {
        deptName: '',
        deptId: '',
        instrumentName: '',
        instrumentCode: '',
        mdoelNumber: '',
        type: '',
        responsiblePerson: '',

      },
      // 表单校验
      rules: {
        deptName: [{ required: true, message: '请选择工厂名称' }],
        instrumentName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
        ],
        instrumentCode: [
          { required: true, message: '请输入设备编号', trigger: 'blur' },
        ],
        mdoelNumber: [
          { required: true, message: '请输入设备型号', trigger: 'blur' },
        ],
      },

      BCZT: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10000,
        bsysdel: '0',
      },

      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 总条数
      total: 0,
      upload: {
        headers: { Authorization: 'Bearer ' + getToken() },
        url: process.env.VUE_APP_BASE_API + '/agri/common/upload',
        fileList: [],
        data: {
          module: '设备管理',
          table: 'material',
          remark: '',
          points: '',
          from: 'PC',
          userName: '',
        },
      },
      dialogFileOpen: false,
      dialogFileImageUrl: undefined,
      // 工厂查询参数
      queryParams2: {
        pageNum: 1,
        pageSize: 20,
        deptName: ""
      },

      depttotal: 0,
    }
  },
  created() {
    const query = this.$route.query;
    this.form.bsLabtestMethodsId = query.id;
    if (query.id) {
      // 初始化数据
      this.getinfo();
    }
  },
  methods: {


    // 获取详情
    getinfo() {
      let id = this.$route.query.id
      if (id != undefined) {
        getdetail(id).then((response) => {
          console.log(response, '详情')
          this.form = response.data

        })
      }
    },

    /** 查询工厂列表 */
    getDept() {
      this.loading = true;
      // 设置不分页参数
      const params = {
        pageNum: 1,
        pageSize: 999, // 设置足够大的pageSize获取所有数据
        deptName: this.queryParams2.deptName || ""
      };
      listDept(params).then((response) => {
        this.deptList = response.data || [];
        this.depttotal = response.total || 0;
        this.loading = false;
        this.open = true;
        this.title = "选择工厂";
      })
    },


    deptclick(val) {
      this.form.deptId = val.deptId
      this.form.deptName = val.deptName
      this.open = false;
    },
    /** 搜索按钮操作 */
    handleQuery2() {
      this.getDept();
    },
    /** 重置按钮操作 */
    resetQuery2() {
      this.resetForm("queryForm");
      this.queryParams2.deptName = ""; // 只重置搜索条件
      this.getDept();
    },
    goBack() {
      const obj = { path: '/instrument/device' }
      this.$tab.closeOpenPage(obj)
    },

    /** 提交按钮 */
    submitForm() {
      console.log(this.form);
      this.$refs["form"].validate(valid => {
        if (valid) {

        } else {
          this.$modal.msgError("请检查必填项是否填写");
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    /** 提交按钮 */
    saveForm: function () {
      this.BCZT = true

      setTimeout(() => {
        this.BCZT = false
      }, 2000)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateobj(this.form).then((response) => {
              if (response.code == 200) {
                this.$modal.msgSuccess('修改成功')
                // this.$router.go(-1)
                this.getinfo()
              }
            })
          } else {
            addobj(this.form).then((response) => {
              if (response.code == 200) {
                this.form.id = response.msg
                const id = response.msg
                this.$modal.msgSuccess('新增成功')
                this.$tab.closePage()
                this.$router.push('/instrument/device')
                this.$router.push({
                  path: '/instrument/devicecreate',
                  query: { id },
                })
                this.getinfo()
              }
            })
          }
        } else {
          this.$modal.msgError('请检查必填项是否填写')
        }
      })
    },

    /** 新增按钮操作 */
    handleCreate() {
      //直接跳转
      const { path } = this.$route
      this.$router.replace({
        path: '/redirect' + path,
      })
    },
    // 图片上传
    beforeAvatarUpload(file) {
      let _this = this
      return new Promise((resolve, reject) => {
        let isLt2M = file.size / 1024 / 1024 < 2 // 判定图片大小是否小于10MB
        if (isLt2M) {
          resolve(file)
        } else {
          let image = new Image(),
            resultBlob = ''
          image.src = URL.createObjectURL(file)
          console.log(file)
          image.onload = () => {
            // 调用方法获取blob格式，方法写在下边
            resultBlob = compressUpload(image, file)
            console.log(resultBlob)
            resolve(resultBlob)
          }
          image.onerror = () => {
            reject()
          }
        }
      })
    },
    // 文件成功操作
    handleFileUploadSuccess(response, file, fileList) {
      if (response.code == '200') {
        let obj = {
          uid: file.uid,
          url: this.apiurlsevers() + response.fileName,
          filePath: response.fileName,
          fileName: response.fileName,
          name: response.originalFilename,
        }
        this.upload.fileList.push(obj)
      } else {
        this.$modal.msgError('上传失败')
        this.upload.fileList.pop()
      }
    },
    // 文件预览操作
    handleFilePreview(file) {
      this.dialogFileImageUrl = file.url
      this.dialogFileOpen = true
    },
    // 文件删除操作
    handleImgRemove(file, fileList) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let index = this.upload.fileList.findIndex((fileItem) => {
            return fileItem.uid === file.uid
          })
          console.log(index)
          return this.upload.fileList.splice(index, 1)
        })
        .catch(() => {
          // 点击取消，什么也不做！
        })
      return false // 这一句相当重要！！
    },
  },
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 15px;
}
</style>