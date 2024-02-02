<template>
  <div class="dept-container">
    <div class="dialog-div">
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="科室名称">
            <el-input v-model="form.deptName"></el-input>
          </el-form-item>
          <el-form-item label="科室电话">
            <el-input v-model="form.deptTelephone"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="form.deptLocation"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :icon="iconContent"
              type="info"
              size="mini"
              style="margin-left: 44px; width: 150px"
              @click="selectFunction"
              >{{ dialogButtonContent }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div class="dept-header">
      <div class="main-button">
        <el-button
        size="medium"
        icon="el-icon-refresh-left"
        type="primary"
        @click="refresh"
        ></el-button
      >
        <el-button
        size="medium"
        icon="el-icon-plus"
        type="primary"
        @click="addDeptBefore"
        >添加科室</el-button
      >
      </div>
      <div class="search">
        <el-form :model="searchForm">
          <!-- <el-input
            size="medium"
            v-model="searchForm.search"
            placeholder="请输入科室名称"
            style="width: 300px"
          ></el-input> -->
          <el-select
            style="width: 300px"
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
            icon="el-icon-search"
            type="primary"
            @click="searchHandle"
            >搜索</el-button
          >
        </el-form>
      </div>
    </div>
    <el-card class="box-card">
      <el-table
        :data="deptData"
        border
        height="351"
        header-cell-class-name="my-header"
        stripe
      >
        <el-table-column prop="deptName" label="名称" width="100">
        </el-table-column>
        <el-table-column prop="deptTelephone" label="科室电话" width="200">
        </el-table-column>
        <el-table-column prop="deptLocation" label="所在区域">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="removeDept(scope.row)"
              >删除</el-button
            >
            <el-button
              icon="el-icon-edit"
              type="info"
              size="mini"
              @click="editDeptBefore(scope.row)"
              >修改</el-button
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
  getPageDept,
  getDeptByDeptId,
  removeDept,
  modifyDept,
  addDept,
  getLikeDept,
} from "@/api/deptApi";
export default {
  data() {
    return {
      deptData: [],
      searchForm: {
        value: "",
        options: [],
        loading: false,
      },
      form: {
        deptId: "",
        deptName: "",
        deptTelephone: "",
        deptLocation: "",
      },
      total: 0,
      size: 9,
      currentPage: 1,
      dialogVisible: false,
      dialogTitle: "",
      dialogButtonContent: "",
      iconContent: "",
      isSelectFunction: 0,
    };
  },
  mounted() {
    this.handleCurrentChange(1);
  },
  methods: {
    refresh(){
      this.handleCurrentChange(1);
      this.searchForm.value = "";
      this.searchForm.options = [];
    },
    handleCurrentChange(val) {
      getPageDept({ current: val, size: this.size }).then((data) => {
        if (data.data.code === 20041) {
          this.total = data.data.data.total;
          this.deptData = data.data.data.deptData;
        } else {
          this.$message.error("请求超时，请稍后再试！");
        }
      });
    },
    searchHandle() {
      getDeptByDeptId({ deptId: this.searchForm.value }).then((data) => {
        if (data.data.code === 20041) {
          this.deptData = [data.data.data];
        } else if (data.data.code === 20040) {
          this.$message.warning("搜索失败，请输入正确的科室名称。");
          this.handleCurrentChange(1);
        } else {
          this.$message.error("请求超时，请稍后再试！");
        }
      });
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
    removeDept(row) {
      removeDept({ deptId: row.deptId.toString() }).then((data) => {
        if (data.data.code === 20021) {
          this.$notify({
            title: "删除成功!",
            type: "success",
          });
          this.handleCurrentChange(this.currentPage);
        } else if (data.data.code === 20020) {
          this.$notify({
            title: "删除失败",
            type: "warning",
          });
        } else {
          this.$message.error("请求超时，请稍后再试！");
        }
      });
    },
    selectFunction() {
      if (this.isSelectFunction === 0) {
        this.editDeptEnd();
      } else if (this.isSelectFunction === 1) {
        this.addDeptEnd();
      }
    },
    addDeptBefore() {
      this.dialogTitle = "增加科室";
      this.dialogButtonContent = "完成";
      this.iconContent = "el-icon-success";
      this.isSelectFunction = 1;
      this.form.deptId = null;
      this.form.deptName = "";
      this.form.deptTelephone = "";
      this.form.deptLocation = "";
      this.dialogVisible = true;
    },
    addDeptEnd() {
      addDept(this.form).then((data) => {
        if (data.data.code === 20011) {
          this.$notify({
            title: "增添成功",
            type: "success",
          });
          this.handleCurrentChange(this.currentPage);
          this.dialogVisible = false;
        } else if (data.data.code === 20010) {
          this.$message.warning("添加失败！");
        } else {
          this.$message.error("请求超时，请稍后再试！");
        }
      });
    },
    editDeptBefore(row) {
      this.dialogTitle = "修改科室信息";
      this.dialogButtonContent = "修改";
      this.iconContent = "el-icon-edit";
      this.form.deptId = row.deptId.toString();
      this.form.deptName = row.deptName;
      this.form.deptTelephone = row.deptTelephone;
      this.form.deptLocation = row.deptLocation;
      this.isSelectFunction = 0;
      this.dialogVisible = true;
    },
    editDeptEnd() {
      modifyDept(this.form).then((data) => {
        if (data.data.code === 20031) {
          this.$notify({
            title: "修改成功",
            type: "success",
          });
          this.handleCurrentChange(this.currentPage);
          this.dialogVisible = false;
        } else if (data.data.code === 20030) {
          this.$message.warning("修改失败！");
        } else {
          this.$message.error("请求超时，请稍后再试！");
        }
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
.dept-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .dept-header {
    margin-top: 30px;
    width: 930px;
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
    width: 950px;
    height: 400px;
    margin-top: 20px;
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
    margin-top: 30px;
  }
}
</style>
