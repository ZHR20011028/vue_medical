<template>
  <div class="patient-container">
    <div class="dialog-div">
      <el-dialog
        title="患者诊断信息"
        :visible.sync="dialogVisible"
        width="600px"
      >
        <el-descriptions
          v-for="item in this.diagnosisResultData"
          :key="item.index"
          :title="item.createTime"
          :column="4"
          border
        >
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              姓名
            </template>
            {{ item.patientName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i :class="genderIcon"></i>
              性别
            </template>
            {{ item.patientGender }}
          </el-descriptions-item>
          <el-descriptions-item span="2">
            <template slot="label">
              <i class="el-icon-date"></i>
              出生日期
            </template>
            {{ item.patientBirthday }}
          </el-descriptions-item>
          <el-descriptions-item span="2">
            <template slot="label">
              <i class="el-icon-s-home"></i>
              科室
            </template>
            {{ item.deptName }}
          </el-descriptions-item>
          <el-descriptions-item span="2">
            <template slot="label">
              <i class="el-icon-s-custom"></i>
              医生
            </template>
            {{ item.doctorName }}
          </el-descriptions-item>
          <el-descriptions-item label="症状描述" span="4">{{
            item.symptomDesc
          }}</el-descriptions-item>
          <el-descriptions-item label="症状意见" span="4">{{
            item.symptomIdea
          }}</el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </div>
    <div class="patient-header">
      <el-button
        size="medium"
        icon="el-icon-refresh-left"
        type="primary"
        @click="refresh"
      ></el-button>
      <div class="search">
        <el-form :model="searchForm">
          <!-- <el-input
          size="medium"
          v-model="searchForm.search"
          placeholder="请输入患者姓名"
          style="width: 450px"
        ></el-input> -->
          <el-select
            style="width: 500px"
            size="medium"
            v-model="searchForm.value"
            filterable
            remote
            placeholder="请输入姓名/身份证号"
            :remote-method="remoteMethod"
            :loading="searchForm.loading"
          >
            <el-option
              v-for="item in searchForm.options"
              :key="item.patientId"
              :label="item.label"
              :value="item.patientId"
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
    </div>
    <el-card>
      <el-table
        border
        :data="patientData"
        height="430"
        header-cell-class-name="my-header"
        stripe
      >
        <el-table-column prop="patientName" label="姓名" width="80px">
        </el-table-column>
        <el-table-column prop="patientGender" label="性别" width="50px">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" width="170px">
        </el-table-column>
        <el-table-column prop="patientBirthday" label="出生年月" width="100px">
        </el-table-column>
        <el-table-column prop="patientTelephone" label="电话" width="150px">
        </el-table-column>
        <el-table-column prop="address" label="地址" width="450px">
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button
              @click="selectHandle(scope.row)"
              type="primary"
              size="small"
              >查看诊断</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="block">
      <el-pagination
        background
        :page-size="pageSize"
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
  getPagePatient,
  getPatientByPatientId,
  getAllDiagnosisByPatientId,
  getPatientByLike,
} from "@/api/patientApi";
export default {
  data() {
    return {
      patientData: [],
      searchForm: {
        value: "",
        options: [],
        loading: false,
      },
      diagnosisResultData: [],
      pageSize: 20,
      total: 0,
      dialogVisible: false,
      genderIcon: "el-icon-male",
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
      getPagePatient({
        current: val.toString(),
        size: this.pageSize.toString(),
      }).then((data) => {
        if (data.data.code === 20041) {
          this.total = data.data.data.total;
          this.patientData = data.data.data.patientData;
        }
      });
    },
    searchHandle() {
      getPatientByPatientId({ patientId: this.searchForm.value }).then(
        (data) => {
          if (data.data.code === 20041) {
            this.patientData = [data.data.data];
          } else if (data.data.code === 20040) {
            this.$message.warning("搜索失败!");
            this.handleCurrentChange(1);
          } else {
            this.$message.error("请求超时，请稍后再试！");
          }
        }
      );
    },
    remoteMethod(query) {
      let flag = /^\d/.test(query);
      if (query !== "") {
        this.searchForm.loading = true;
        setTimeout(() => {
          this.searchForm.loading = false;
          getPatientByLike({ patient: query }).then((data) => {
            if (data.data.code === 20041) {
              this.searchForm.options = data.data.data.map((item) => {
                let patientNameOrId = {};
                if (flag) {
                  patientNameOrId["label"] = item.idCard;
                } else {
                  patientNameOrId["label"] = item.patientName;
                }
                return {
                  patientId: item.patientId.toString(),
                  ...patientNameOrId,
                };
              });
            }
          });
        }, 200);
      } else {
        this.searchForm.options = [];
      }
    },
    selectHandle(row) {
      getAllDiagnosisByPatientId({ patientId: row.patientId.toString() }).then(
        (data) => {
          if (data.data.code === 20041) {
            this.diagnosisResultData = data.data.data.map((item) => {
              this.genderIcon =
                item.patientGender === "男" ? "el-icon-male" : "el-icon-female";
              item.createTime = "诊断日期：" + item.createTime;
              return item;
            });
            this.dialogVisible = true;
          } else if (data.data.code === 20040) {
            this.$message.warning("此患者被诊断！");
          } else {
            this.$message.error("请求超时，请稍后重试！");
          }
        }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.patient-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .patient-header {
    margin-top: 20px;
    margin-bottom: 10px;
    width: 1100px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .search {
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
    width: 1150px;
    height: 475px;
    .el-table {
      /deep/ .my-header {
        background-color: #d9edf7;
        color: black;
        text-align: center;
      }
    }
  }
  .block {
    margin-top: 15px;
  }
}
</style>
