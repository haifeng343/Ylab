<template>
  <div>
    <div class="container-line-title">
      <span class="detail-subtitle">各版块概况</span>
    </div>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <div class="wrapper-title">项目列表</div>
          <div class="chart">
            <div style="position:relative">
              <el-progress type="circle" :percentage="contracts.percent" :stroke-width="9" :width="135" />
              <div class="alignCenter">
                <div>{{ contracts.percent }}%</div>
                <div>完成率</div>
              </div>
            </div>
            <div style="margin-left: 30px;">
              <div class="legend">
                <span class="icon" style="background: #909399;" />
                <span class="label">未开始</span>
                <span class="value link-type" @click="toContractList([0],'constract')">{{ contracts.notStartCount }}</span>
              </div>
              <div class="legend">
                <span class="icon" style="background: #E6A23C;" />
                <span class="label">进行中</span>
                <span class="value link-type" @click="toContractList([1],'constract')">{{ contracts.doingCount }}</span>
              </div>
              <div class="legend">
                <span class="icon" style="background: #67C23A;" />
                <span class="label">已完成</span>
                <span class="value link-type" @click="toContractList([4],'constract')">{{ contracts.completeCount }}</span>
              </div>
              <div class="legend">
                <span class="icon" style="background: #F56C6C;" />
                <span class="label">已暂停</span>
                <span class="value link-type" @click="toContractList([3],'constract')">{{ contracts.stopCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <div class="wrapper-title">任务列表</div>
          <div class="chart">
            <div style="position:relative">
              <el-progress type="circle" :percentage="tasks.percent" :stroke-width="9" :width="135" />
              <div class="alignCenter">
                <div>{{ tasks.percent }}%</div>
                <div>完成率</div>
              </div>
            </div>
            <div style="margin-left: 30px;">
              <div class="legend">
                <span class="icon" style="background: #909399;" />
                <span class="label">未开始</span>
                <span class="value link-type" @click="toContractList([0],'task')">{{ tasks.notStartCount }}</span>
              </div>
              <div class="legend">
                <span class="icon" style="background: #E6A23C;" />
                <span class="label">进行中</span>
                <span class="value link-type" @click="toContractList([1],'task')">{{ tasks.doingCount }}</span>
              </div>
              <div class="legend">
                <span class="icon" style="background: #67C23A;" />
                <span class="label">已完成</span>
                <span class="value link-type" @click="toContractList([4],'task')">{{ tasks.completeCount }}</span>
              </div>
              <div class="legend">
                <span class="icon" style="background: #F56C6C;" />
                <span class="label">已暂停</span>
                <span class="value link-type" @click="toContractList([3],'task')">{{ tasks.stopCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <div class="wrapper-title">采购列表</div>
          <div class="chart2">
            <bar-chart :source="buys" />
            <div style="margin-left: 30px;">
              <div class="legend">
                <span class="icon" style="background: #909399;" />
                <span class="label">未通过</span>
                <span class="value link-type" @click="toContractList([7],'buy')">{{ buys.refuseCount }}</span>
              </div>
              <div class="legend">
                <span class="icon" style="background: #E6A23C;" />
                <span class="label">审核中</span>
                <span class="value link-type" @click="toContractList([5],'buy')">{{ buys.approvingCount }}</span>
              </div>
              <div class="legend">
                <span class="icon" style="background: #4A90E2;" />
                <span class="label">采购中</span>
                <span class="value link-type" @click="toContractList([6],'buy')">{{ buys.buyingCount }}</span>
              </div>
              <div class="legend">
                <span class="icon" style="background: #67C23A;" />
                <span class="label">已完成</span>
                <span class="value link-type" @click="toContractList([4],'buy')">{{ buys.completeCount }}</span>
              </div>
              <div class="legend">
                <span class="icon" style="background: #F56C6C;" />
                <span class="label">已取消</span>
                <span class="value link-type" @click="toContractList([2],'buy')">{{ buys.stopCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <div class="wrapper-title">领用记录</div>
          <div class="chart2">
            <bar-chart :source="getUse" />
            <div style="margin-left: 30px;">
              <div class="legend">
                <span class="icon" style="background: #909399;" />
                <span class="label">未通过</span>
                <span class="value link-type" @click="toContractList([3],'out-store')">{{ getUse.refuseCount }}</span>
              </div>
              <div class="legend">
                <span class="icon" style="background: #E6A23C;" />
                <span class="label">审核中</span>
                <span class="value link-type" @click="toContractList([1],'out-store')">{{ getUse.approvingCount }}</span>
              </div>
              <div class="legend">
                <span class="icon" style="background: #4A90E2;" />
                <span class="label">已退回</span>
                <span class="value link-type" @click="toContractList([5],'out-store')">{{ getUse.backCount }}</span>
              </div>
              <div class="legend">
                <span class="icon" style="background: #67C23A;" />
                <span class="label">已领用</span>
                <span class="value link-type" @click="toContractList([4],'out-store')">{{ getUse.completeCount }}</span>
              </div>
              <div class="legend">
                <span class="icon" style="background: #F56C6C;" />
                <span class="label">已取消</span>
                <span class="value link-type" @click="toContractList([0],'out-store')">{{ getUse.cancelCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="container-line-title">
      <span class="detail-subtitle">待办与我的</span>
    </div>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="12" :lg="6">
        <div v-if="contracts.pending" class="list-wrapper">
          <span class="wrapper-title">待办项目({{ contracts.pending.length }})</span>
          <span class="wrapper-title-right" @click="toContractList([1],'constract',true)">更多<svg-icon icon-class="right-arrow" /></span>
          <div v-if="contracts.pending.length === 0" class="tabel-item">
            <div class="label" style="color: #909399;">没有待办项目</div>
          </div>
          <div v-for="(item,index) in contracts.pending.slice(0,5)" :key="index" class="tabel-item">
            <div class="link-type label ellipsis" @click="$router.push(`/contract-manager/contract-detail?id=${item.id}`)">{{ item.name }}</div>
            <div class="date">{{ item.createTime | parseTime('{y}-{m}-{d}') }}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div v-if="tasks.pending" class="list-wrapper">
          <span class="wrapper-title">待办任务({{ tasks.pending.length }})</span>
          <span class="wrapper-title-right" @click="toContractList([1],'task',true)">更多<svg-icon icon-class="right-arrow" /></span>
          <div v-if="tasks.pending.length === 0" class="tabel-item">
            <div class="label" style="color: #909399;">没有待办任务</div>
          </div>
          <div v-for="(item,index) in tasks.pending.slice(0,5)" :key="index" class="tabel-item">
            <div class="link-type label ellipsis" @click="$router.push(`/contract-manager/task-detail?id=${item.id}`)">{{ item.name }}</div>
            <div class="date">{{ item.createTime | parseTime('{y}-{m}-{d}') }}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="list-wrapper">
          <span class="wrapper-title">我的审批({{ approvingTotal }})</span>
          <span class="wrapper-title-right" @click="$router.push('/await-approve')">更多<svg-icon icon-class="right-arrow" /></span>
          <div v-if="approving.length === 0" class="tabel-item">
            <div class="label" style="color: #909399;">没有待审批内容</div>
          </div>
          <div v-for="(item,index) in approving" :key="index" class="tabel-item">
            <div v-if="item.code === 'ly'" :class="{ dotGray: item.status === 0, dotRed: item.status === 3, dotYellow: item.status === 1, dotGreen: item.status === 4, dotBlue: item.status === 5 }" />
            <div v-if="item.code === 'cg'" :class="{ dotGray: item.status === 7, dotRed: item.status === 3||item.status === 2, dotYellow: item.status === 5, dotBlue: item.status === 6, dotGreen: item.status === 4 }" />
            <div v-if="item.code === 'cg'" class="label ellipsis">【采购】 {{ item.name }}</div>
            <div v-if="item.code === 'ly'" class="label ellipsis" style="word-break: break-world;">【领用】 {{ item.name }}</div>
            <div class="date">{{ item.createTime | parseTime('{y}-{m}-{d}') }}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="list-wrapper">
          <span class="wrapper-title">我发起的({{ myCreateTotal }})</span>
          <span class="wrapper-title-right" @click="$router.push('/my-create')">更多<svg-icon icon-class="right-arrow" /></span>
          <div v-if="myCreate.length === 0" class="tabel-item">
            <div class="label" style="color: #909399;">没有发起</div>
          </div>
          <div v-for="(item,index) in myCreate" :key="index" class="tabel-item">
            <div v-if="item.code === 'ly'" :class="{ dotGray: item.status === 0, dotRed: item.status === 3, dotYellow: item.status === 1, dotGreen: item.status === 4 }" />
            <div v-if="item.code === 'cg'" :class="{ dotGray: item.status === 7, dotRed: item.status === 3||item.status === 2, dotYellow: item.status === 5, dotBlue: item.status === 6, dotGreen: item.status === 4 }" />
            <div v-if="item.code === 'cg'" class="label ellipsis">采购申请</div>
            <div v-if="item.code === 'ly'" class="label ellipsis">领用申请</div>
            <div class="date">{{ item.createTime | parseTime('{y}-{m}-{d}') }}</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div v-if="showIniteJoin" style="position: fixed; right: 80px; bottom: 80px;cursor: pointer;">
      <svg-icon icon-class="close" style="position: absolute;right: 0px;" @click="showIniteJoin = false" />
      <img src="@/assets/image/initejoin.png" width="100px;" height="90px;" @click="invite">
    </div>
  </div>
</template>

<script>
import BarChart from '@/views/dashboard/components/BarChart'
import { getIndexData, getPending, getCreate, getDeptMember } from '@/api/user'
import { mapState } from 'vuex'

export default {
  name: 'Ylabcontract',
  components: {
    BarChart
  },
  data() {
    return {
      contracts: {},
      tasks: {},
      buys: {},
      getUse: {},
      myCreate: [],
      approving: [],
      approvingTotal: 0,
      myCreateTotal: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 5,
        status: 1
      },
      showIniteJoin: true,
      total: null
    }
  },
  computed: {
    ...mapState({
      curId: state => state.user.id
    })
  },
  mounted() {
    this.initData()
  },
  methods: {
    toContractList(arr, type, awaitDo) {
      if (awaitDo) { sessionStorage.setItem('curId', this.curId) }
      sessionStorage.setItem('statuses', JSON.stringify(arr))
      if (type === 'constract') {
        this.$router.push('/contract-manager/contract-list')
      } else if (type === 'task') {
        this.$router.push('/contract-manager/task-list')
      } else if (type === 'buy') {
        this.$router.push('/purchase-manager/purchase-list')
      } else if (type === 'out-store') {
        this.$router.push('/store-manager/receive-list')
      }
    },
    async initData() {
      const result = await getIndexData()
      if (result.code === 200) {
        const { contracts, tasks, buys, getUse } = result.data
        this.contracts = contracts
        this.tasks = tasks
        this.buys = buys
        this.getUse = getUse
      }
      const result1 = await getPending(this.listQuery)
      if (result1.code === 200) {
        this.approving = result1.data.list
        this.approvingTotal = result1.data.total
      }
      const result2 = await getCreate(this.listQuery)
      if (result2.code === 200) {
        this.myCreate = result2.data.list
        this.myCreateTotal = result2.data.total
      }
    },
    async invite() {
      await getDeptMember({ pageNo: 1, pageSize: 20 }).then(res => {
        this.total = res.data.total
      })
      if (this.total > 50) {
        this.$store.state.user.inviteLimitDialog = true
      } else {
        this.$store.state.user.inviteDialog = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .chart-wrapper {
    background-color: #fff;
    margin-bottom: 32px;
  }

  .chart {
    height: 166px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 8px 8px 24px 8px;
  }

  .chart2 {
    height: 166px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 8px 30px 24px 26px;
  }

  .wrapper-title {
    font-size:14px;
    font-weight: bold;
    height: 46px;
    line-height: 46px;
    padding: 0 24px;
  }
  .wrapper-title-right {
    cursor: pointer;
    font-size:14px;
    font-weight: bold;
    height: 46px;
    line-height: 46px;
    padding: 0 24px;
    float: right;
  }
  .wrapper-title-right:hover {
    color: #4A90E2;
  }

  .legend {
    margin-bottom: 16px;
    height: 14px;
    line-height: 14px;

    .icon {
      width: 14px;
      height: 14px;
      vertical-align: middle;
    }
    .label {
      margin-left: 12px;
      font-size: 12px;
    }
    .value {
      margin-left: 4px;
      font-size: 14px;
      color: #1A4FA1;
    }
  }

  .legend:last-child {
    margin-bottom: 0;
  }

  .list-wrapper {
    min-height: 276px;
    background-color: #fff;
    margin-bottom: 32px;
  }

  .tabel-item {
    display: flex;
    align-items: center;
    height: 46px;
    border-top: 1px solid #E4E7ED;
    padding: 0 24px;
    font-size: 14px;

    .label {
      flex-grow: 1;
    }
    .date {
      flex: 0 0 74px;
    }
  }

  .colorGrey{
    color: #909399;
  }
  .dotGreen{
    flex: none;
    width:10px;
    height:10px;
    background:rgba(103,194,58,1);
    border-radius: 50%;
    margin-right: 10px;
    margin-top: 3px;
  }
  .dotYellow{
    flex: none;
    width:10px;
    height:10px;
    background:rgba(230,162,60,1);
    border-radius: 50%;
    margin-right: 10px;
    margin-top: 3px;
  }
  .dotBlue{
    flex: none;
    width:10px;
    height:10px;
    background:#4A90E2;
    border-radius: 50%;
    margin-right: 10px;
    margin-top: 3px;
  }
  .dotGray{
    flex: none;
    width:10px;
    height:10px;
    background:rgba(144,147,153,1);
    border-radius: 50%;
    margin-right: 10px;
    margin-top: 3px;
  }
  .dotRed{
    flex: none;
    width:10px;
    height:10px;
    background:rgba(245,108,108,1);
    border-radius: 50%;
    margin-right: 10px;
    margin-top: 3px;
  }
  .alignCenter{
    position:absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
</style>
