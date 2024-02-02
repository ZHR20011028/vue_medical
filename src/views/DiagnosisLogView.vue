<template>
  <div class="diagnosisLog-container">
    <div class="diagnosisLog-header">
      <el-button
        size="medium"
        icon="el-icon-refresh-left"
        type="primary"
        @click="refresh"
      ></el-button>
      <el-form :model="searchForm">
        <el-select
          style="width: 300px"
          size="medium"
          v-model="searchForm.value"
          filterable
          remote
          placeholder="请输入医生"
          :remote-method="remoteMethod"
          :loading="searchForm.loading"
        >
          <el-option
            v-for="item in searchForm.options"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
        <el-button
          size="medium"
          icon="el-icon-search"
          type="primary"
          @click="searchHandle"
          >搜索</el-button
        >
      </el-form>
    </div>
    <el-card>
      <el-table
        :data="diagnosisLogData"
        border
        height="410"
        header-cell-class-name="my-header"
        stripe
      >
        <el-table-column prop="doctorId" label="医生工号"> </el-table-column>
        <el-table-column prop="doctorName" label="医生"> </el-table-column>
        <el-table-column prop="logContent" label="内容"> </el-table-column>
        <el-table-column prop="createTime" label="时间"> </el-table-column>
      </el-table>
    </el-card>
    <div class="block">
      <el-pagination
        background
        :page-size="size"
        :current-page.sync="currentPage"
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {
  getPageDiagnosisLog,
  getDiagnosisLogByDoctorName,
} from "@/api/diagnosisLogApi";
import { getLikeDoctorByDoctorName } from "@/api/doctorApi";
export default {
  data() {
    return {
      searchForm: {
        value: "",
        options: [],
        loading: false,
      },
      size: 20,
      currentPage: 1,
      total: 20,
      diagnosisLogData: [],
    };
  },
  mounted() {
    this.handleCurrentChange(1);
  },
  methods: {
    refresh() {
      this.handleCurrentChange(1);
      this.searchForm.value = "";
      this.searchForm.options = [];
    },
    remoteMethod(query) {
      if (query !== "") {
        this.searchForm.loading = true;
        setTimeout(() => {
          this.searchForm.loading = false;
          getLikeDoctorByDoctorName({ doctorName: query }).then((data) => {
            this.searchForm.options = data.data.data.map((item) => {
              return {
                label: item.doctorName,
                value: item.doctorId.toString(),
              };
            });
          });
        }, 200);
      } else {
        this.searchForm.options = [];
      }
    },
    searchHandle() {
      getDiagnosisLogByDoctorName({ doctorName: this.searchForm.value }).then(
        (data) => {
          if (data.data.code === 20041) {
            this.diagnosisLogData = data.data.data;
          }
        }
      );
    },
    handleCurrentChange(val) {
      getPageDiagnosisLog({ current: val, pageSize: this.size })
        .then((data) => {
          if (data.data.code === 20041) {
            this.diagnosisLogData = data.data.data.diagnosisLogData;
            this.total = data.data.data.total;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.diagnosisLog-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .diagnosisLog-header {
    width: 800px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .el-form {
      .el-select {
        /deep/ .el-input__inner {
          cursor: text;
        }
      }
    }
  }
  .el-card {
    margin-top: 15px;
    width: 850px;
    height: 450px;
    .el-table {
      /deep/ .my-header {
        background-color: #d9edf7;
        color: black;
        text-align: center;
      }
      /deep/ .el-table__cell {
        padding: 0;
        height: 35px;
      }
    }
  }
  .block {
    margin-top: 15px;
  }
}
</style>
