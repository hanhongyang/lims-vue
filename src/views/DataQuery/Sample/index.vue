<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="饲料" name="1">
        <el-form v-show="showSearch" ref="queryForm1" :model="queryParams1" size="small" :inline="true"
          label-width="70px">
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input v-model="queryParams1.entrustOrderNo" placeholder="请输入委托单号" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="收样时间">
            <el-date-picker v-model="receiveTimeRange1" clearable type="daterange" value-format="yyyy-MM-dd"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px" />
          </el-form-item>
          <el-form-item label="委托单位" prop="deptName">
            <el-input v-model="queryParams1.deptName" placeholder="请输入委托单位" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="化验进度" prop="progress">
            <el-select v-model="queryParams1.progress" placeholder="请选择" clearable>
              <el-option v-for="dict in dict.type.test_progress" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-hasPermi="['labtest:sampleTestProgress:export']" type="warning" plain icon="el-icon-download"
              size="mini" @click="handleExport">导出</el-button>
          </el-col>
          <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
        </el-row>

        <el-table v-loading="loading" :data="baseList1" height="63vh">
          <el-table-column label="样品编号" align="center" prop="sampleNo" />
          <el-table-column label="样品名称" align="center" prop="sampleName" />
          <el-table-column label="已化验项目" align="center" prop="startedItems" />
          <el-table-column label="未化验项目" align="center" prop="notStartedItems" />
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托公司" align="center" prop="deptName" />
          <el-table-column label="收样时间" align="center" prop="receiveTime" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-view"
                @click="handleViewResult(scope.row)">查看化验结果</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total1 > 0 && activeTab === '1'" :total="total1" :page.sync="queryParams1.pageNum"
          :limit.sync="queryParams1.pageSize" @pagination="getList" />
      </el-tab-pane>

      <el-tab-pane label="血样" name="2">
        <el-form v-show="showSearch" ref="queryForm2" :model="queryParams2" size="small" :inline="true"
          label-width="70px">
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input v-model="queryParams2.entrustOrderNo" placeholder="请输入委托单号" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="收样时间">
            <el-date-picker v-model="receiveTimeRange2" clearable type="daterange" value-format="yyyy-MM-dd"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px" />
          </el-form-item>
          <el-form-item label="委托单位" prop="deptName">
            <el-input v-model="queryParams2.deptName" placeholder="请输入委托单位" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="化验进度" prop="progress">
            <el-select v-model="queryParams2.progress" placeholder="请选择" clearable>
              <el-option v-for="dict in dict.type.test_progress" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-hasPermi="['labtest:sampleTestProgress:export']" type="warning" plain icon="el-icon-download"
              size="mini" @click="handleExport">导出</el-button>
          </el-col>
          <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
        </el-row>

        <el-table v-loading="loading" :data="baseList2" height="63vh">
          <el-table-column label="样品编号" align="center" prop="sampleNo" />
          <el-table-column label="样品名称" align="center" prop="sampleName" />
          <el-table-column label="化验进度" align="center" prop="progress">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.test_progress" :value="scope.row.progress" />
            </template>
          </el-table-column>
          <el-table-column label="检测项目" align="center" prop="bloodTaskItemType">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.blood_task_item_type" :value="scope.row.bloodTaskItemType" />
            </template>
          </el-table-column>
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托公司" align="center" prop="deptName" />
          <el-table-column label="收样时间" align="center" prop="receiveTime" />
        </el-table>

        <pagination v-show="total2 > 0 && activeTab === '2'" :total="total2" :page.sync="queryParams2.pageNum"
          :limit.sync="queryParams2.pageSize" @pagination="getList" />
      </el-tab-pane>

      <el-tab-pane label="PCR" name="3">
        <el-form v-show="showSearch" ref="queryForm3" :model="queryParams3" size="small" :inline="true"
          label-width="70px">
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input v-model="queryParams3.entrustOrderNo" placeholder="请输入委托单号" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="收样时间">
            <el-date-picker v-model="receiveTimeRange3" clearable type="daterange" value-format="yyyy-MM-dd"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px" />
          </el-form-item>
          <el-form-item label="委托单位" prop="deptName">
            <el-input v-model="queryParams3.deptName" placeholder="请输入委托单位" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="化验进度" prop="progress">
            <el-select v-model="queryParams3.progress" placeholder="请选择" clearable>
              <el-option v-for="dict in dict.type.test_progress" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-hasPermi="['labtest:sampleTestProgress:export']" type="warning" plain icon="el-icon-download"
              size="mini" @click="handleExport">导出</el-button>
          </el-col>
          <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
        </el-row>

        <el-table v-loading="loading" :data="baseList3" height="63vh">
          <el-table-column label="样品编号" align="center" prop="sampleNo" />
          <el-table-column label="样品名称" align="center" prop="sampleName" />
          <el-table-column label="已化验项目" align="center" prop="startedItems" />
          <el-table-column label="未化验项目" align="center" prop="notStartedItems" />
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托公司" align="center" prop="deptName" />
          <el-table-column label="收样时间" align="center" prop="receiveTime" />
        </el-table>

        <pagination v-show="total3 > 0 && activeTab === '3'" :total="total3" :page.sync="queryParams3.pageNum"
          :limit.sync="queryParams3.pageSize" @pagination="getList" />
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="化验项目列表" :visible.sync="resultOpen" width="600px" append-to-body>
      <el-table v-loading="resultLoading" :data="resultList">
        <el-table-column label="检测项目" align="center" prop="itemName">
          <template slot-scope="scope">
            <el-button type="text" @click="handleItemDetail(scope.row)">
              {{ scope.row.itemName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="化验员" align="center" prop="testUser" />
        <el-table-column label="检测时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前结果(平均值)" align="center" prop="average" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resultOpen = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="化验项目列表" :visible.sync="resultOpen" width="800px" append-to-body>
      <el-table v-loading="resultLoading" :data="resultList">
        <el-table-column label="检测项目" align="center" prop="itemName">
          <template slot-scope="scope">
            <el-button type="text" @click="handleItemDetail(scope.row)" style="font-weight: bold;">
              {{ scope.row.itemName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="化验员" align="center" prop="testUser" />
        <el-table-column label="检测结果(平均值)" align="center" prop="average" />
        <el-table-column label="检测时间" align="center" prop="createTime" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resultOpen = false">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="currentItemType + '检测项目信息'" :visible.sync="editDialogVisible" width="80vw" append-to-body>
      <div class="detail-table-container">
        <table class="detail-table" v-if="currentItemType == '水分'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>称量皿号</th>
              <th>试样质量m₂ (g)</th>
              <th>称量皿的质量m₁ (g)</th>
              <th>第一次干燥后称量皿+试样的质量 m₃ (g)</th>
              <th>第二次干燥后称量皿+试样的质量 m₄ (g)</th>
              <th>试样水分含量 X (%)</th>
              <th>初水分含量 M₁ (%)</th>
              <th>水分含量 Xᵢ (%)</th>
              <th>平均值 (%)</th>
              <th>绝对差值/相对偏差 (%)</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ Details.resultNo }}</td>
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.clmh }}</td>
                <td>{{ item.m2 }}</td>
                <td>{{ item.m1 }}</td>
                <td>{{ item.m3 }}</td>
                <td>{{ item.m4 }}</td>
                <td>{{ item.x }}</td>
                <td>{{ item.upperM1 }}</td>
                <td>{{ item.x1 }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
              </tr>
              <tr :key="`row2-${index}`">
                <td>{{ item.compareClmh }}</td>
                <td>{{ item.compareM2 }}</td>
                <td>{{ item.compareM1 }}</td>
                <td>{{ item.compareM3 }}</td>
                <td>{{ item.compareM4 }}</td>
                <td>{{ item.compareX }}</td>
                <td>{{ item.compareUpperM1 }}</td>
                <td>{{ item.compareX1 }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '粗蛋白'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>消化管号</th>
              <th>试样质量m(g)</th>
              <th>盐酸标准溶液消耗体积 V<sub>2</sub>(mL)</th>
              <th>CP 含量(%)</th>
              <th>平均值(%)</th>
              <th>相对偏差(%)</th>
              <th>鲜样中CP含量(%)</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ Details.resultNo }}</td>
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.xhgh }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.v2 }}</td>
                <td>{{ item.cp }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr :key="`row2-${index}`">
                <td>{{ item.compareXhgh }}</td>
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareV2 }}</td>
                <td>{{ item.compareCp }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '粗灰分'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>坩埚号</th>
              <th>空坩埚质量m<sub>0</sub>(g)</th>
              <th>试样质量m(g)</th>
              <th>灰化后灰分+坩埚质量m<sub>1</sub>(g)</th>
              <th>粗灰分含量w (%)</th>
              <th>平均值(%)</th>
              <th>绝对差值(%)</th>
              <th>鲜样中灰分含量(%)</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ Details.resultNo }}</td>
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.compareGgh }}</td>
                <td>{{ item.m0 }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.m1 }}</td>
                <td>{{ item.w }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr :key="`row2-${index}`">
                <td>{{ item.clmh }}</td>
                <td>{{ item.compareM0 }}</td>
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareM1 }}</td>
                <td>{{ item.compareW }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '粗脂肪'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>滤袋号</th>
              <th>试样质量 m(g)</th>
              <th>提取前烘干后样品+滤袋+硅藻土质量m<sub>1</sub>（g）</th>
              <th>提取后烘干后样品+滤袋+硅藻土质量m<sub>2</sub>（g）</th>
              <th>试样中粗脂肪含量 EE%</th>
              <th>平均值%</th>
              <th>绝对差值/相对相差%</th>
              <th>鲜样中粗脂肪含量 EE%</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ Details.resultNo }}</td>
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.ldh }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.m1 }}</td>
                <td>{{ item.m2 }}</td>
                <td>{{ item.ee }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr>
                <td>{{ item.compareLdh }}</td>
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareM1 }}</td>
                <td>{{ item.compareM2 }}</td>
                <td>{{ item.compareEe }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '中性洗涤纤维'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>滤袋号</th>
              <th>滤袋质量 m₁（g）</th>
              <th>试样质量 m（g）</th>
              <th>袋+残渣总质量 m<sub>2</sub>（g）</th>
              <th>NDF 含量 x（%）</th>
              <th>平均值(g/kg)</th>
              <th>相对偏差(g/kg)</th>
              <th>鲜样中中 NDF 含量 (g/kg)</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ Details.resultNo }}</td>
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.ldh }}</td>

                <td>{{ item.m1 }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.m2 }}</td>
                <td>{{ item.x }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr>
                <td>{{ item.compareLdh }}</td>
                <td>{{ item.compareM1 }}</td>
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareM2 }}</td>
                <td>{{ item.compareX }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '酸性洗涤纤维'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>滤袋号</th>
              <th>滤袋质量 m₁（g）</th>
              <th>试样质量 m（g）</th>
              <th>袋+残渣总质量 m₂（g）</th>
              <th>ADF 含量 x（%）</th>
              <th>平均值(g/kg)</th>
              <th>相对相差/绝对偏差(g/kg)</th>
              <th>鲜样中中 ADF 含量 (g/kg)</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ Details.resultNo }}</td>
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.ldh }}</td>
                <td>{{ item.m1 }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.m2 }}</td>
                <td>{{ item.x }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr>
                <td>{{ item.compareLdh }}</td>
                <td>{{ item.compareM1 }}</td>
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareM2 }}</td>
                <td>{{ item.compareX }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '钙'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>样液号</th>
              <th>试样质量 m（g）</th>
              <th>消耗 EDTA 标准液的体积 V<sub>2</sub>(mL)</th>
              <th>Ca 含量 （%）</th>
              <th>平均值（%）</th>
              <th>相对相差（%）</th>
              <th>鲜样中Ca 含量 （%）</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ Details.resultNo }}</td>
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.yyh }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.v2 }}</td>
                <td>{{ item.ca }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr>
                <td>{{ item.compareYyh }}</td>
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareV2 }}</td>
                <td>{{ item.compareCa }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '磷'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>样液号</th>
              <th>试样质量 m（g）</th>
              <th>测试液吸光度A</th>
              <th>测试液磷浓度X(ug/mL)</th>
              <th>试样中P含量 （%）</th>
              <th>平均值(%)</th>
              <th>相对相差（%）</th>
              <th>鲜样中P含量 （%）</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ Details.resultNo }}</td>
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.yyh }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.syxgdaz }}</td>
                <td>{{ item.x }}</td>
                <td>{{ item.p }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr>
                <td>{{ item.compareYyh }}</td>
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareSyxgdaz }}</td>
                <td>{{ item.compareX }}</td>
                <td>{{ item.compareP }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '粗纤维'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>滤袋坩埚号</th>
              <th>滤袋质量 m₁（g）</th>
              <th>试样质量 m（g）</th>
              <th>坩埚+袋+试样残渣烘干后总质量 m<sub>2</sub>(g)</th>
              <th>坩埚+试样残渣灰化后总质量 m<sub>3</sub>(g)(g)</th>
              <th>CF含量x(%)</th>
              <th>平均值(%)</th>
              <th>相对相差/绝对偏差(%)</th>
              <th>鲜样中CF含量(%)</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ Details.resultNo }}</td>
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.ldh }}</td>
                <td>{{ item.m1 }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.m2 }}</td>
                <td>{{ item.m3 }}</td>
                <td>{{ item.x }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr :key="`row2-${index}`">
                <td>{{ item.compareLdh }}</td>
                <td>{{ item.compareM1 }}</td>
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareM2 }}</td>
                <td>{{ item.compareM3 }}</td>
                <td>{{ item.compareX }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '碳酸氢钠'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>锥形瓶号</th>
              <th>试样质量 m（g）</th>
              <th>盐酸标准溶液消耗体积 V<sub>2</sub>(mL)</th>
              <th>总碱量 （%）</th>
              <th>平均值(%)</th>
              <th>绝对差值(%)</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ Details.resultNo }}</td>
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.zxph }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.v2 }}</td>
                <td>{{ item.w }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
              </tr>
              <tr :key="`row2-${index}`">
                <td>{{ item.compareZxph }}</td>
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareV2 }}</td>
                <td>{{ item.compareW }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '三聚氰胺'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>管号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>试样质量 m（g）</th>
              <th>20%甲醇/水体积(mL)</th>
              <th>待测液体积(uL)</th>
              <th>检测结果</th>
              <th>鲜样中结果</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td>{{ Details.resultNo }}</td>
                <td>{{ item.clmh }}</td>
                <td>{{ item.sampleNo }}</td>
                <td>{{ item.sampleName }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.jcstj }}</td>
                <td>{{ item.dcytj }}</td>
                <td>
                  {{ item.jcjg === '阴性' ? '✔' : '□' }}阴性
                  {{ item.jcjg === '阳性' ? '✔' : '□' }}阳性
                  {{ item.jcjgfw }}
                </td>
                <td>{{ item.xyzhl }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '玉米赤霉烯酮'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>管号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>试样质量 m（g）</th>
              <th>试样吸光度A值（450-620mm）</th>
              <th>待测液中DON含量C（μg/ml）</th>
              <th>样品中DON含量（mg/kg）</th>
              <th>鲜样中DON含量（mg/kg）</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td>{{ Details.resultNo }}</td>
                <td>{{ item.clmh }}</td>
                <td>{{ item.sampleNo }}</td>
                <td>{{ item.sampleName }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.syxgdaz }}</td>
                <td>{{ item.c }}</td>
                <td>{{ item.ypzxxhl }}</td>
                <td>{{ item.xyzhl }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '赭曲霉毒素'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>管号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>试样质量 m（g）</th>
              <th>试样吸光度A值（450-620mm）</th>
              <th>待测液中DON含量C（μg/ml）</th>
              <th>样品中DON含量（mg/kg）</th>
              <th>鲜样中DON含量（mg/kg）</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td>{{ Details.resultNo }}</td>
                <td>{{ item.clmh }}</td>
                <td>{{ item.sampleNo }}</td>
                <td>{{ item.sampleName }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.syxgdaz }}</td>
                <td>{{ item.c }}</td>
                <td>{{ item.ypzxxhl }}</td>
                <td>{{ item.xyzhl }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '淀粉糊化度'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>空白试样溶液吸光度A<sub>0</sub></th>
              <th>待测试样溶液吸光度A<sub>1</sub></th>
              <th>全糊化试样溶液吸光度A<sub>2</sub></th>
              <th>糊化度x(%)</th>
              <th>平均值（%）</th>
              <th>相对相差（%）</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ Details.resultNo }}</td>
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.a0 }}</td>
                <td>{{ item.a1 }}</td>
                <td>{{ item.a2 }}</td>
                <td>{{ item.x }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
              </tr>
              <tr :key="`row2-${index}`">
                <td>{{ item.compareA0 }}</td>
                <td>{{ item.compareA1 }}</td>
                <td>{{ item.compareA2 }}</td>
                <td>{{ item.compareX }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '淀粉测定（双酶法）'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>样液号</th>
              <th>试样质量 m（g）</th>
              <th>样液稀释倍数n</th>
              <th>试样吸光度 A1</th>
              <th>试样D-葡萄糖含量(ug/0.1mL)</th>
              <th>淀粉含量(g/100g)</th>
              <th>平均值（%）</th>
              <th>相对相差（%）</th>
              <th>鲜样中淀粉含量（%）</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`" class="sample-split" :class="{ 'first-sample': index === 0 }">
                <td rowspan="2">{{ Details.resultNo }}</td>
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.yyh }}</td>
                <td>{{ item.m }}</td>
                <td rowspan="2">{{ item.n }}</td>
                <td>{{ item.a1 }}</td>
                <td>{{ item.g }}</td>
                <td>{{ item.dfhl }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr :key="`row2-${index}`">
                <td>{{ item.compareYyh }}</td>
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareA1 }}</td>
                <td>{{ item.compareG }}</td>
                <td>{{ item.compareDfhl }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '呕吐毒素'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>管号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>试样质量 m（g）</th>
              <th>试样吸光度A值（450-620mm）</th>
              <th>待测液中DON含量C（μg/ml）</th>
              <th>样品中DON含量（mg/kg）</th>
              <th>鲜样中DON含量（mg/kg）</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td>{{ Details.resultNo }}</td>
                <td>{{ item.clmh }}</td>
                <td>{{ item.sampleNo }}</td>
                <td>{{ item.sampleName }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.syxgdaz }}</td>
                <td>{{ item.c }}</td>
                <td>{{ item.ypzxxhl }}</td>
                <td>{{ item.xyzhl }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '黄曲霉毒素B1'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>管号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>试样质量 m（g）</th>
              <th>试样吸光度A值（450-620mm）</th>
              <th>待测液中DON含量C（μg/ml）</th>
              <th>样品中DON含量（mg/kg）</th>
              <th>鲜样中DON含量（mg/kg）</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td>{{ Details.resultNo }}</td>
                <td>{{ item.clmh }}</td>
                <td>{{ item.sampleNo }}</td>
                <td>{{ item.sampleName }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.syxgdaz }}</td>
                <td>{{ item.c }}</td>
                <td>{{ item.ypzxxhl }}</td>
                <td>{{ item.xyzhl }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == 'WSC'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>试样质量 m（g）</th>
              <th>移取萃取液体积V₁(mL)</th>
              <th>显色吸光度值A</th>
              <th>萃取液WSC含量C(mg/mL)</th>
              <th>试样中WSC含量(%)</th>
              <th>平均值（%）</th>
              <th>相对偏差（%）</th>
              <th>鲜样中WSC含量（%）</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ Details.resultNo }}</td>
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2"> {{ item.sampleName }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.v1 }}</td>
                <td>{{ item.a }}</td>
                <td>{{ item.c }}</td>
                <td>{{ item.syzwschl }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr :key="`row2-${index}`">
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareV1 }}</td>
                <td>{{ item.compareA }}</td>
                <td>{{ item.compareC }}</td>
                <td>{{ item.compareSyzwschl }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '黄曲霉毒素定性'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>管号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>试样质量 m（g）</th>
              <th>50%乙醇/水体积(mL)</th>
              <th>稀释液体积(uL)</th>
              <th>待测液体积(uL)</th>
              <th>检测结果</th>
              <th>鲜样中结果</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td>{{ Details.resultNo }}</td>
                <td>{{ item.clmh }}</td>
                <td>{{ item.sampleNo }}</td>
                <td>{{ item.sampleName }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.ycstj }}</td>
                <td>{{ item.xsytj }}</td>
                <td>{{ item.dcytj }}</td>
                <td>
                  {{ item.jcjg === '阴性' ? '✔' : '□' }}阴性
                  {{ item.jcjg === '阳性' ? '✔' : '□' }}阳性
                  {{ item.jcjgfw }}
                </td>
                <td>{{ item.xyzhl }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table" v-else-if="currentItemType == '水溶性氯化物'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>瓶号</th>
              <th>试样质量 m（g）</th>
              <th>样品消耗硝酸银标准溶液消耗体积V(mL)</th>
              <th>空白消耗硝酸银标准溶液消耗体积V₀(mL)</th>
              <th>水溶性氯化物含量X(%)</th>
              <th>平均值 (%)</th>
              <th>相对偏差（%）</th>
              <th>允许相差(绝对值)</th>
              <th>鲜样中水溶性氯化物含量x(%)</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ Details.resultNo }}</td>
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.clmh }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.v }}</td>
                <td>{{ item.v0 }}</td>
                <td>{{ item.x }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.yxxc }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr>
                <td>{{ item.compareClmh }}</td>
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareV }}</td>
                <td>{{ item.compareV0 }}</td>
                <td>{{ item.compareX }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <table class="detail-table"
          v-else-if="currentItemType == '粗灰分（近红外）' || currentItemType == '中性洗涤纤维（近红外）' || currentItemType == '粗脂肪（近红外）' || currentItemType == '酸性洗涤纤维（近红外）'">
          <thead>
            <tr>
              <th>化验单号</th>
              <th>样品编号</th>
              <th>样品名称</th>
              <!-- <th>项目名称</th> -->
              <th>结果</th>
              <th>鲜样中含量</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in detailList">
              <tr :key="`row1-${index}`">
                <td>{{ Details.resultNo }}</td>
                <td>{{ item.sampleNo }}</td>
                <td>{{ item.sampleName }}</td>
                <!-- <td>{{ item.itemName }}</td> -->
                <td>{{ item.average }}</td>
                <td>{{ item.remark }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <div v-if="detailList.length > 0 &&
          currentItemType != '水分' &&
          currentItemType != '粗蛋白' &&
          currentItemType != '粗灰分' &&
          currentItemType != '粗脂肪' &&
          currentItemType != '中性洗涤纤维' &&
          currentItemType != '酸性洗涤纤维' &&
          currentItemType != '钙' &&
          currentItemType != '磷' &&
          currentItemType != '粗纤维' &&
          currentItemType != '碳酸氢钠' &&
          currentItemType != '三聚氰胺' &&
          currentItemType != '玉米赤霉烯酮' &&
          currentItemType != '赭曲霉毒素' &&
          currentItemType != '淀粉糊化度' &&
          currentItemType != '淀粉测定（双酶法）' &&
          currentItemType != '呕吐毒素' &&
          currentItemType != '黄曲霉毒素B1' &&
          currentItemType != 'WSC' &&
          currentItemType != '容重' &&
          currentItemType != '黄曲霉毒素定性' &&
          currentItemType != '水溶性氯化物' &&
          currentItemType != '粗灰分（近红外）' &&
          currentItemType != '中性洗涤纤维（近红外）' &&
          currentItemType != '粗脂肪（近红外）' &&
          currentItemType != '酸性洗涤纤维（近红外）'" class="no-data">
          暂未配置【{{ currentItemType }}】的显示模板，请联系开发人员添加。
        </div>

        <div v-if="detailList.length === 0" class="no-data">
          暂无检测数据
        </div>

      </div>
      <span slot="footer">
        <el-button @click="handleEditCancel">取消</el-button>
        <!-- <el-button type="primary" @click="handleEditSave">保存</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listSampleTestProgress } from '@/api/CentralLaboratory/sampleTestProgress'
import { getResultBySampleNo2 } from '@/api/CentralLaboratory/jczxFeedReport'
export default {
  name: 'SampleTestProgress',
  dicts: ['test_progress', 'blood_task_item_type'],
  data() {
    return {
      activeTab: '1',
      loading: true,
      showSearch: true,

      // 饲料标签页数据
      baseList1: [],
      total1: 0,
      queryParams1: {
        pageNum: 1,
        pageSize: 10,
        entrustOrderNo: '',
        deptName: '',
        progress: '',
        type: '1', // 饲料类型
        beginReceiveTime: '',
        endReceiveTime: ''
      },
      receiveTimeRange1: [],

      // 血样标签页数据
      baseList2: [],
      total2: 0,
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
        entrustOrderNo: '',
        deptName: '',
        progress: '',
        type: '2', // 血样类型
        beginReceiveTime: '',
        endReceiveTime: ''
      },
      receiveTimeRange2: [],

      // PCR标签页数据
      baseList3: [],
      total3: 0,
      queryParams3: {
        pageNum: 1,
        pageSize: 10,
        entrustOrderNo: '',
        deptName: '',
        progress: '',
        type: '3', // PCR类型
        beginReceiveTime: '',
        endReceiveTime: ''
      },
      editDialogVisible: false,
      currentItemType: '',
      detailList: [], // 存储当前选中的那一行数据，放入数组中是为了配合 v-for
      Details: {},    // 存储基础信息（用于显示化验单号）
      receiveTimeRange3: [],
      // 控制化验结果弹窗显示
      resultOpen: false,
      // 弹窗加载状态
      resultLoading: false,
      // 存储接口返回的项目列表 (对应 infoList)
      resultList: [],
      itemTypeMap: {
        '粗脂肪（近红外）': '粗脂肪（近红外）',
        '水分': '水分',
        '粗蛋白': '粗蛋白',
        '粗灰分': '粗灰分',
        '粗脂肪': '粗脂肪',
        '中性洗涤纤维': '中性洗涤纤维',
        '酸性洗涤纤维': '酸性洗涤纤维',
        '钙': '钙',
        '磷': '磷',
        '粗纤维': '粗纤维',
        '碳酸氢钠': '碳酸氢钠',
        '三聚氰胺': '三聚氰胺',
        '玉米赤霉烯酮': '玉米赤霉烯酮',
        '赭曲霉毒素': '赭曲霉毒素',
        '淀粉糊化度': '淀粉糊化度',
        '淀粉测定（双酶法）': '淀粉测定（双酶法）',
        '呕吐毒素': '呕吐毒素',
        '黄曲霉毒素B1': '黄曲霉毒素B1',
        'WSC': 'WSC',
        '黄曲霉毒素定性': '黄曲霉毒素定性',
        '水溶性氯化物': '水溶性氯化物',
        '粗灰分（近红外）': '粗灰分（近红外）',
        '中性洗涤纤维（近红外）': '中性洗涤纤维（近红外）',
        '粗脂肪（近红外）': '粗脂肪（近红外）',
        '酸性洗涤纤维（近红外）': '酸性洗涤纤维（近红外）',
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 获取当前激活 Tab 的查询参数 */
    getCurrentQueryParams() {
      switch (this.activeTab) {
        case '1':
          return this.queryParams1
        case '2':
          return this.queryParams2
        case '3':
          return this.queryParams3
        default:
          return this.queryParams1
      }
    },
    /** 获取项目类型 (从 reportgensl.vue 复制) */
    getItemType(itemName) {
      if (!itemName) return 'default';
      const sortedKeys = Object.keys(this.itemTypeMap).sort((a, b) => b.length - a.length);
      for (const key of sortedKeys) {
        if (itemName.includes(key)) {
          return this.itemTypeMap[key];
        }
      }
      return 'default';
    },
    /** 点击查看化验结果按钮 */
    handleViewResult(row) {
      this.resultOpen = true;
      this.resultLoading = true;
      this.resultList = [];
      this.currentResultBase = {}; // 重置基础信息

      // 假设你已经在上面 import 了 getResultBySampleNo2
      getResultBySampleNo2({ sampleNo: row.sampleNo }).then(response => {
        this.resultLoading = false;
        if (response.code === 200 && response.data) {
          // 保存完整 data 以便获取 resultNo
          this.currentResultBase = response.data;
          this.resultList = response.data.infoList || [];
        } else {
          this.$message.error(response.msg || '获取数据失败');
        }
      }).catch(() => {
        this.resultLoading = false;
      });
    },

    /** 点击具体的项目名称，显示详细化验单 */
    handleItemDetail(row) {
      // 1. 确定项目类型
      this.currentItemType = this.getItemType(row.itemName);

      // 2. 准备数据
      // 列表接口返回的 row 已经包含了详细数据(m, ca, average等)，直接使用
      this.detailList = [row];
      this.Details = this.currentResultBase; // 传递包含 resultNo 的对象

      // 3. 打开弹窗
      this.editDialogVisible = true;
    },
    /** 关闭详情弹窗 */
    handleEditCancel() {
      this.editDialogVisible = false;
      this.currentItemType = '';
      this.detailList = [];
    },
    /** 获取当前激活 Tab 的日期范围 */
    getCurrentReceiveTimeRange() {
      switch (this.activeTab) {
        case '1':
          return this.receiveTimeRange1
        case '2':
          return this.receiveTimeRange2
        case '3':
          return this.receiveTimeRange3
        default:
          return this.receiveTimeRange1
      }
    },

    /** 获取当前激活 Tab 的数据列表 */
    getCurrentList() {
      switch (this.activeTab) {
        case '1':
          return this.baseList1
        case '2':
          return this.baseList2
        case '3':
          return this.baseList3
        default:
          return this.baseList1
      }
    },

    /** 设置当前激活 Tab 的数据列表 */
    setCurrentList(data) {
      switch (this.activeTab) {
        case '1':
          this.baseList1 = data
          break
        case '2':
          this.baseList2 = data
          break
        case '3':
          this.baseList3 = data
          break
        default:
          this.baseList1 = data
      }
    },

    /** 获取当前激活 Tab 的总数 */
    getCurrentTotal() {
      switch (this.activeTab) {
        case '1':
          return this.total1
        case '2':
          return this.total2
        case '3':
          return this.total3
        default:
          return this.total1
      }
    },

    /** 设置当前激活 Tab 的总数 */
    setCurrentTotal(total) {
      switch (this.activeTab) {
        case '1':
          this.total1 = total
          break
        case '2':
          this.total2 = total
          break
        case '3':
          this.total3 = total
          break
        default:
          this.total1 = total
      }
    },

    /** 获取当前激活 Tab 的查询表单引用 */
    getCurrentQueryFormRef() {
      switch (this.activeTab) {
        case '1':
          return 'queryForm1'
        case '2':
          return 'queryForm2'
        case '3':
          return 'queryForm3'
        default:
          return 'queryForm1'
      }
    },

    /** 查询样品化验进度列表 */
    getList() {
      this.loading = true
      const queryParams = this.getCurrentQueryParams()
      const receiveTimeRange = this.getCurrentReceiveTimeRange()

      // 设置收样时间范围
      if (receiveTimeRange && receiveTimeRange.length === 2) {
        queryParams.beginReceiveTime = receiveTimeRange[0]
        queryParams.endReceiveTime = receiveTimeRange[1]
      } else {
        queryParams.beginReceiveTime = null
        queryParams.endReceiveTime = null
      }

      listSampleTestProgress(queryParams).then(response => {
        this.setCurrentList(response.rows || [])
        this.setCurrentTotal(response.total || 0)
        this.loading = false
      }).catch(error => {
        console.error('查询失败', error)
        this.loading = false
        this.setCurrentList([])
        this.setCurrentTotal(0)
      })
    },

    /** 处理 Tab 切换 */
    handleTabClick(tab) {
      this.activeTab = tab.name
      this.getCurrentQueryParams().pageNum = 1
      this.getList()
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.getCurrentQueryParams().pageNum = 1
      this.getList()
    },

    /** 重置按钮操作 */
    resetQuery() {
      const formRef = this.getCurrentQueryFormRef()
      this.resetForm(formRef)

      // 重置日期范围
      switch (this.activeTab) {
        case '1':
          this.receiveTimeRange1 = []
          break
        case '2':
          this.receiveTimeRange2 = []
          break
        case '3':
          this.receiveTimeRange3 = []
          break
      }

      // 重置查询参数（保留分页大小）
      const currentParams = this.getCurrentQueryParams()
      Object.assign(currentParams, {
        pageNum: 1,
        entrustOrderNo: '',
        deptName: '',
        progress: '',
        beginReceiveTime: '',
        endReceiveTime: ''
      })

      this.getList()
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.getCurrentQueryParams()
      const receiveTimeRange = this.getCurrentReceiveTimeRange()

      // 设置收样时间范围
      if (receiveTimeRange && receiveTimeRange.length === 2) {
        queryParams.beginReceiveTime = receiveTimeRange[0]
        queryParams.endReceiveTime = receiveTimeRange[1]
      } else {
        queryParams.beginReceiveTime = null
        queryParams.endReceiveTime = null
      }

      this.download('/labtest/sampleTestProgress/export', {
        ...queryParams
      }, `sample_test_progress_${new Date().getTime()}.xlsx`)
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },

    // 重置表单
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },

    // 重置表单数据
    reset() {
      this.form = {
        id: ''
        // 添加其他表单字段
      }
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

/* === 新增：详情表格样式 === */
.detail-table-container {
  max-height: 60vh;
  overflow-x: auto;
  overflow-y: auto;
  padding: 10px 0;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 800px;
  /* 防止过窄 */
}

.detail-table th,
.detail-table td {
  border: 1px solid #e0e0e0;
  padding: 10px 8px;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  /* 保持单行 */
}

.detail-table th {
  background-color: #f5f7fa;
  font-weight: bold;
  color: #333;
}

.detail-table td {
  background-color: #fff;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #909399;
}
</style>
