<template>
  <div class="triage-container">
    <div class="dialog-div">
      <el-dialog
        title="诊断信息"
        :visible.sync="dialogVisible"
        width="40%"
        center
        :before-close="handleClose"
      >
        <el-form :model="formData" size="small" label-width="80px">
          <el-form-item label="患者姓名">
            <el-input
              v-model="formData.patientName"
              placeholder="请输入患者姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio v-model="formData.patientGender" label="男">男</el-radio>
            <el-radio v-model="formData.patientGender" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="出生日期">
            <el-input
              v-model="formData.patientBirthday"
              placeholder="请输入患者出生日期"
            ></el-input>
          </el-form-item>
          <el-form-item label="科室">
            <el-input
              v-model="formData.deptName"
              placeholder="请输入科室名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="医生">
            <el-input
              v-model="formData.doctorName"
              placeholder="请输入医生姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="症状描述">
            <el-input type="textarea" v-model="formData.symptomDesc"></el-input>
          </el-form-item>
          <el-form-item label="症状意见">
            <el-input type="textarea" v-model="formData.symptomIdea"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="info"
              icon="el-icon-circle-check"
              size="small"
              style="width: 180px; margin-left: 100px"
              @click="successHandle"
              >完成</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <el-card>
      <h1>科室患者信息 · {{ deptName }}</h1>
      <el-table
        border
        :data="triageData"
        height="470"
        style="min-width: 950px"
        header-cell-class-name="my-header"
        stripe
      >
        <el-table-column label="序号" prop="deptRank"></el-table-column>
        <el-table-column label="姓名" prop="patientName"></el-table-column>
        <el-table-column label="性别" prop="patientGender"></el-table-column>
        <el-table-column
          label="出生日期"
          prop="patientBirthday"
        ></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state === 1" style="color: #a94442"
              >待诊<i class="el-icon-question"></i>
            </span>
            <span v-else-if="scope.row.state === 2" style="color: #337ab7"
              >诊断中<i class="el-icon-loading"></i
            ></span>
            <span v-else style="color: #a94442"
              >诊断结束<i class="el-icon-success"></i
            ></span>
          </template>
        </el-table-column>
        <el-table-column min-width="130px" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="cellHandle(scope.row)"
              type="info"
              size="mini"
              :disabled="scope.row.state !== 1"
              >叫号<i class="el-icon-user-solid"></i
            ></el-button>
            <el-button
              type="primary"
              size="mini"
              @click="getDialogHandle(scope.row)"
              >诊断 <i class="el-icon-first-aid-kit"></i
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              :disabled="scope.row.state !== 2"
              @click="endHandle(scope.row)"
              >结束<i class="el-icon-success"></i
            ></el-button>
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
  getTriageCountByDeptId,
  getTriagePageByDeptId,
} from "@/api/deptTriageApi";
import { modifyRegisterState } from "@/api/registerApi";
import {
  getOneDiagnosisResult,
  addDiagnosisResult,
  modifyDiagnosisResult,
} from "@/api/DiagnosisResult";
import { addLog } from "@/api/logApi";
import moment from "moment";
import { getDeptByDeptId } from "@/api/deptApi";
export default {
  data() {
    return {
      formData: {
        patientId: "",
        doctorId: "",
        patientName: "",
        patientGender: "",
        patientBirthday: "",
        deptName: "",
        doctorName: "",
        symptomDesc: "",
        symptomIdea: "",
      },
      triageData: [],
      deptName: "骨科",
      pageSize: 20,
      total: 0,
      dialogVisible: false,
    };
  },
  mounted() {
    this.getTriageCount();
    this.getTriagePage(1);
    this.getDeptData();
    setInterval(() => {
      this.getTriageCount();
      if (this.total < 20) {
        this.getTriagePage(1);
      }
    }, 1000 * 60);
  },
  methods: {
    getDeptData() {
      getDeptByDeptId({
        deptId: JSON.parse(
          localStorage.getItem("doctorData")
        ).deptId.toString(),
      }).then((data) => {
        if (data.data.code === 20041) {
          this.deptName = data.data.data.deptName;
        }
      });
    },
    getTriageCount() {
      getTriageCountByDeptId({
        deptId: JSON.parse(
          localStorage.getItem("doctorData")
        ).deptId.toString(),
      })
        .then((data) => {
          if (data.data.code === 20041) {
            this.total = data.data.data;
          } else if (data.data.code === 20040) {
            console.log("请先登录！");
          } else {
            this.$message.error("请求超时！请稍后重试！");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    getTriagePage(pageNumber) {
      getTriagePageByDeptId(
        JSON.parse(localStorage.getItem("doctorData")).deptId.toString(),
        pageNumber,
        this.pageSize
      )
        .then((data) => {
          if (data.data.code === 20041) {
            this.triageData = data.data.data;
          } else if (data.data.code === 20040) {
            console.log("请先登录！");
          } else {
            this.$message.error("请求超时！请稍后重试！");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    handleCurrentChange(val) {
      this.getTriagePage(val);
    },
    cellHandle(row) {
      modifyRegisterState({
        registeredId: row.registeredId.toString(),
        state: 2,
      })
        .then((data) => {
          if (data.data.code === 20031) {
            this.$message.success("叫号成功！，请等待患者!");
            row.state = 2;
          } else if (data.data.code === 20030) {
            this.$message.warning("叫号失败！");
          } else {
            this.$message.error("服务器异常，请稍后重试！");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    getDialogHandle(row) {
      getOneDiagnosisResult({
        doctorId: JSON.parse(
          localStorage.getItem("doctorData")
        ).doctorId.toString(),
        patientId: row.patientId.toString(),
      })
        .then((data) => {
          if (data.data.code === 20041) {
            this.formData.patientId = row.patientId;
            this.formData.doctorId = data.data.data.doctorId;
            this.formData.patientName = row.patientName;
            this.formData.patientGender = row.patientGender;
            this.formData.patientBirthday = row.patientBirthday;
            this.formData.deptName = this.deptName;
            this.formData.doctorName = JSON.parse(
              localStorage.getItem("doctorData")
            ).doctorName;
            this.formData.symptomDesc = data.data.data.symptomDesc;
            this.formData.symptomIdea = data.data.data.symptomIdea;
            this.dialogVisible = true;
          } else if (data.data.code === 20040) {
            this.formData.patientId = row.patientId;
            this.formData.patientName = row.patientName;
            this.formData.patientGender = row.patientGender;
            this.formData.patientBirthday = row.patientBirthday;
            this.formData.deptName = this.deptName;
            this.formData.doctorName = JSON.parse(
              localStorage.getItem("doctorData")
            ).doctorName;
            this.dialogVisible = true;
          } else {
            this.$message.error("服务器异常，请稍后重试！");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    endHandle(row) {
      modifyRegisterState({
        registeredId: row.registeredId.toString(),
        state: 3,
      })
        .then((data) => {
          if (data.data.code === 20031) {
            this.$message.success("诊断结束！");
            addLog({
              doctorId: "1",
              patientId: row.patientId.toString(),
              logContent: "诊断了病人" + row.patientName,
              createTime: moment().format("YYYY-MM-DD hh:mm:SS"),
            });
            row.state = 3;
          } else if (data.data.code === 20030) {
            this.$message.warning("结束失败！请稍后重试!");
          } else {
            this.$message.error("服务器异常，请稍后重试！");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    successHandle() {
      getOneDiagnosisResult({
        doctorId: this.formData.doctorId.toString(),
        patientId: this.formData.patientId.toString(),
      }).then((data) => {
        if (data.data.code === 20041) {
          this.updateDiagnosisResult();
        } else if (data.data.code === 20040) {
          this.saveDiagnosisResult();
        } else {
          this.$message.error("服务器异常，请稍后重试！");
        }
      });
    },
    saveDiagnosisResult() {
      addDiagnosisResult({
        doctorId: JSON.parse(
          localStorage.getItem("doctorData")
        ).doctorId.toString(),
        patientId: this.formData.patientId.toString(),
        symptomDesc: this.formData.symptomDesc,
        symptomIdea: this.formData.symptomIdea,
      })
        .then((data) => {
          if (data.data.code === 20011) {
            this.dialogVisible = false;
            this.$notify({
              title: "完成",
              type: "success",
            });
          } else if (data.data.code === 20010) {
            this.$notify({
              title: "上传出错！",
              type: "warning",
              message: "请稍后重试！",
            });
          } else {
            this.$message.error("服务器异常，请稍后重试！");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    updateDiagnosisResult() {
      modifyDiagnosisResult({
        doctorId: JSON.parse(
          localStorage.getItem("doctorData")
        ).doctorId.toString(),
        patientId: this.formData.patientId.toString(),
        symptomDesc: this.formData.symptomDesc,
        symptomIdea: this.formData.symptomIdea,
      })
        .then((data) => {
          if (data.data.code === 20031) {
            this.dialogVisible = false;
            this.$notify({
              title: "更新完成",
              type: "success",
            });
          } else if (data.data.code === 20030) {
            this.$notify({
              title: "更新失败！",
              type: "warning",
              message: "请稍后重试！",
            });
          } else {
            this.$message.error("服务器异常，请稍后重试！");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.triage-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .el-card {
    width: 1100px;
    height: 475px;
    margin-top: 50px;
    h1 {
      color: #fff;
      text-align: center;
      background-color: #337ab7;
      line-height: 53px;
    }
    .el-table {
      /deep/ .my-header {
        background-color: #d9edf7;
        color: black;
        text-align: center;
      }
    }
  }
  .block {
    margin-top: 10px;
  }
}
</style>
