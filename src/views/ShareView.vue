<template>
  <div class="file-container">
    <el-dialog
      title="文档上传"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="400px"
    >
      <el-upload
        class="upload-demo"
        drag
        action="http://localhost:8080/files"
        multiple
        accept=".docx, .pptx,.xlsx"
        :on-success="successHandle"
        :data="uploadData"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传word文件，且不超过10Mb
        </div>
      </el-upload>
      <span slot="footer">
        <el-button
          type="success"
          @click="dialogVisible = false"
          :disabled="isDisabled"
          >完成</el-button
        >
      </span>
    </el-dialog>
    <div class="file-header">
      <div class="main-button">
        <el-button
          size="medium"
          icon="el-icon-refresh-left"
          type="primary"
          @click="refresh"
        ></el-button>
        <el-button
          size="medium"
          icon="el-icon-upload"
          type="primary"
          @click="uploadFile"
          >上传文件</el-button
        >
      </div>
      <div class="search">
        <el-form :model="searchForm">
          <el-select
            style="width: 300px"
            size="medium"
            v-model="searchForm.value"
            filterable
            remote
            placeholder="请输入文件名"
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
        :data="fileData"
        border
        height="425"
        header-cell-class-name="my-header"
        stripe
      >
        <el-table-column prop="fileOldName" label="文件名"> </el-table-column>
        <el-table-column prop="fileUploadTime" label="上传时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="info"
              icon="el-icon-download"
              @click="downloadHandle(scope.row)"
              >下载</el-button
            >
            <el-button
              v-if="isDisplay.doctorId === scope.row.doctorId"
              size="small"
              icon="el-icon-delete"
              type="danger"
              @click="removeHandle(scope.row)"
              >删除</el-button
            >
            <el-button
              v-else
              size="small"
              icon="el-icon-delete"
              type="danger"
              disabled
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
        :current-page="currentPage"
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
  getPageFile,
  getLikeFile,
  getFileByFileId,
  download,
  removeFile,
} from "@/api/fileApi";
export default {
  data() {
    return {
      fileData: [],
      searchForm: {
        value: "",
        options: [],
        loading: false,
      },
      size: 20,
      currentPage: 1,
      total: 1,
      dialogVisible: false,
      uploadData: {
        path: "/diagnosis",
        doctorId: "",
      },
      isDisabled: true,
      isDisplay: {
        doctorId: "",
      },
    };
  },
  mounted() {
    this.handleCurrentChange(1);
    this.uploadData.doctorId = JSON.parse(
      localStorage.getItem("doctorData")
    ).doctorId.toString();
    this.display();
  },
  methods: {
    refresh() {
      this.handleCurrentChange(1);
      this.searchForm.value = "";
      this.searchForm.options = [];
    },
    display() {
      if (localStorage.getItem("doctorData") !== null) {
        this.isDisplay.doctorId = JSON.parse(
          localStorage.getItem("doctorData")
        ).doctorId.toString();
      }
    },
    uploadFile() {
      this.dialogVisible = true;
    },
    searchHandle() {
      getFileByFileId({ fileId: this.searchForm.value }).then((data) => {
        if (data.data.code === 20041) {
          this.fileData = [data.data.data];
        }
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.searchForm.loading = true;
        setTimeout(() => {
          this.searchForm.loading = false;
          getLikeFile({ fileOldName: query }).then((data) => {
            if (data.data.code === 20041) {
              this.searchForm.options = data.data.data.map((item) => {
                return {
                  label: item.fileOldName,
                  value: item.fileId,
                };
              });
            }
          });
        }, 200);
      } else {
        this.searchForm.options = [];
      }
    },
    handleCurrentChange(val) {
      getPageFile({ current: val, pageSize: this.size }).then((data) => {
        if (data.data.code === 20041) {
          this.total = data.data.data.total;
          this.fileData = data.data.data.fileData;
          this.fileData.forEach((item) => {
            item.doctorId = item.doctorId.toString();
          });
        }
      });
    },
    downloadHandle(row) {
      getFileByFileId({ fileId: row.fileId.toString() }).then((data) => {
        if (data.data.code === 20041) {
          download({ filePath: data.data.data.filePath }).then((data) => {
            // 创建一个URL对象，并且指向这个blob对象的URL
            const url = window.URL.createObjectURL(new Blob([data.data]));
            // 创建一个a标签，用于触发下载
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "filename.ext"); // 指定下载文件的默认名称，您需要根据实际情况替换
            document.body.appendChild(link);
            link.click();
            // 清理并移除创建的a标签
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url); // 释放URL对象
          });
        } else if (data.data.code === 20040) {
          this.$notify({
            title: "下载失败",
            type: "warning",
            message: "文件不存在！",
          });
        } else {
          this.$message.error("服务器繁忙，请稍后从事！");
        }
      });
    },
    removeHandle(row) {
      removeFile({ path: row.filePath, fileId: row.fileId.toString() }).then(
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
              message: "请稍后重试！",
            });
          } else {
            this.$message.error("请求超时，请稍后重试！");
          }
        }
      );
    },
    successHandle() {
      this.$notify({
        title: "上传成功",
        type: "success",
      });
      this.handleCurrentChange(this.currentPage);
      this.isDisabled = false;
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
.file-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .file-header {
    margin-top: 25px;
    width: 850px;
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
    width: 900px;
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
