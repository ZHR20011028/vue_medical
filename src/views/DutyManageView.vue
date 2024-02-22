<template>
  <div class="duty-container">
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="dialogFrom" label-width="80px" size="small">
        <el-form-item label="医生">
          <el-input v-model="dialogFrom.doctorName"></el-input>
        </el-form-item>
        <el-form-item label="值班日期">
          <el-date-picker
            v-model="dialogFrom.workTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="班种">
          <el-select v-model="dialogFrom.workType" placeholder="请选择">
            <el-option label="白班" value="1"></el-option>
            <el-option label="夜班" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="info" icon="el-icon-success" @click="searchHandle"
            >完成</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="duty-header">
      <el-form :model="dutyForm" :rules="rules">
        <el-form-item prop="dutyValue">
          <el-select
            v-model="dutyForm.dutyValue"
            placeholder="请选择"
            size="small"
            @change="handleChange"
          >
            <el-option
              v-for="item in dutyForm.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div class="duty-header-right">
          <el-form-item prop="dateValue">
            <el-date-picker
              v-model="dutyForm.dateValue"
              type="date"
              align="right"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              size="small"
            >
            </el-date-picker>
            <el-button size="small" type="primary" @click="getAllDeptHandle"
              >查询</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="duty-body">
      <el-card class="card-box-one">
        <h2>
          {{ dutyForm.dateValue }} · {{ selectedLabel
          }}<span style="color: red">未</span>值班表
        </h2>
        <el-table
          :data="noWorkData"
          border
          height="410"
          header-cell-class-name="table-header-one"
          stripe
        >
          <el-table-column prop="workTime" label="值班日期" width="150">
          </el-table-column>
          <el-table-column prop="doctorName" label="医生"></el-table-column>
          <el-table-column label="班种" width="100">
            <template slot-scope="scope">
              {{
                scope.row.workType === 1
                  ? "白班"
                  : scope.row.workType === 0
                  ? "夜班"
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.workId"
                size="small"
                type="info"
                @click="modifyDutyHandle(scope.row)"
                >排班</el-button
              >
              <el-button
                v-else
                size="small"
                type="info"
                @click="rankDutyHandle(scope.row)"
                >排班</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="card-box-two">
        <h2>{{ dutyForm.dateValue }} · {{ selectedLabel }}值班表</h2>
        <el-table
          :data="workData"
          border
          height="410"
          header-cell-class-name="table-header-two"
          stripe
        >
          <el-table-column prop="doctorName" label="医生"> </el-table-column>
          <el-table-column label="班种" width="100">
            <template slot-scope="scope">
              {{
                scope.row.workType === 1
                  ? "白班"
                  : scope.row.workType === 0
                  ? "夜班"
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="info"
                @click="modifyDutyHandle(scope.row)"
                >调班</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getAllDutyOK, getAllDutyNo } from "@/api/dutyApi";
import { getAllDept } from "@/api/deptApi";
import { addWork, modifyWork } from "@/api/workApi";
export default {
  data() {
    return {
      noWorkData: [],
      workData: [],
      dutyForm: {
        dutyValue: "",
        options: [],
        dateValue: "",
      },
      dialogFrom: {
        workId: "",
        doctorId: "",
        doctorName: "",
        workTime: "",
        workType: "",
      },
      dialogData: {
        title: "",
        isRankOrModify: true, //true是排班 false时调班
      },
      rules: {
        dutyValue: [
          { required: true, message: "请选择科室", trigger: "change" },
        ],
        dateValue: [{ required: true, message: "请选择日期", trigger: "blur" }],
      },
      selectedLabel: "",
      dialogVisible: false,
    };
  },
  mounted() {
    this.getAllDeptData();
  },
  methods: {
    getAllDeptData() {
      getAllDept().then((data) => {
        if (data.data.code === 20041) {
          this.dutyForm.options = data.data.data.map((item) => {
            return {
              label: item.deptName,
              value: item.deptId.toString(),
            };
          });
        }
      });
    },
    handleChange(value) {
      // 检索完整的选项对象
      const selectedOption = this.dutyForm.options.find(
        (option) => option.value === value
      );
      // 获取`label`属性
      this.selectedLabel = selectedOption ? selectedOption.label : "";
      // 可以在这里进行其他操作，比如发送事件或者调用API等
    },
    async getAllDutyOkHandle() {
      await getAllDutyOK({
        deptId: this.dutyForm.dutyValue,
        workTime: this.dutyForm.dateValue,
      }).then((data) => {
        if (data.data.code === 20041) {
          this.workData = data.data.data;
        } else if (data.data.code === 20040) {
          this.workData = [];
        } else {
          this.$message.error("系统繁忙,请稍后重试！");
          this.workData = [];
        }
      });
    },
    async getAllDutyNoHandle() {
      await getAllDutyNo({
        deptId: this.dutyForm.dutyValue,
        workTime: this.dutyForm.dateValue,
      }).then((data) => {
        if (data.data.code === 20041) {
          this.noWorkData = data.data.data;
        } else if (data.data.code === 20040) {
          this.noWorkData = [];
        } else {
          this.$message.error("系统繁忙,请稍后重试！");
          this.noWorkData = [];
        }
      });
    },
    async getAllDeptHandle() {
      await this.getAllDutyOkHandle();
      await this.getAllDutyNoHandle();
      if (this.noWorkData.length !== 0 || this.workData.length !== 0) {
        this.$notify({
          title: "搜索成功",
          type: "success",
        });
      } else {
        this.$notify({
          title: "没有数据",
          type: "warning",
        });
      }
    },
    rankDuty() {
      addWork({
        doctorId: this.dialogFrom.doctorId,
        workTime: this.dialogFrom.workTime,
        workType: this.dialogFrom.workType,
      }).then((data) => {
        if (data.data.code === 20011) {
          this.$notify({
            title: "排班成功",
            type: "success",
          });
          this.getAllDutyNoHandle();
          this.getAllDutyOkHandle();
          this.dialogVisible = false;
        } else {
          this.$notify({
            title: "排班失败",
            type: "warning",
          });
          this.dialogVisible = false;
        }
      });
    },
    modifyDuty() {
      modifyWork({
        workId: this.dialogFrom.workId,
        doctorId: this.dialogFrom.doctorId,
        workTime: this.dialogFrom.workTime,
        workType: this.dialogFrom.workType,
      }).then((data) => {
        if (data.data.code === 20031) {
          this.$notify({
            title: "修改成功",
            type: "success",
          });
          this.getAllDutyNoHandle();
          this.getAllDutyOkHandle();
          this.dialogVisible = false;
        } else {
          this.$notify({
            title: "修改失败",
            type: "warning",
          });
          this.dialogVisible = false;
        }
      });
    },
    searchHandle() {
      if (this.dialogData.isRankOrModify) {
        this.rankDuty();
      } else {
        this.modifyDuty();
      }
    },
    rankDutyHandle(row) {
      this.dialogFrom.workId = null;
      this.dialogFrom.doctorId = row.doctorId.toString();
      this.dialogFrom.doctorName = row.doctorName;
      this.dialogFrom.workTime = this.dutyForm.dateValue;
      this.dialogFrom.workType = row.workType;
      this.dialogData.title = "排班";
      this.dialogData.isRankOrModify = true;
      this.dialogVisible = true;
    },
    modifyDutyHandle(row) {
      this.dialogFrom.workId = row.workId.toString();
      this.dialogFrom.doctorId = row.doctorId.toString();
      this.dialogFrom.doctorName = row.doctorName;
      this.dialogFrom.workTime = this.dutyForm.dateValue;
      this.dialogFrom.workType = row.workType;
      this.dialogData.title = "调班";
      this.dialogData.isRankOrModify = false;
      this.dialogVisible = true;
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
.duty-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .duty-header {
    margin-top: 20px;
    width: 900px;
    .el-form {
      display: flex;
      justify-content: space-between;
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
  .duty-body {
    margin-top: 15px;
    width: 950px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .card-box-one {
      width: 500px;
      height: 500px;
      h2 {
        line-height: 53px;
        background-color: #337ab7;
        color: #fff;
        text-align: center;
      }
      .el-table {
        /deep/ .table-header-one {
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
    .card-box-two {
      width: 400px;
      height: 500px;
      h2 {
        line-height: 53px;
        background-color: #337ab7;
        color: #fff;
        text-align: center;
      }
      .el-table {
        /deep/ .table-header-two {
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
  }
}
</style>
