<template>
  <div class="register-container">
    <div class="registered-header">
      <el-button
        size="medium"
        icon="el-icon-refresh-left"
        type="primary"
        @click="refresh"
      ></el-button>
      <div class="search">
        <el-form :model="searchForm">
          <!-- <el-input
          v-model="searchForm.deptName"
          size="medium"
          placeholder="请输入要挂号的科室"
        ></el-input> -->
          <el-select
            style="width: 100%"
            size="medium"
            v-model="searchForm.value"
            filterable
            remote
            placeholder="请输入科室名称"
            :remote-method="remoteMethod"
            :loading="searchForm.loading"
          >
            <el-option
              v-for="item in searchForm.options"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
            >
            </el-option>
          </el-select>
          <el-button
            size="medium"
            type="primary"
            icon="el-icon-search"
            @click="searchDept"
            >搜索</el-button
          >
        </el-form>
      </div>
    </div>
    <el-card>
      <el-table
        border
        height="450"
        v-loading="loading"
        :data="registerData"
        header-cell-class-name="my-header"
        style="min-width: 1000px"
        stripe
      >
        <el-table-column prop="deptName" label="科室"> </el-table-column>
        <el-table-column prop="deptLocation" label="科室地址">
        </el-table-column>
        <el-table-column prop="deptTelephone" label="科室电话">
        </el-table-column>
        <el-table-column label="待诊人数">
          <template slot-scope="scope">
            {{
              scope.row.patientCount === null ? 0 : scope.row.patientCount
            }}</template
          >
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="handleRegister(scope.row)"
              type="info"
              size="small"
              icon="el-icon-circle-plus-outline"
              :disabled="scope.row.disabled"
              >挂号</el-button
            >
            <el-button
              @click="handleClose(scope.row)"
              type="info"
              size="small"
              icon="el-icon-circle-close"
              :disabled="!scope.row.disabled"
              >取消挂号</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import {
  getRegisters,
  getRegisterOne,
  addRegisters,
  removeRegisters,
  getRegisterByDeptId,
} from "@/api/registerApi";
import { getLikeDept, getDeptByDeptId } from "@/api/deptApi";
import json_parse from "json-bigint/lib/parse";
export default {
  data() {
    return {
      patientId: "",
      registerData: [],
      searchForm: {
        value: "",
        options: [],
        loading: false,
      },
      loading: false,
    };
  },
  mounted() {
    if (JSON.parse(localStorage.getItem("patientData")) !== null) {
      this.patientId = JSON.parse(
        localStorage.getItem("patientData")
      ).patientId.toString();
    }
    this.getRegistered();
    this.loading = true;
    let _this = this;
    setTimeout(() => {
      _this.loading = false;
    }, 3000);
  },
  methods: {
    refresh() {
      this.getRegistered();
      this.searchForm.value = "";
      this.searchForm.options = [];
      this.loading = true;
      let _this = this;
      setTimeout(() => {
        _this.loading = false;
      }, 1500);
    },
    // 返回挂号的信息
    async getRegistered() {
      let deptId = "";
      try {
        const deptData = await getRegisterOne(this.patientId);
        if (deptData.data.code === 20041) {
          deptId = deptData.data.data.deptId.toString();
        }
      } catch (error) {
        console.log(error);
      }
      getRegisters().then((data) => {
        //增加一个disabled属性来控制每一个button
        this.registerData = data.data.data.map((item) => {
          if (deptId === item.deptId.toString()) {
            return (item = { disabled: true, ...item });
          } else {
            return (item = { disabled: false, ...item });
          }
        });
      });
    },
    // 挂号
    handleRegister(row) {
      const register = {
        deptId: row["deptId"].toString(),
        //登录患者的id，在cookie中获得
        patientId: this.patientId,
        deptRank: Number(row["patientCount"]) + 1,
      };
      addRegisters(register).then((data) => {
        if (data.data.code === 20011) {
          this.getRegistered();
          this.loading = true;
          let _this = this;
          setTimeout(() => {
            _this.loading = false;
            _this.$notify({
              title: "挂号成功!",
              message: "你为" + register.deptRank + "号，请等待叫号！",
              type: "success",
            });
          }, 2000);
        } else if (data.data.code === 20010) {
          this.$notify({
            title: "挂号失败！",
            message: "请查看是否已经挂号，或者请医生帮助！",
            type: "warning",
          });
        } else if (data.data.code === 59999) {
          this.$message.error("系统繁忙，请稍后再试");
        }
      });
    },
    //取消挂号
    handleClose(row) {
      const register = {
        deptId: row["deptId"].toString(),
        //登录患者的id，在cookie中获得
        patientId: this.patientId,
      };
      removeRegisters(register).then((data) => {
        if (data.data.code === 20021) {
          this.getRegistered();
          this.loading = true;
          let _this = this;
          setTimeout(() => {
            _this.loading = false;
            _this.$notify({
              title: "取消挂号成功!",
              type: "success",
            });
          }, 2000);
        } else if (data.data.code === 20020) {
          this.$notify({
            title: "取消挂号失败！",
            message: "请稍后再试！",
            type: "warning",
          });
        } else if (data.data.code === 59999) {
          this.$message.error("系统繁忙，请稍后再试");
        }
      });
    },
    async searchDept() {
      let dept = "";
      let is_get = false;
      try {
        const deptData = await getDeptByDeptId({
          deptId: this.searchForm.value,
        });
        if (deptData.data.code === 20041) {
          dept = deptData.data.data.deptId.toString();
          is_get = true;
        } else {
          is_get = false;
        }
        const registeredData = await getRegisterByDeptId({ deptId: dept });
        this.registerData = [];
        this.registerData.push(registeredData.data.data);
      } catch (error) {
        console.log(error);
      }
      this.loading = true;
      let _this = this;
      setTimeout(() => {
        if (is_get) {
          this.$message.success("搜素成功！");
        } else {
          this.$message.warning("搜索失败!，未找到该科室");
          this.getRegistered();
        }
        _this.loading = false;
      }, 2000);
    },
    remoteMethod(query) {
      if (query !== "") {
        this.searchForm.loading = true;
        setTimeout(() => {
          this.searchForm.loading = false;
          getLikeDept({ deptLikeName: query }).then((data) => {
            if (data.data.code === 20041) {
              this.searchForm.options = data.data.data.map((item) => {
                return {
                  deptId: item.deptId.toString(),
                  deptName: item.deptName,
                };
              });
            }
          });
        }, 200);
      } else {
        this.searchForm.options = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.register-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  .registered-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 30px;
    width: 1150px;
    .search {
      width: 700px;
      .el-form {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        .el-select {
          /deep/ .el-input__inner {
            cursor: text;
          }
        }
      }
    }
  }
  .el-card {
    width: 1200px;
    height: 500px;
    margin-top: 20px;
    .el-table {
      /deep/ .my-header {
        background-color: #d9edf7;
        color: black;
        text-align: center;
      }
    }
  }
}
</style>
