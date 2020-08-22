<template>
  <div style="margin-top: 68px;">
    <div class="model">
      <el-row class="website">
        <el-col :sm="9" :xs="24">
          <div class="ylabCloud">专业实验室</div>
          <div class="ylabCloud1">囊括生物医药科学最全类型实验室平台，一键直播实时观看平台真实场景。</div>
        </el-col>
        <el-col :sm="1" />
        <el-col :sm="14" :xs="24">
          <img src="@/assets/lab/lab.png" style="width: 100%;">
        </el-col>
      </el-row>
    </div>
    <sticky :sticky-top="56">
      <div class="hidden-xs-only" style="width: 100%; height: 84px; background-color: #EDF4FD; display: flex; align-items: center;">
        <div style="display: flex; flex-wrap: wrap; width: 1200px; font-size: 16px; margin: 0 auto; padding: 0 16px;">
          <div class="type-tab-head" style="margin-right: 30px;">类型</div>
          <div
            :class="activedType === 'all' ? 'type-tab-actived' : 'type-tab'"
            @click="changeType('all')"
          >
            全部
          </div>
          <div
            v-for="type in typeList"
            :key="type.id"
            :class="activedType === type.id ? 'type-tab-actived' : 'type-tab'"
            style="margin-left: 10px;"
            @click="changeType(type.id)"
          >
            {{ type.name }}
          </div>
        </div>
      </div>
      <div id="labType" class="hidden-sm-and-up" style="width: 100%; height: 168px; background-color: #EDF4FD; display: flex; align-items: center;">
        <div style="display: flex; flex-wrap: wrap; width: 1200px; font-size: 16px; margin: 0 auto; padding: 0 16px;">
          <el-row class="website" style="width: 100%;">
            <el-col :sm="2" :xs="4">
              <div class="type-tab-head">类型</div>
            </el-col>
            <el-col :sm="22" :xs="20">
              <el-row class="website">
                <el-col
                  :xs="12"
                >
                  <div><span :class="activedType === 'all' ? 'type-tab-actived' : 'type-tab'" @click="changeType('all')">全部</span></div>
                </el-col>
                <el-col
                  v-for="type in typeList"
                  :key="type.id"
                  :xs="12"
                >
                  <div><span :class="activedType === type.id ? 'type-tab-actived' : 'type-tab'" @click="changeType(type.id)">{{ type.name }}</span></div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
    </sticky>
    <div style="width: 100%; max-width: 1200px; margin: 20px auto 150px auto; padding: 0 16px;">
      <el-row :gutter="39">
        <el-col v-for="lab in labList" :key="lab.id" :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px;"
            shadow="always"
            @click.native="$router.push(`/lab-detail?id=${lab.id}`)"
          >
            <img :src="lab.pics" style="width: 100%;">
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">{{ lab.name }}</div>
            <div style="font-size: 16px; color: #4A90E2; margin-top: 16px;">{{ lab.typeName }}</div>
            <div style="font-size: 14px; color: #37383A; line-height: 22px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; margin-top: 12px;">{{ lab.description }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { labType, labList } from '@/api/lab'
export default {
  name: 'Lab',
  components: { Sticky },
  data() {
    return {
      typeList: [],
      labList: [],
      activedType: 'all'
    }
  },
  created() {
    this.$emit('changeTable', 'lab')
    labType().then(res => {
      this.typeList = res.data.list
    })
    this.queryLabList()
  },
  mounted() {
    if (this.$route.query.position) {
      this.$el.querySelector(this.$route.query.position).scrollIntoView()
    }
  },
  methods: {
    changeType(typeId) {
      this.activedType = typeId
      this.queryLabList()
    },
    queryLabList() {
      let query
      if (this.activedType === 'all') {
        query = { pageNo: 1, pageSize: 1000 }
      } else {
        query = { pageNo: 1, pageSize: 1000, typeId: this.activedType }
      }
      labList(query).then(res => {
        this.labList = res.data.list
      })
    }
  }
}
</script>

<style scoped>
.type-tab-head {
  /* margin-right: 22px; */
  height: 30px;
  line-height: 30px;
  color: #909399;
}
.type-tab {
  /* margin: 0 14px; */
  height: 30px;
  line-height: 30px;
  padding: 0 8px;
  color: #303133;
  cursor: pointer;
}
.type-tab:hover {
  color: #4A90E2;
}
.type-tab-actived {
  /* margin: 0 14px; */
  border-radius:4px;
  height: 30px;
  line-height: 30px;
  padding: 0 8px;
  color: #4A90E2;
  cursor: pointer;
  background-color: rgba(74,144,226,0.2);
}
</style>

<style>
.lab-card .el-card__body {
  padding: 16px;
}
</style>
