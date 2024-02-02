<template>
  <el-container>
    <el-row class="row_container">
      <el-col :span="24" class="main_display">
        <h1>欢迎使用医院分诊管理系统</h1>
        <p>这里是系统简介</p>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      justify="space-between"
      class="row_card"
      style="min-width: 1288px"
    >
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>值班表</span>
          </div>
          <div class="body">
            <el-table
              :data="workData"
              height="180"
              :row-style="{ height: '0' }"
              :cell-style="{ padding: '0' }"
              stripe
              :header-row-style="{ color: 'black' }"
            >
              <el-table-column prop="deptName" label="科室"> </el-table-column>
              <el-table-column prop="doctorName" label="值班医生">
              </el-table-column>
              <el-table-column prop="doctorTelephone" label="联系方式">
              </el-table-column>
            </el-table>
          </div>
          <div class="footer" style="text-align: right">{{ getDate }}</div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>通知</span>
          </div>
          <div class="body">
            <el-table
              :data="noticeData"
              height="180"
              :row-style="{ height: '0' }"
              :cell-style="{ padding: '0' }"
              stripe
              :header-row-style="{ color: 'black' }"
            >
              <el-table-column prop="deptName" label="科室"> </el-table-column>
              <el-table-column prop="notice" label="通知"> </el-table-column>
              <el-table-column prop="deptLocation" label="地址">
              </el-table-column>
            </el-table>
          </div>
          <div class="footer" style="text-align: right">{{ getDate }}</div>
        </el-card>
      </el-col>
    </el-row>
  </el-container>
</template>
<script>
import { getAllWork, getAllNotice } from "@/api";
export default {
  data() {
    return {
      workData: [],
      noticeData: [],
    };
  },
  mounted() {
    this.getAllDoctorWorks();
    this.getAllNotices();
  },
  methods: {
    getAllDoctorWorks() {
      getAllWork().then((data) => {
        this.workData = data.data.data;
      });
    },
    getAllNotices() {
      getAllNotice().then((data) => {
        if (data.data.code === 20041) {
          this.noticeData = data.data.data.map((item) => {
            return {
              deptName: item.deptName,
              notice:
                "请" + item.deptRank + "号" + item.patientName + "到诊室！",
              deptLocation: item.deptLocation,
            };
          });
        }
      });
    },
  },
  computed: {
    getDate() {
      const time = new Date();
      let month = time.getMonth() + 1;
      return time.getFullYear() + "年" + month + "月" + time.getDate() + "日";
    },
  },
};
</script>

<style lang="scss" scoped>
.el-container {
  margin-top: 0;
  flex-direction: column;
  .row_container {
    width: 100%;
    padding: 35px 0;
    margin-bottom: 30px;
    color: inherit;
    background-color: #eee;
    .main_display {
      max-width: 100%;
      width: 1170px;
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
      h1 {
        font-size: 63px;
        color: inherit;
        margin-top: 20px;
        margin-bottom: 10px;
        font-family: inherit;
        font-weight: 500;
        line-height: 1.1;
        margin: 0.67em 0;
        white-space: nowrap;
      }
      p {
        margin-bottom: 15px;
        font-size: 21px;
        font-weight: 200;
        margin: 0 0 10px;
        display: block;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        white-space: nowrap;
      }
    }
  }
  .row_card {
    margin: 0 100px;
    margin-bottom: 30px;
    .box-card {
      width: 620px;
      margin: 0 15px;
      /deep/ .el-card__header {
        padding: 10px 20px;
        background-color: #d9edf7;
        .clearfix {
          color: #31708f;
        }
      }
      /deep/.el-card__body {
        padding: 0;
        .footer {
          background-color: #f5f5f5;
          padding: 10px 15px;
          border-top: 1px solid #ddd;
        }
      }
    }
  }
}
</style>
