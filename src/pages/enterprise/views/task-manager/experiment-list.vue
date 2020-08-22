<template>
  <div class="app-container">
    <ylab-hiddenable-container v-show="!viewColumnEditing">
      <el-form v-model="listQuery" label-position="left" :inline="true" class="ybr-form-row" style="width: calc(100% - 80px);">
        <el-form-item v-if="checkedColumns.includes('状态')" label="状态：">
          <el-select v-model="listQuery.statuses" clearable multiple placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('编号')" label="编号：">
          <el-input v-model="listQuery.taskNo" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('名称')" label="名称：">
          <el-input v-model="listQuery.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('类型')" label="类型：">
          <el-select v-model="listQuery.typeId" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-if="checkedColumns.includes('优先级')" label="优先级：">
          <el-select v-model="listQuery.level" filterable clearable placeholder="请选择">
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item> -->
        <el-form-item v-if="checkedColumns.includes('负责部门')" label="负责部门：">
          <el-select v-model="listQuery.deptId" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in deptList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('创建人')" label="创建人：">
          <el-select v-model="listQuery.createId" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in principalList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('计划开始')" label="计划开始：">
          <el-date-picker v-model="planStartTime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('计划结束')" label="计划结束：">
          <el-date-picker v-model="planEndTime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('创建时间')" label="创建时间：">
          <el-date-picker v-model="createTime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('更新时间')" label="更新时间：">
          <el-date-picker v-model="updateTime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>

        <el-form-item v-for="column in visibleColumns" :key="column.code" :label="`${column.name}：`">
          <el-date-picker v-if="column.type==='date'" v-model="formDataQuery[column.code]" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
          <el-select v-else-if="column.type==='select'" v-model="formDataQuery[column.code]" clearable placeholder="请选择">
            <el-option v-for="(item,index) in column.options.split(',')" :key="index" :label="item" :value="item" />
          </el-select>
          <el-input v-else-if="column.type==='text'" v-model="formDataQuery[column.code]" clearable />
        </el-form-item>
      </el-form>
      <el-button class="container-line-button" type="primary" @click="handleFilter">
        搜索
      </el-button>
    </ylab-hiddenable-container>
    <column-filter-settings v-if="viewColumnEditing" :code="code" :fixed-columns="fixedColumns" @closeme="viewColumnEditing=false" />
    <div v-else class="container-line-item">
      <span
        :class="listQuery.isAll===1?'status-text-button-actived':'status-text-button'"
        @click="listQuery.isAll=1; handleFilter();"
      >
        所有实验
      </span>
      <span
        :class="listQuery.isAll===0?'status-text-button-actived':'status-text-button'"
        @click="listQuery.isAll=0; handleFilter();"
      >
        延期实验
      </span>
      <el-dropdown v-if="buttonPermissions.includes(taskSetting)" trigger="click" class="container-line-button" size="medium">
        <el-button type="primary">
          <div style="height: 12px;">更多<i class="el-icon-arrow-down el-icon--right" /></div>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="$router.push('/contract-manager/experiment-settings')">设置</el-dropdown-item>
          <el-dropdown-item @click.native="$router.push('/contract-manager/batch?type=experiment')">导入</el-dropdown-item>
          <el-dropdown-item @click.native="derive">导出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button class="container-line-button" type="primary" @click="viewColumnEditing=true">
        视图
      </el-button>
      <!-- <el-button v-if="buttonPermissions.includes(newTask)" class="container-line-button" type="primary" @click="$router.push('/contract-manager/experiment-create')">
        新建
      </el-button> -->
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="selection" width="39" />
      <el-table-column v-if="checkedColumns.includes('状态')" label="状态" class-name="status-col" width="80" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusTypeFilter">{{ row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('编号')" label="编号" width="140" align="center">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.taskNo }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('名称')" label="名称" min-width="260">
        <template slot-scope="{row}">
          <span style="display: inline;" class="link-type" :class="{'finished-item': row.status === 4}" @click="$router.push(`/contract-manager/experiment-detail?id=${row.id}`)">{{ row.name }}</span>
          <!-- <el-tag v-if="row.h3Id" type="primary">合作</el-tag> -->
          <el-tooltip placement="top">
            <div slot="content">
              <div v-if="row.taskException && row.taskException.length > 0" style="display: flex;">
                <div>任务异常：</div>
                <div>
                  <div v-for="(item,index) in row.taskException" :key="index">{{ item.remark }}</div>
                </div>
              </div>
              <div v-if="row.contractException">项目异常：{{ row.contractException.remark }}</div>
            </div>
            <el-tag v-show="row.contractException" type="danger">异常</el-tag>
          </el-tooltip>
          <el-tag v-if="row.isNew === 1" type="danger">NEW</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('类型')" label="类型" width="120" align="center">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="checkedColumns.includes('优先级')" label="优先级" align="center" width="85">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.level }}</span>
        </template>
      </el-table-column> -->
      <el-table-column v-if="checkedColumns.includes('负责部门')" label="负责部门" align="center" width="110">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.deptName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="checkedColumns.includes('创建人')" label="创建人" align="center" width="70">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.createName }}</span>
        </template>
      </el-table-column> -->
      <el-table-column v-if="checkedColumns.includes('计划开始')" label="计划开始" align="center" width="95" class-name="small-padding">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.planStartTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('计划结束')" label="计划结束" align="center" width="95" class-name="small-padding">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.planEndTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('创建时间')" label="创建时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('更新时间')" label="更新时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.updateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column v-for="column in visibleColumns" :key="column.code" :label="column.name" width="120" align="center">
        <template slot-scope="{row}">
          <span v-if="column.type==='date'" :class="{'finished-item': row.status === 4}">{{ row.formData[column.code] | parseTime('{y}-{m}-{d}') }}</span>
          <span v-else :class="{'finished-item': row.status === 4}">{{ row.formData[column.code] }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="buttonPermissions.includes(newTask) && row.status === 0" type="primary" @click="changeStatus(row.id, 1)">
            开始
          </el-button>
          <el-button v-if="buttonPermissions.includes(newTask) && row.status === 1" type="success" @click="confirmEnd(row.id, 4)">
            完成
          </el-button>
          <el-button v-if="buttonPermissions.includes(stopTask) && row.status === 3" type="warning" @click="changeStatus(row.id, 1)">
            恢复
          </el-button>
          <el-button v-if="buttonPermissions.includes(newTask) && row.status === 4" type="info" disabled>
            完成
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="paginationHandler" />
  </div>
</template>

<script>
import { experimentFetchList, editExperimentStatus } from '@/api/experiment'
import { fetchTypeList } from '@/api/form'
import { queryDept } from '@/api/common'
import Pagination from '@/components/Pagination'
import YlabHiddenableContainer from '@/views/components/YlabHiddenableContainer'
import ColumnFilterSettings from '@/views/components/column/ColumnFilterSettings'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { mixin } from '@/utils/ylab-list-common'
import { column } from '@/utils/ylab-list-column'
import axios from 'axios'

const statusOptions = [
  { value: 0, label: '未开始' },
  { value: 1, label: '进行中' },
  { value: 3, label: '已暂停' },
  { value: 4, label: '已完成' }
]
const fixedColumns = ['状态', '编号', '名称', '类型', '负责部门', '计划开始', '计划结束', '创建时间', '更新时间']
export default {
  name: 'ExperimentList',
  components: { Pagination, YlabHiddenableContainer, ColumnFilterSettings },
  mixins: [mixin, column],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        statuses: undefined,
        taskNo: undefined,
        name: undefined,
        typeId: undefined,
        deptId: undefined,
        createId: undefined,
        planStartTime: undefined,
        planEndTime: undefined,
        createTime: undefined,
        updateTime: undefined,
        pageNo: 1,
        pageSize: 20,
        sort: 1,
        isAll: 1,
        isShow: 1
      },
      formDataQuery: {},
      statusOptions: statusOptions,

      planStartTime: [],
      planEndTime: [],
      createTime: [],
      updateTime: [],

      fixedColumns: fixedColumns,
      viewColumnEditing: false,
      code: 'task',
      columnList: [],
      deptList: [],
      typeList: [],
      checkedColumnsList: []
    }
  },
  computed: {
    buttonPermissions() {
      return this.$store.getters.buttonPermissions
    },
    platform() {
      return this.$store.getters.platform
    },
    buttonPermission() {
      return this.$store.getters.buttonPermission
    },
    // 任务设置 （企业版实验设置）
    taskSetting() {
      return this.buttonPermission[this.platform].taskSetting
    },
    // 新建 编辑任务
    newTask() {
      return this.buttonPermission[this.platform].newTask
    },
    // 停止 恢复任务
    stopTask() {
      return this.buttonPermission[this.platform].stopTask
    }
  },
  watch: {
    listQuery: {
      deep: true,
      handler: function() {
        sessionStorage.removeItem('statuses')
        sessionStorage.removeItem('curId')
      }
    }
  },
  created() {
    this.getList()
    // fetchPersonList().then(res => {
    //   this.principalList = res.data.list
    // })
    queryDept().then(res => {
      this.deptList = res.data
    })
    fetchTypeList({ code: this.code, pageNo: 1, pageSize: 1000 }).then(res => {
      this.typeList = res.data.list
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      this.setQueryTime('planStartTime')
      this.setQueryTime('planEndTime')
      this.setQueryTime('createTime')
      this.setQueryTime('updateTime')
      const keyword = []
      const dataTimes = []
      this.columnList.forEach(element => {
        if (this.formDataQuery[element.code]) {
          if (element.type === 'date') {
            if (this.formDataQuery[element.code].length === 2) {
              dataTimes.push({ code: parseInt(element.code), startTime: this.formDataQuery[element.code][0], endTime: this.formDataQuery[element.code][1].replace('00:00:00', '23:59:59') })
            }
          } else {
            keyword.push(JSON.stringify({ [element.code]: this.formDataQuery[element.code] }))
          }
        }
      })

      this.listQuery.keyword = keyword
      this.listQuery.dataTimes = dataTimes
      const statuses = sessionStorage.getItem('statuses')
      if (statuses) {
        this.listQuery.statuses = JSON.parse(statuses)
        this.listQuery.curId = JSON.parse(sessionStorage.getItem('curId'))
      }
      experimentFetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.list = this.list.map((item) => {
          if (item.formData) {
            return Object.assign(item, { formData: JSON.parse(item.formData) })
          } else {
            return Object.assign(item, { formData: {}})
          }
        })
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.2 * 1000)
      })
    },
    changeStatus(id, statusNum) {
      editExperimentStatus({ id, status: statusNum }).then(res => {
        this.getList()
      })
    },
    // 确认结束
    confirmEnd(id, statusNum) {
      this.$confirm('确认结束该任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeStatus(id, statusNum)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    derive() {
      axios({ url: '/admin/task/export', method: 'post', data: this.listQuery, responseType: 'blob' }).then((res) => {
        var blob = new Blob([res.data])
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = `任务.xlsx`
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, `任务.xlsx`)
        }
      })
    }
  }
}
</script>
