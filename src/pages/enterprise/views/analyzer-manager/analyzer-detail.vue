<template>
  <div v-loading="loading">
    <div v-if="!showEdit" class="app-container">
      <div class="container-standard">
        <div class="container-line-title">
          <el-tag v-if="deviceData.status || deviceData.status === 0" :type="deviceData.status | analyzerStatusTypeFilter" class="title-tag">{{ deviceData.status | analyzerStatusFilter }}</el-tag>
          <span class="detail-title" style="width: calc(100% - 200px)">【{{ deviceData.machineNo }}】{{ deviceData.name }}</span>
          <el-dropdown trigger="click" class="container-line-button">
            <el-button type="primary">
              <div style="height: 12px;">操作<i class="el-icon-arrow-down el-icon--right" /></div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="buttonPermissions.includes(newAnalyzer)" @click.native="edit">编辑</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(stopAnalyzer)" :disabled="deviceData.status !== 0" @click.native="changeStatus(1)">恢复</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(stopAnalyzer)" :disabled="deviceData.status !== 1" @click.native="forbidden">禁用</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(deleteAnalyzer)" @click.native="delMachineInfo">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">品牌：</span>
            <span class="detail-form-value">{{ deviceData.brand }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">型号：</span>
            <span class="detail-form-value">{{ deviceData.specs }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">可预约最长时间(小时)：</span>
            <span class="detail-form-value">{{ deviceData.maxTime }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">存放地点：</span>
            <span class="detail-form-value">{{ deviceData.address }}</span>
          </span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-name">用途：</span>
          <span class="detail-form-value">{{ deviceData.purpose }}</span>
        </div>
        <div class="container-line-item" style="margin-bottom: 0;">
          <span v-for="column in columnList" :key="column.code" style="margin-bottom: 12px;" class="detail-form-item">
            <span class="detail-form-name">{{ column.name }}：</span>
            <span class="detail-form-value">{{ deviceData.formData[column.code] }}</span>
          </span>
        </div>
      </div>
      <div class="calendar-container">
        <FullCalendar
          ref="fullCalendar"
          class="calendar"
          default-view="timeGridWeek"
          :header="{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listYear'
          }"
          event-color="#4A90E2"
          :title-format="{
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'short'
          }"
          title-range-separator=" - "
          :slot-label-format="{
            hour: '2-digit',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'short',
            hour12: false
          }"
          :event-time-format="{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          }"
          :list-time-format="{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          }"
          no-events-message="暂无预约"
          :valid-range="validRange"
          :locales="locales"
          :plugins="calendarPlugins"
          :events="calendarEvents"
          :selectable="true"
          @eventClick="eventClickHandler"
          @select="selectHandler"
        />
        <sticky :sticky-top="100" style="flex: 0 0 280px; margin-left: 18px;">
          <el-card v-if="editType!=='none'" shadow="always" style="height: 350px; position: relative;">
            <div style="font-size: 16px; line-height: 1; color: #303133; margin-bottom: 22px; font-weight: bold;">
              预约信息
            </div>
            <div style="font-size: 14px; color: #303133; margin-bottom: 14px; display: flex;">
              <svg-icon icon-class="date" class="icon" style="flex: 0 0 16px;" />
              <div>
                <div>{{ startTime }}{{ isInOneDay ? `-${endTime.substr(10, 5)}` : '' }}</div>
                <div v-if="!isInOneDay" style="margin-top: 6px; color: #4A90E2;">至</div>
                <div v-if="!isInOneDay" style="margin-top: 6px;">{{ endTime }}</div>
              </div>
            </div>
            <div style="font-size: 14px; color: #303133; margin-bottom: 14px; display: flex;">
              <svg-icon icon-class="person" class="icon" style="flex: 0 0 16px;" />
              <div>{{ appointmentCreateName }}</div>
            </div>
            <div v-if="editType==='new'" style="font-size: 14px; color: #303133; margin-bottom: 6px;">使用目的：</div>
            <el-input
              v-if="editType==='new'"
              v-model="appointment.content"
              type="textarea"
              :rows="4"
              resize="none"
              :maxlength="30"
              show-word-limit
              placeholder="请输入内容"
            />
            <div v-if="editType==='info'" style="font-size: 14px; color: #303133; margin-bottom: 14px; display: flex;">
              <svg-icon icon-class="detail" class="icon" style="flex: 0 0 16px;" />
              <div>{{ appointment.content }}</div>
            </div>
            <el-button v-if="appointmentCreateId===userId || editType==='new'" style="position: absolute; right: 20px; bottom: 20px;" type="primary" @click="setAppointment">{{ editType==='info' ? '取 消' : '预 约' }}</el-button>
          </el-card>
        </sticky>
      </div>
      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">操作日志</span>
      </div>
      <OperateLog :activities="activities" />
    </div>
    <analyzer-establish v-if="showEdit" :edit-data.sync="transfer" :column-list="columnList" @analyzerEdit="analyzerEdit" @cancelEdit="cancelEdit" />
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import FullCalendar from '@fullcalendar/vue'
import cnLocale from '@fullcalendar/core/locales/zh-cn'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import ListPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import AnalyzerEstablish from '@/views/analyzer-manager/components/analyzer-establish'
import { deepClone, parseTime } from '@/utils'
import OperateLog from '@/components/operateLog'
import { fetchDetail, editAnalyzer, changeDeviceStatus, deleteDevice,
  editAppointment, queryAppointment, deleteAppointment } from '@/api/analyzer'
import { fetchColumnList } from '@/api/form'
const statusOptions = [
  { value: 0, label: '禁用', type: 'info' },
  { value: 1, label: '可预约', type: 'success' }
]
const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export default {
  name: 'AnalyzerDetail',
  components: {
    FullCalendar,
    AnalyzerEstablish,
    Sticky,
    OperateLog
  },
  filters: {
    analyzerStatusFilter(type) {
      return statusOptions[type].label
    },
    analyzerStatusTypeFilter(type) {
      return statusOptions[type].type
    }
  },
  data() {
    return {
      calendarPlugins: [ // plugins must be defined in the JS
        ListPlugin,
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin // needed for dateClick
      ],
      locales: [cnLocale],
      calendarEvents: [],
      // 仪器设备详情
      deviceData: {
        id: undefined,
        status: undefined,
        machineNo: '',
        name: '',
        brand: '',
        specs: '',
        maxTime: '',
        address: '',
        purpose: '',
        formData: {}
      },
      // 编辑数据中转
      transfer: {},
      // 自定义字段
      columnList: [],
      loading: true,
      code: 'machine',
      showEdit: false,

      textarea: '',
      editType: 'none', // 'info', 'new'
      appointmentId: '',
      appointmentCreateId: '',
      appointmentCreateName: '',
      appointment: {
        machineId: '',
        startTime: '',
        endTime: '',
        content: ''
      },
      // 项目日志
      activities: []
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
    // 新建、编辑仪器
    newAnalyzer() {
      return this.buttonPermission[this.platform].newAnalyzer
    },
    // 禁用 恢复仪器
    stopAnalyzer() {
      return this.buttonPermission[this.platform].stopAnalyzer
    },
    // 删除仪器
    deleteAnalyzer() {
      return this.buttonPermission[this.platform].deleteAnalyzer
    },
    // 设置
    setting() {
      return this.buttonPermission[this.platform].setting
    },
    userId() {
      return this.$store.getters.userId
    },
    userName() {
      return this.$store.getters.name
    },
    startTime() {
      // eslint-disable-next-line
      const time = this.appointment.startTime.replace(/\-/g, "/")
      const date = new Date(time)
      const m = this.appointment.startTime.substr(5, 2)
      const d = this.appointment.startTime.substr(8, 2)
      const h = this.appointment.startTime.substr(11, 2)
      const i = this.appointment.startTime.substr(14, 2)
      return `${m}月${d}日 ${week[date.getDay()]} ${h}:${i}`
    },
    endTime() {
      // eslint-disable-next-line
      const time = this.appointment.endTime.replace(/\-/g, "/")
      const date = new Date(time)
      const m = this.appointment.endTime.substr(5, 2)
      const d = this.appointment.endTime.substr(8, 2)
      const h = this.appointment.endTime.substr(11, 2)
      const i = this.appointment.endTime.substr(14, 2)
      return `${m}月${d}日 ${week[date.getDay()]} ${h}:${i}`
    },
    isInOneDay() {
      return this.startTime.substr(0, 9) === this.endTime.substr(0, 9)
    }
  },
  created() {
    this.deviceDetail()
  },
  // mounted() {
  //   const calendarApi = this.$refs.fullCalendar.getApi()
  //   calendarApi.setOption('height', 700)
  // },
  methods: {
    // 获取仪器详情
    async deviceDetail() {
      const blankFormData = {}
      this.loading = true
      const columnRes = await fetchColumnList({ code: this.code })
      this.columnList = columnRes.data.list
      this.columnList.forEach(element => {
        blankFormData[element.id] = ''
      })
      await fetchDetail({ id: this.$route.query.id }).then(res => {
        this.deviceData = res.data.machine
        this.activities = res.data.log
        this.appointment.machineId = this.deviceData.id
      })
      if (!this.deviceData) {
        this.$message.error('该仪器已被删除')
        setTimeout(() => {
          this.$emit('closeme', { name: this.$options.name, path: this.$route.path })
        }, 1000)
        this.loading = false
        return
      }
      this.deviceData.formData = Object.assign(blankFormData, JSON.parse(this.deviceData.formData))

      await queryAppointment({ machineId: this.appointment.machineId }).then(res => {
        this.calendarEvents = res.data.list.map(item => {
          return {
            id: item.id,
            createId: item.createId,
            createName: item.createName,
            start: item.startTime,
            end: item.endTime,
            title: item.content
          }
        })
      })
      this.loading = false
    },
    // gotoPast() {
    //   const calendarApi = this.$refs.fullCalendar.getApi() // from the ref="..."
    //   calendarApi.gotoDate('2000-01-01') // call a method on the Calendar object
    // },
    validRange() {
      const now = new Date()
      const start = parseTime(now, '{y}-{m}-{d} {h}:{i}:{s}')
      const nextMonths = new Date(now.getTime() + 1000 * 3600 * 24 * 30)
      const end = parseTime(nextMonths, '{y}-{m}-{d} {h}:{i}:{s}')
      return { start, end }
    },
    eventClickHandler(info) {
      this.clearTempEvent()
      this.editType = 'info'
      this.appointmentId = parseInt(info.event.id)
      for (let i = 0; i < this.calendarEvents.length; i++) {
        if (this.calendarEvents[i].id === this.appointmentId) {
          this.appointment.startTime = this.calendarEvents[i].start
          this.appointment.endTime = this.calendarEvents[i].end
          this.appointment.content = this.calendarEvents[i].title
          this.appointmentCreateId = this.calendarEvents[i].createId
          this.appointmentCreateName = this.calendarEvents[i].createName
        }
      }
    },
    selectHandler(arg) {
      if (this.deviceData.status === 0) {
        this.$message.error('仪器已被禁用')
        return
      }
      this.clearTempEvent()
      const start = parseTime(arg.startStr, '{y}-{m}-{d} {h}:{i}:{s}')
      const end = parseTime(arg.endStr, '{y}-{m}-{d} {h}:{i}:{s}')
      let calendarEvent
      for (let i = 0; i < this.calendarEvents.length; i++) {
        calendarEvent = this.calendarEvents[i]
        if (start > calendarEvent.start && start < calendarEvent.end) {
          this.$message.error('该时段已有预约')
          this.editType = 'none'
          return
        } else if (end > calendarEvent.start && end < calendarEvent.end) {
          this.$message.error('该时段已有预约')
          this.editType = 'none'
          return
        } else if (start < calendarEvent.start && end > calendarEvent.end) {
          this.$message.error('该时段已有预约')
          this.editType = 'none'
          return
        }
      }
      this.editType = 'new'
      this.appointment.startTime = start
      this.appointment.endTime = end
      this.appointmentCreateName = this.userName
      this.appointment.content = ''
      this.calendarEvents.push({
        start,
        end,
        temp: true,
        rendering: 'background',
        color: '#e1f3d8'
      })
    },
    clearTempEvent() {
      for (let i = this.calendarEvents.length - 1; i >= 0; i--) {
        if (this.calendarEvents[i].temp) {
          this.calendarEvents.splice(i, 1)
        }
      }
    },
    setAppointment() {
      if (this.editType === 'new') {
        // 新建预约
        editAppointment(this.appointment).then(res => {
          if (res.code === 200) {
            this.calendarEvents.push({
              id: res.data.id,
              createId: res.data.createId,
              createName: res.data.createName,
              start: res.data.startTime,
              end: res.data.endTime,
              title: res.data.content
            })
          }
        }).catch(res => {
          setTimeout(() => {
            this.$emit('closeme', { name: this.$options.name, path: this.$route.path })
          }, 2000)
        })
      } else {
        this.$confirm('确认删除这次预约', '删除预约', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 取消预约
          deleteAppointment({ id: this.appointmentId }).then(res => {
            if (res.code === 200) {
              for (let i = 0; i < this.calendarEvents.length; i++) {
                if (this.calendarEvents[i].id === this.appointmentId) {
                  this.calendarEvents.splice(i, 1)
                  this.$message.success('已删除预约')
                  return
                }
              }
            }
          })
        }).catch(() => {
          this.$message.info('已取消')
        })
      }
      this.clearTempEvent()
      this.editType = 'none'
    },
    // 暂时不做编辑功能
    // eventDropHandler(info) {
    //   console.log(info)
    //   console.log(this.calendarEvents)
    //   console.log('move')
    //   // info.revert()
    // },
    // 编辑仪器信息
    edit() {
      this.transfer = deepClone(this.deviceData)
      this.showEdit = true
    },
    cancelEdit() {
      this.showEdit = false
    },
    analyzerEdit() {
      const postData = deepClone(this.transfer)
      postData.formData = JSON.stringify(this.transfer.formData)
      editAnalyzer(postData).then(res => {
        if (res.code === 200) {
          this.showEdit = false
          this.deviceDetail()
        }
      })
    },
    // 修改状态
    changeStatus(status) {
      changeDeviceStatus({ id: this.deviceData.id, status }).then(res => {
        if (res.code === 200) {
          this.deviceDetail()
        }
      })
    },
    forbidden() {
      this.$confirm('确认停止该仪器预约？停止后仪器不开放预约功能 可随时恢复！', '停止预约仪器', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeStatus(0)
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    // 删除仪器信息
    delMachineInfo() {
      this.$confirm('确认删除该仪器？该操作不可恢复!', '删除仪器', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 取消预约
        deleteDevice({ id: this.deviceData.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('已删除仪器')
            setTimeout(() => {
              this.$emit('closeme', { name: this.$options.name, path: this.$route.path })
            }, 500)
          }
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    }
  }
}
</script>

<style lang='scss'>
// you must include each plugins' css
// paths prefixed with ~ signify node_modules
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';
@import '~@fullcalendar/list/main.css';
.calendar-container {
  display: flex;
}
.calendar {
  flex-grow: 1;
}
.fc-toolbar h2 {
  font-size: 18px;
  font-weight: 400px;
}
.fc th {
  font-size: 14px;
  padding: 8px 0;
  font-weight: 300px;
}
.fc-button .fc-icon {
  font-size: 1em;
  margin-top: -2px;
}
.fc-button-primary {
  background-color: #5370FF;
  border-color: #5370FF;
  font-size: 14px;
  height: 32px;
}
.fc-button-primary:hover {
  background: #6ea6e8;
  border-color: #6ea6e8;
}
.fc-button-primary:disabled {
  opacity: 0.5;
  background-color: #5370FF;
  border-color: #5370FF;
}
.fc-button-primary:focus {
  box-shadow: none;
}
.fc-button-primary:not(:disabled):active, .fc-button-primary:not(:disabled).fc-button-active {
  background-color: #263A9E;
  border-color: #263A9E;
}
.fc-button-primary:not(:disabled):active:focus, .fc-button-primary:not(:disabled).fc-button-active:focus {
  box-shadow: none;
}

</style>

<style scoped>
.icon {
  font-size: 16px;
  color: #909399;
  margin-right: 10px;
}
</style>
