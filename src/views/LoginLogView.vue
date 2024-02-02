<template>
  <div class="login-log-container">
    <div class="login-log-header">
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
          placeholder="请输入账号"
          :remote-method="remoteMethod"
          :loading="searchForm.loading"
        >
          <el-option
            v-for="item in searchForm.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
        :data="loginLogData"
        border
        height="410"
        header-cell-class-name="my-header"
        stripe
      >
        <el-table-column prop="username" label="账号"> </el-table-column>
        <el-table-column prop="operator" label="操作人"> </el-table-column>
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
  getPageLoginLog,
  getLikeLoginByUsername,
  getLoginByUsername,
} from "@/api/loginLogApi";
export default {
  data() {
    return {
      loginLogData: [],
      searchForm: {
        value: "",
        options: [],
        loading: false,
      },
      size: 20,
      currentPage: 1,
      total: 20,
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
    handleCurrentChange(val) {
      getPageLoginLog({ current: val, pageSize: this.size })
        .then((data) => {
          if (data.data.code === 20041) {
            this.total = data.data.data.total;
            this.loginLogData = data.data.data.loginLogData;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.searchForm.loading = true;
        setTimeout(() => {
          this.searchForm.loading = false;
          getLikeLoginByUsername({ username: query })
            .then((data) => {
              if (data.data.code === 20041) {
                this.searchForm.options = data.data.data.map((item) => {
                  return {
                    label: item.username,
                    value: item.username,
                  };
                });
              }
            })
            .catch((error) => {
              this.$message.error(error);
            });
        }, 200);
      } else {
        this.searchForm.options = [];
      }
    },
    searchHandle() {
      getLoginByUsername({ username: this.searchForm.value })
        .then((data) => {
          if (data.data.code) {
            this.loginLogData = data.data.data;
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
.login-log-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .login-log-header {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    width: 800px;
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
