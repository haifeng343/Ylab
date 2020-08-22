<template>
  <div class="app-container" style="background-color: #F6F7FB; min-height: calc(100vh - 84px);">
    <div v-if="list.length" style="display:flex; justify-content: center;">
      <el-radio-group v-model="tabPosition" class="topBtn">
        <el-radio-button label="Ylab项目" />
        <el-radio-button label="合作项目" />
      </el-radio-group>
    </div>
    <Ylabcontract v-if="tabPosition === 'Ylab项目'" />
    <JoinContract v-else-if="tabPosition === '合作项目'" />
  </div>
</template>

<script>
import Ylabcontract from '@/pages/standard/views/dashboard/components/Ylabcontract'
import JoinContract from '@/views/dashboard/components/JoinContract'
import { getJoinContract } from '@/api/user'
export default {
  name: 'Dashboard',
  components: {
    Ylabcontract,
    JoinContract
  },
  data() {
    return {
      tabPosition: 'Ylab项目',
      list: [],
      listQuery: {
        pageNo: 1,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const result = await getJoinContract(this.listQuery)
      if (result.code === 200) {
        this.list = result.data
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.topBtn{
  margin:10px 0;
}
>>>.el-radio-button__inner{
  background:rgba(228,231,237,1);
}
>>>.el-radio-button--small .el-radio-button__inner{
  font-size: 16px;
  font-weight: 700;
}
>>>.el-radio-button__orig-radio:checked+.el-radio-button__inner{
  border-radius: 4px;
}
</style>
