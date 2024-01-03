<template>
  <div class="register-container">
    <div class="search">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="">
          <el-input
            v-model="searchForm.deptName"
            placeholder="请输入要挂号的科室"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchDept">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      height="200"
      v-loading="loading"
      :data="registerData"
      style="min-width: 1000px"
    >
      <el-table-column prop="deptName" label="科室"> </el-table-column>
      <el-table-column prop="deptLocation" label="科室地址"> </el-table-column>
      <el-table-column prop="deptTelephone" label="科室电话"> </el-table-column>
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
import { getDeptByName } from "@/api/deptApi";
export default {
  data() {
    return {
      registerData: [],
      searchForm: {
        deptName: "",
      },
      loading: false,
    };
  },
  mounted() {
    this.getRegistered();
    this.loading = true;
    let _this = this;
    setTimeout(() => {
      _this.loading = false;
    }, 4000);
  },
  methods: {
    // 返回挂号的信息
    async getRegistered() {
      let deptId = "";
      try {
        const deptData = await getRegisterOne(111);
        if (deptData.data.code === 20041) {
          deptId = deptData.data.data.deptId;
        }
      } catch (error) {
        console.log(error);
      }
      getRegisters().then((data) => {
        //增加一个disabled属性来控制每一个button
        this.registerData = data.data.data.map((item) => {
          if (deptId === item.deptId) {
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
        deptId: row["deptId"],
        doctorId: row["doctorId"],
        //登录患者的id，在cookie中获得
        patientId: "111",
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
              title: "成功",
              message: "挂号成功!",
              type: "success",
            });
          }, 2000);
        } else if (data.data.code === 20010) {
          this.$notify({
            title: "失败",
            message: "挂号失败！",
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
        deptId: row["deptId"],
        doctorId: row["doctorId"],
        //登录患者的id，在cookie中获得
        patientId: "111",
      };
      removeRegisters(register).then((data) => {
        if (data.data.code === 20021) {
          this.getRegistered();
          this.loading = true;
          let _this = this;
          setTimeout(() => {
            _this.loading = false;
            _this.$notify({
              title: "成功",
              message: "取消挂号成功!",
              type: "success",
            });
          }, 2000);
        } else if (data.data.code === 20020) {
          this.$notify({
            title: "失败",
            message: "取消挂号失败！",
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
        const deptData = await getDeptByName(this.searchForm);
        if (deptData.data.code === 20041) {
          dept = deptData.data.data.deptId;
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
  },
};
</script>

<style lang="scss" scoped>
.register-container {
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 30px;
  padding-top: 20px;
}
</style>
