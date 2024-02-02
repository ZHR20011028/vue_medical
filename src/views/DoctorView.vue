<template>
  <div class="doctor-container">
    <el-dialog
      title="信息编辑"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="form" label-width="80px" size="mini">
        <el-form-item label="科室">
          <el-input v-model="form.deptName"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.doctorName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="form.doctorGender" label="男">男</el-radio>
          <el-radio v-model="form.doctorGender" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="form.doctorBirthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="form.doctorTelephone"></el-input>
        </el-form-item>
        <el-form-item label="入职日期">
          <el-date-picker
            v-model="form.dateOfEntry"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="学位">
          <el-input v-model="form.degree"></el-input>
        </el-form-item>
        <el-form-item label="职称">
          <el-input v-model="form.jobTitle"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            style="width: 150px; margin-left: 42px"
            type="success"
            icon="el-icon-check"
            @click="searchHandle"
            >完成</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="doctor-header">
      <div class="button">
        <el-button
          size="medium"
          icon="el-icon-refresh-left"
          type="primary"
          @click="refresh"
        ></el-button>
        <el-button
          size="medium"
          icon="el-icon-plus"
          type="primary"
          @click="addDoctorStart"
          >增加医生</el-button
        >
      </div>
      <div class="search">
        <el-form :model="searchForm">
          <el-select
            style="width: 75px"
            size="medium"
            v-model="selectData.value"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectData.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            style="width: 300px"
            size="medium"
            v-model="searchForm.value"
            filterable
            remote
            :placeholder="
              selectData.value === '1' ? '请输入科室名称' : '请输入医生姓名'
            "
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
    </div>
    <el-card>
      <el-table
        height="430"
        header-cell-class-name="my-header"
        :data="doctorData"
        border
        stripe
      >
        <el-table-column label="工号" width="180">
          <template slot-scope="scope">
            {{ scope.row.doctorId + "" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="科室"
          width="75"
        ></el-table-column>
        <el-table-column
          prop="doctorName"
          label="姓名"
          width="75"
        ></el-table-column>
        <el-table-column
          prop="doctorGender"
          label="性别"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="doctorBirthday"
          label="出生日期"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="doctorTelephone"
          label="电话"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="dateOfEntry"
          label="入职时间"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="degree"
          label="学历"
          width="75"
        ></el-table-column>
        <el-table-column
          prop="jobTitle"
          label="职称"
          width="140"
        ></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="info"
              icon="el-icon-edit"
              size="small"
              @click="editDoctor(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeHandle(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
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
  getPageDoctor,
  getDoctorDeptByDoctorId,
  getDoctorByDeptId,
  getLikeDoctorByDoctorName,
  removeDoctorByDoctorId,
  modifyDoctor,
  addDoctor,
} from "@/api/doctorApi";
import { getLikeDept, getDeptByDeptName } from "@/api/deptApi";
export default {
  data() {
    return {
      doctorData: [],
      searchForm: {
        value: "",
        options: [],
        loading: false,
      },
      selectData: {
        value: "1",
        options: [
          {
            value: "1",
            label: "科室",
          },
          {
            value: "2",
            label: "姓名",
          },
        ],
      },
      form: {
        deptName: "",
        doctorId: "",
        deptId: "",
        doctorName: "",
        doctorGender: "",
        doctorBirthday: "",
        doctorTelephone: "",
        dateOfEntry: "",
        degree: "",
        jobTitle: "",
        email: "",
      },
      size: 20,
      currentPage: 1,
      total: 0,
      dialogVisible: false,
      isAddOrEdit: true,
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
      getPageDoctor({ current: val, pageSize: this.size }).then((data) => {
        if (data.data.code === 20041) {
          this.total = data.data.data.total;
          this.doctorData = data.data.data.doctorData;
        }
      });
    },
    searchHandle() {
      if (this.selectData.value === "1") {
        this.getDoctorsByDeptId();
      } else if (this.selectData.value === "2") {
        this.getDoctorByDoctorId();
      } else {
        this.$message.warning("请按选择输入正确数据!");
      }
    },
    remoteMethod(query) {
      if (query !== "") {
        this.searchForm.loading = true;
        setTimeout(() => {
          this.searchForm.loading = false;
          if (this.selectData.value === "1") {
            this.deptLikeSearch(query);
          } else if (this.selectData.value === "2") {
            this.doctorNameLikeSearch(query);
          }
        }, 200);
      } else {
        this.searchForm.options = [];
      }
    },
    deptLikeSearch(query) {
      getLikeDept({ deptLikeName: query }).then((data) => {
        this.searchForm.options = data.data.data.map((item) => {
          return {
            label: item.deptName,
            value: item.deptId.toString(),
          };
        });
      });
    },
    doctorNameLikeSearch(query) {
      getLikeDoctorByDoctorName({ doctorName: query }).then((data) => {
        this.searchForm.options = data.data.data.map((item) => {
          return {
            label: item.doctorName,
            value: item.doctorId.toString(),
          };
        });
      });
    },
    getDoctorsByDeptId() {
      getDoctorByDeptId({ deptId: this.searchForm.value }).then((data) => {
        if (data.data.code === 20041) {
          this.doctorData = data.data.data;
        }
      });
    },
    getDoctorByDoctorId() {
      getDoctorDeptByDoctorId({ doctorId: this.searchForm.value }).then(
        (data) => {
          if (data.data.code === 20041) {
            this.doctorData = [data.data.data];
          }
        }
      );
    },
    removeHandle(row) {
      removeDoctorByDoctorId({ doctorId: row.doctorId.toString() }).then(
        (data) => {
          if (data.data.code === 20021) {
            this.$notify({
              title: "删除成功",
              type: "success",
            });
            this.handleCurrentChange(this.currentPage);
          } else if (data.data.code === 20020) {
            this.$notify({
              title: "删除失败",
              type: "warning",
            });
          } else {
            this.$message.error("服务器繁忙！请稍后重试！");
          }
        }
      );
    },
    editDoctor(row) {
      this.form.doctorId = row.doctorId.toString();
      this.form.deptId = row.deptId.toString();
      this.form.deptName = row.deptName;
      this.form.doctorName = row.doctorName;
      this.form.doctorGender = row.doctorGender;
      this.form.doctorBirthday = row.doctorBirthday;
      this.form.doctorTelephone = row.doctorTelephone;
      this.form.dateOfEntry = row.dateOfEntry;
      this.form.degree = row.degree;
      this.form.jobTitle = row.jobTitle;
      this.form.email = row.email;
      this.isAddOrEdit = false;
      this.dialogVisible = true;
    },
    async editFinish() {
      try {
        const deptData = await getDeptByDeptName({
          deptName: this.form.deptName,
        });
        if (deptData.data.code === 20041) {
          this.form.deptId = deptData.data.data.deptId;
        } else if (deptData.data.code === 20040) {
          this.$message.warning("修改失败，请稍后重试！");
          return;
        }
      } catch (error) {
        console.log(error);
      }
      modifyDoctor({
        doctorId: this.form.doctorId,
        deptId: this.form.deptId,
        doctorName: this.form.doctorName,
        doctorGender: this.form.doctorGender,
        doctorBirthday: this.form.doctorBirthday,
        doctorTelephone: this.form.doctorTelephone,
        dateOfEntry: this.form.dateOfEntry,
        degree: this.form.degree,
        jobTitle: this.form.jobTitle,
        email: this.form.email,
      }).then((data) => {
        if (data.data.code === 20031) {
          this.$notify({
            title: "修改成功",
            type: "success",
          });
          this.handleCurrentChange(this.currentPage);
          this.dialogVisible = false;
        } else if (data.data.code === 20030) {
          this.$notify({
            title: "修改失败",
            type: "warning",
            message: "请稍后重试!",
          });
        } else {
          this.$message.error("服务器繁忙！请稍后重试！");
        }
      });
    },
    addDoctorStart() {
      this.form.doctorId = null;
      this.form.deptId = "";
      this.form.deptName = "";
      this.form.doctorName = "";
      this.form.doctorGender = "";
      this.form.doctorBirthday = "";
      this.form.doctorTelephone = "";
      this.form.dateOfEntry = "";
      this.form.degree = "";
      this.form.jobTitle = "";
      this.form.email = "";
      this.isAddOrEdit = true;
      this.dialogVisible = true;
    },
    async addDoctorEnd() {
      try {
        const deptData = await getDeptByDeptName({
          deptName: this.form.deptName,
        });
        if (deptData.data.code === 20041) {
          this.form.deptId = deptData.data.data.deptId;
        } else if (deptData.data.code === 20040) {
          this.$message.warning("修改失败，请稍后重试！");
          return;
        }
      } catch (error) {
        this.$message.error(error);
      }
      addDoctor({
        deptId: this.form.deptId,
        doctorName: this.form.doctorName,
        doctorGender: this.form.doctorGender,
        doctorBirthday: this.form.doctorBirthday,
        doctorTelephone: this.form.doctorTelephone,
        dateOfEntry: this.form.dateOfEntry,
        degree: this.form.degree,
        jobTitle: this.form.jobTitle,
        email: this.form.email,
      })
        .then((data) => {
          if (data.data.code === 20011) {
            this.$notify({
              title: "增加成功",
              type: "success",
            });
            this.handleCurrentChange(this.currentPage);
            this.dialogVisible = false;
          } else if (data.data.code === 20010) {
            this.$notify({
              title: "增加失败",
              type: "warning",
            });
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    searchHandle() {
      if (this.isAddOrEdit) {
        this.addDoctorEnd();
      } else {
        this.editFinish();
      }
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
.doctor-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .doctor-header {
    margin-top: 25px;
    width: 1350px;
    display: flex;
    flex-direction: row;
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
    width: 1400px;
    height: 475px;
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
    margin-top: 10px;
  }
}
</style>
