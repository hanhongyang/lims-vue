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
          <el-button @click="saveForm" size="mini" type="primary" :disabled="BCZT" v-if="!ifxq">
            <svg-icon icon-class="extend-form-btn-save" />保存
          </el-button>
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleCreate" v-if="isregiet"
            v-hasPermi="['']">新增</el-button>
        </div>
      </div>
    </div>
    <div style="padding-top: 40px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="报障单号" prop="q">
              <el-input v-model="form.a" style="width: 100%" placeholder="自动生成"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公司" prop="q">
              <el-input v-model="form.a" style="width: 100%" placeholder="请输入公司"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备名称" prop="w">
              <el-input v-model="form.b" style="width: 100%" placeholder="请输入设备名称">
                <template #append>
                  <el-button slot="append" icon="el-icon-search" @click="XZGYS"></el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备编号" prop="e">
              <el-input v-model="form.c" style="width: 100%" placeholder="请输入设备编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备型号" prop="gys">
              <el-input v-model="form.d" style="width: 100%" placeholder="请输入供应商"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="故障名称" prop="i">
              <el-input v-model="form.e" style="width: 100%" placeholder="故障名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报障日期" prop="u">
              <el-date-picker v-model="form.bzrq" style="width: 100%" type="date" placeholder="选择日期"></el-date-picker>
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
            <el-form-item label="故障描述" prop="cremark">
              <el-input type="textarea" v-model="form.cremark" placeholder="故障描述" :rows="3" maxlength="500"
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
    <!-- <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="关联单据" name="关联单据">
        <el-table style="width: 100%" :data="JCGSList">
          <el-table-column label="单据名称" align="center" prop="a" :show-overflow-tooltip="true" min-width="120" />
          <el-table-column label="单据编号" align="center" prop="a" :show-overflow-tooltip="true" min-width="120" />
        </el-table>
      </el-tab-pane>
    </el-tabs> -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="formopen" :rules="formrules" label-width="140px">
        <el-form-item label="检测项目" prop="cgroupcontractid">
          <el-select v-model="formopen.cgroupcontractid" filterable placeholder="请选择公司" :disabled="isregiet" clearable
            style="width: 100%" @change="contractclick">
            <el-option v-for="dict in contratctlist" :key="dict.id" :label="dict.cgroupcontractname" :value="dict.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="检测方法" prop="cclasstypename">
          <el-input v-model="formopen.cclasstypename" placeholder="检测方法" readonly />
        </el-form-item>
        <el-form-item label="检验阶段" prop="cgroupcontractid">
          <el-select v-model="formopen.cgroupcontractid" filterable placeholder="请选择检验阶段" :disabled="isregiet" clearable
            style="width: 100%" @change="contractclick">
            <el-option v-for="dict in contratctlist" :key="dict.id" :label="dict.cgroupcontractname" :value="dict.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="检验频率" prop="cgroupcontractid">
          <el-select v-model="formopen.cgroupcontractid" filterable placeholder="请选择检验频率" :disabled="isregiet" clearable
            style="width: 100%" @change="contractclick">
            <el-option v-for="dict in contratctlist" :key="dict.id" :label="dict.cgroupcontractname" :value="dict.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择设备" :visible.sync="openwl" width="1200px" append-to-body>
      <el-form :model="queryParams2" ref="queryForm2" size="small" :inline="true">
        <!-- <el-form-item label="检测方法" prop="supplierName">
          <el-input v-model="queryParams2.supplierName" placeholder="请输入检测方法" clearable style="width: 180px"
            @keyup.enter.native="handleQuery2" />
        </el-form-item> -->
        <el-form-item label="设备名称" prop="leader">
          <el-input v-model="queryParams2.leader" placeholder="请输入设备名称" clearable style="width: 240px"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery2">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery2">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-table :data="supplierlist" ref="table" style="width: 100%" max-height="420" @row-click="supplierclick">
          <el-table-column label="设备编号" align="center" prop="supplierName" />
          <el-table-column label="设备名称" align="center" prop="supplierCode" />
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams2.pageNum"
          :limit.sync="queryParams2.pageSize" @pagination="getSupplier" />
      </el-row>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
  // import {
  //   ClasInfo,
  //   createClasInfo,
  //   updateClasInfo,
  //   delClasInfo,
  //   userGetInfo,
  // } from '@/api/agri/siagle/ClasInfo.js'
  // import { ClassTypeList } from '@/api/agri/siagle/ClassType'
  // import { getSupplierList } from '@/api/agri/basic/supplier'
  // import { groupcontractList } from '@/api/agri/siagle/groupcontract'
  import { getToken } from '@/utils/auth'
  export default {
    name: 'faultcreate',
    dicts: ['characters'],
    data() {
      return {
        deptList: [],
        isregiet: false,
        activeName: '关联单据',
        // 表单参数
        form: {
          cstate: '1',
          a: "滑县饲料",
          b: "电子天平",
          c: "YL2025040001",
          d: "DZTP321",
          e: "王",
          f: "电子仪器",
        },
        formopen: {},
        // 表单校验
        rules: {
          ccustomercode: [{ required: true, message: '请选择供应商名称' }],
          cgroupcontractid: [
            { required: true, message: '请选择收贮项目', trigger: 'blur' },
          ],
          csgcarno: [
            { required: true, message: '请输入车牌号', trigger: 'blur' },
          ],
        },
        formrules: {
          ccustomercode: [{ required: true, message: '请选择供应商名称' }],
          cgroupcontractid: [
            { required: true, message: '请选择收贮项目', trigger: 'blur' },
          ],
          csgcarno: [
            { required: true, message: '请输入车牌号', trigger: 'blur' },
          ],
        },
        BCZT: false,
        ifxq: false,
        carList: [],
        contratctlist: [],
        supplierlist: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10000,
          bsysdel: '0',
        },
        queryParams2: {
          pageNum: 1,
          pageSize: 10,
          supplierName: '',
          enableFlag: '0',
          cisqz: '是',
          leader: '',
          supplierPhone: '',
        },
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 总条数
        total: 0,
        JCGSList: [
          {
            a: '钙'
          }
        ],
        JCSXList: [],
        openwl: false,
        upload: {
          headers: { Authorization: 'Bearer ' + getToken() },
          url: process.env.VUE_APP_BASE_API + '/agri/common/upload',
          fileList: [],
          data: {
            module: '入库',
            table: 'material',
            remark: '',
            points: '',
            from: 'PC',
            userName: '',
          },
        },
        dialogFileOpen: false,
        dialogFileImageUrl: undefined,
      }
    },
    created() {
      // this.getuserGetInfo()
      // this.getcarList()
      // this.getSupplier()
      setTimeout(() => {
        // this.getinfo()
      }, 2000)
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
      },
      // 查询用户信息
      getuserGetInfo() {
        userGetInfo().then((response) => {
          console.log(response, '用户信息')
          var jsondate = response.pastureconfirm
          this.form.cztname = jsondate.cztname
          this.form.cztcode = jsondate.cztcode
          this.form.deptId = jsondate.deptId
        })
      },
      // 获取农资仓库详情
      getinfo() {
        let id = this.$route.query.id
        if (id != undefined) {
          ClasInfo(id).then((response) => {
            console.log(response, '详情')
            this.isregiet = true
            this.form = response.data
            this.form.cclasstypecode = this.form.iclass
            const ifxq = this.$route.query.ifxq
            if (ifxq != undefined) {
              this.ifxq = true
            } else {
              this.ifxq = false
            }
          })
        }
      },
      /** 查询车辆列表 */
      getcarList() {
        this.loading = true
        ClassTypeList(this.queryParams).then((response) => {
          console.log(response, '车辆类型')
          this.carList = response.rows
          this.loading = false
        })
      },

      /** 查询供应商列表 */
      getSupplier() {
        this.supplierlist = []
        getSupplierList(this.queryParams2).then((response) => {
          console.log(response, '供应商')
          this.supplierlist = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      /** 搜索按钮操作 */
      handleQuery2() {
        this.queryParams2.pageNum = 1
        this.getSupplier()
      },
      /** 重置按钮操作 */
      resetQuery2() {
        this.resetForm('queryForm')
        this.queryParams2 = {
          pageNum: 1,
          pageSize: 10,
          supplierName: '',
          enableFlag: '0',
          cisqz: '是',
          leader: '',
          supplierPhone: '',
        }
        this.getSupplier()
      },
      XZGYS() {
        this.openwl = true
      },
      supplierclick(val) {
        console.log(val)
        this.form.ccustomercode = val.supplierCode
        this.form.ccustomername = val.supplierName
        this.openwl = false
      },
      contractclick(val) {
        console.log(val)
        this.form.cgroupcontractid = val
        var array = this.contratctlist
        for (let index = 0; index < array.length; index++) {
          const element = array[index]
          if (element.id == val) {
            this.form.cgroupcontractname = element.cgroupcontractname
          }
        }
      },
      iclassclick(val) {
        console.log(val)
      },
      goBack() {
        const obj = { path: '/instrument/fault' }
        this.$tab.closeOpenPage(obj)
      },
      openSelectuser() {
        this.open = true;
        this.title = '添加'
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
        for (let i = 0; i < this.carList.length; i++) {
          const element = this.carList[i]
          if (this.form.cclasstypecode == element.cclasstypecode) {
            this.form.iclassname = element.cclasstypename
            this.form.iclass = element.cclasstypecode
          }
        }
        setTimeout(() => {
          this.BCZT = false
        }, 2000)
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.id != undefined) {
              updateClasInfo(this.form).then((response) => {
                if (response.code == 200) {
                  this.$modal.msgSuccess('修改成功')
                  this.getinfo()
                }
              })
            } else {
              createClasInfo(this.form).then((response) => {
                if (response.code == 200) {
                  this.form.id = response.msg
                  const id = response.msg
                  this.$modal.msgSuccess('新增成功')
                  this.$router.push({
                    path: '/instrument/faultcreate',
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
      // 删除
      handleDelete() {
        const id = this.form.id
        this.$modal
          .confirm('是否确认删除该收割车辆信息')
          .then(function () {
            return delClasInfo(id)
          })
          .then(() => {
            this.goBack()
          })
          .catch(() => { })
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