<template>
  <div>
    <el-table :data="registerData" style="width: 100%">
      <el-table-column prop="deptName" label="科室"> </el-table-column>
      <el-table-column prop="deptLocation" label="科室地址"> </el-table-column>
      <el-table-column prop="deptTelephone" label="科室电话"> </el-table-column>
      <el-table-column prop="patientCount" label="待诊人数"> </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >挂号</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getRegisters } from "@/api";
export default {
  data() {
    return {
      registerData: [],
    };
  },
  mounted() {
    this.getRegistered();
  },
  methods: {
    getRegistered() {
      getRegisters().then((data) => {
        this.registerData = data.data.data;
        console.log(data.data.data);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-table {
  margin-bottom: 30px;
}
</style>
