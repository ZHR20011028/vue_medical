<template>
  <div class="drug-manage-container">
    <el-dialog
      :title="dialogData.title"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      center
      width="300"
    >
      <el-form
        inline
        :model="dialogForm"
        label-width="100px"
        size="small"
        class="demo-ruleForm"
        ref="ruleForm"
        :rules="rules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="药品名" prop="drugsName">
              <el-input
                v-model="dialogForm.drugsName"
                placeholder="请输入药品名"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="规格" prop="drugsSpecifications">
              <el-input
                v-model="dialogForm.drugsSpecifications"
                placeholder="请输入规格"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数量" prop="drugsNumber">
              <el-input
                v-model="dialogForm.drugsNumber"
                placeholder="请输入数量"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产企业" prop="drugsManuFactor">
              <el-input
                v-model="dialogForm.drugsManuFactor"
                placeholder="请输入生产企业"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生产日期" prop="manufactureTime">
              <el-date-picker
                v-model="dialogForm.manufactureTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                size="small"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过期日期" prop="expireTime">
              <el-date-picker
                v-model="dialogForm.expireTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                size="small"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="进价" prop="purchasePrice">
              <el-input
                v-model="dialogForm.purchasePrice"
                placeholder="请输入进价"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="零售价" prop="salePrice">
              <el-input
                v-model="dialogForm.salePrice"
                placeholder="请输入零售价"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="销售状态">
              <el-radio-group v-model="dialogForm.saleStatus">
                <el-radio :label="0">上架</el-radio>
                <el-radio :label="1">停售</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否进口">
              <el-radio-group v-model="dialogForm.isImport">
                <el-radio :label="0">进口</el-radio>
                <el-radio :label="1">非进口</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="产品说明">
              <el-input
                style="width: 542px"
                type="textarea"
                v-model="dialogForm.drugsDesc"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-form-item style="margin-left: 268px">
          <el-button
            type="primary"
            icon="el-icon-success"
            style="width: 150px"
            @click="selectAddOrModify"
            >完成</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="drug-manage-header">
      <div class="header-button">
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
          @click="addDrugBefore"
          >采购药品</el-button
        >
      </div>
      <div class="header-search">
        <el-form :model="searchForm">
          <el-select
            style="width: 300px"
            size="medium"
            v-model="searchForm.value"
            filterable
            remote
            placeholder="请输入药品名"
            :remote-method="remoteMethod"
            :loading="searchForm.loading"
          >
            <el-option
              v-for="item in searchForm.options"
              :key="item.drugId"
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
    <el-card class="box-card">
      <el-table
        :data="drugManageData"
        border
        height="430"
        header-cell-class-name="my-header"
        stripe
      >
        <el-table-column label="编号" width="180">
          <template slot-scope="scope">
            {{ scope.row.drugId.toString() }}
          </template>
        </el-table-column>
        <el-table-column prop="drugsName" label="药品名"> </el-table-column>
        <el-table-column prop="drugsSpecifications" label="规格" width="110">
        </el-table-column>
        <el-table-column prop="drugsManuFactor" label="生产企业">
        </el-table-column>
        <el-table-column prop="manufactureTime" label="生产日期" width="100">
        </el-table-column>
        <el-table-column prop="expireTime" label="过期日期" width="100">
        </el-table-column>
        <el-table-column prop="drugsNumber" label="数量" width="50">
        </el-table-column>
        <el-table-column prop="salePrice" label="销售价格" width="100">
        </el-table-column>
        <el-table-column label="销售状态" >
          <template slot-scope="scope">
            {{ scope.row.saleStatus === "0" ? "正常" : "停售" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="370">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-success"
              :disabled="scope.row.checkStatus !== null"
              @click="submitHandle(scope.row)"
              >提交审核</el-button
            >
            <el-button
              v-if="scope.row.saleStatus === '1'"
              type="primary"
              size="mini"
              icon="el-icon-top"
              @click="shelvesHandle(scope.row)"
              >上架</el-button
            >
            <el-button
              v-else
              type="warning"
              size="mini"
              icon="el-icon-bottom"
              @click="stopHandle(scope.row)"
              >停售</el-button
            >
            <el-button
              type="info"
              size="mini"
              icon="el-icon-edit"
              @click="modifyDrugBefore(scope.row)"
              >修改</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-delete"
              @click="deleteDrug(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="block">
      <el-pagination
        background
        :page-size="pageSize"
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
  getPageDrug,
  getLikeDrug,
  getDrugByDrugsName,
  addDrug,
  modifyDrug,
  delDrugByDrugId,
} from "@/api/drugApi";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogForm: {
        drugId: "",
        drugsName: "",
        drugsSpecifications: "",
        drugsManuFactor: "",
        manufactureTime: "",
        expireTime: "",
        drugsNumber: 0,
        purchasePrice: "",
        salePrice: "",
        isImport: "",
        saleStatus: "",
        drugsDesc: "",
        updateTime: "",
      },
      rules: {
        drugsName: [
          { required: true, message: "请输入药品名", trigger: "blur" },
        ],
        drugsSpecifications: [
          { required: true, message: "请输入规格", trigger: "blur" },
        ],
        drugsManuFactor: [
          { required: true, message: "请输入生产企业", trigger: "blur" },
        ],
        manufactureTime: [
          { required: true, message: "请输入生产时间", trigger: "blur" },
        ],
        expireTime: [
          { required: true, message: "请输入过期时间", trigger: "blur" },
        ],
        drugsNumber: [
          { required: true, message: "请输入药品数量", trigger: "blur" },
        ],
        purchasePrice: [
          { required: true, message: "请输入药品进价", trigger: "blur" },
        ],
        salePrice: [
          { required: true, message: "请输入药品零售价", trigger: "blur" },
        ],
      },
      dialogData: {
        title: "药品信息入库",
        isAddOrModify: true, //true增加  false修改
      },
      searchForm: {
        value: "",
        options: [],
        loading: false,
      },
      drugManageData: [],
      pageSize: 20,
      currentPage: 1,
      total: 50,
    };
  },
  mounted() {
    this.handleCurrentChange(1);
  },
  methods: {
    getNowFormatDate() {
      let date = new Date(),
        year = date.getFullYear(), //获取完整的年份(4位)
        month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
        strDate = date.getDate(); // 获取当前日(1-31)
      if (month < 10) month = `0${month}`; // 如果月份是个位数，在前面补0
      if (strDate < 10) strDate = `0${strDate}`; // 如果日是个位数，在前面补0

      return `${year}-${month}-${strDate}`;
    },
    refresh() {
      this.handleCurrentChange(1);
      this.searchForm.value = "";
      this.searchForm.options = [];
    },
    handleCurrentChange(val) {
      getPageDrug({ current: val, pageSize: this.pageSize })
        .then((data) => {
          if (data.data.code === 20041) {
            this.total = data.data.data.total;
            this.drugManageData = data.data.data.drugData;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.searchForm.loading = true;
        setTimeout(() => {
          this.searchForm.loading = false;
          getLikeDrug({ drugsName: query }).then((data) => {
            if (data.data.code === 20041) {
              this.searchForm.options = data.data.data.map((item) => {
                return {
                  label: item.drugsName,
                  value: item.drugsName,
                  drugId: item.drugId.toString(),
                };
              });
            }
          });
        }, 200);
      } else {
        this.searchForm.options = [];
      }
    },
    searchHandle() {
      getDrugByDrugsName({ drugsName: this.searchForm.value })
        .then((data) => {
          if (data.data.code === 20041) {
            this.drugManageData = data.data.data;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    addDrugBefore() {
      this.dialogForm.drugId = "";
      this.dialogForm.drugsName = "";
      this.dialogForm.drugsSpecifications = "";
      this.dialogForm.drugsNumber = 0;
      this.dialogForm.drugsManuFactor = "";
      this.dialogForm.manufactureTime = "";
      this.dialogForm.expireTime = "";
      this.dialogForm.purchasePrice = "";
      this.dialogForm.salePrice = "";
      this.dialogForm.saleStatus = "";
      this.dialogForm.isImport = "";
      this.dialogForm.drugsDesc = "";
      this.dialogData.title = "药品信息入库";
      this.dialogData.isAddOrModify = true;
      this.dialogVisible = true;
    },
    modifyDrugBefore(row) {
      this.dialogForm.drugId = row.drugId.toString();
      this.dialogForm.drugsName = row.drugsName;
      this.dialogForm.drugsSpecifications = row.drugsSpecifications;
      this.dialogForm.drugsNumber = row.drugsNumber;
      this.dialogForm.drugsManuFactor = row.drugsManuFactor;
      this.dialogForm.manufactureTime = row.manufactureTime;
      this.dialogForm.expireTime = row.expireTime;
      this.dialogForm.purchasePrice = row.purchasePrice;
      this.dialogForm.salePrice = row.salePrice;
      this.dialogForm.saleStatus = parseInt(row.saleStatus);
      this.dialogForm.isImport = parseInt(row.isImport);
      this.dialogForm.drugsDesc = row.drugsDesc;
      this.dialogForm.updateTime = this.getNowFormatDate();
      this.dialogData.title = "药品信息修改";
      this.dialogData.isAddOrModify = false;
      this.dialogVisible = true;
    },
    addDrugEnd() {
      addDrug(this.dialogForm).then((data) => {
        if (data.data.code === 20011) {
          this.$notify({
            title: "入库成功",
            type: "success",
          });
          this.handleCurrentChange(1);
          this.dialogVisible = false;
        } else if (data.data.code === 20010) {
          this.$notify({
            title: "入库失败",
            type: "warning",
          });
        } else {
          this.$message.error("请求超时，请稍后再试！");
        }
      });
    },
    modifyDrugEnd() {
      modifyDrug(this.dialogForm).then((data) => {
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
          });
        } else {
          this.$message.error("请求超时，请稍后再试！");
        }
      });
    },
    selectAddOrModify() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          if (this.dialogData.isAddOrModify) {
            this.addDrugEnd();
          } else {
            this.modifyDrugEnd();
          }
        }
      });
    },
    deleteDrug(row) {
      delDrugByDrugId({ drugId: row.drugId.toString() })
        .then((data) => {
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
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    shelvesHandle(row) {
      modifyDrug({
        drugId: row.drugId.toString(),
        saleStatus: "0",
        updateTime: this.getNowFormatDate(),
      })
        .then((data) => {
          if (data.data.code === 20031) {
            this.$notify({
              title: "上架成功",
              type: "success",
            });
            this.handleCurrentChange(this.currentPage);
          } else if (data.data.currentPage === 20030) {
            this.$notify({
              title: "上架失败",
              type: "warning",
            });
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    stopHandle(row) {
      modifyDrug({
        drugId: row.drugId.toString(),
        saleStatus: "1",
        updateTime: this.getNowFormatDate(),
      })
        .then((data) => {
          if (data.data.code === 20031) {
            this.$notify({
              title: "停售成功",
              type: "success",
            });
            this.handleCurrentChange(this.currentPage);
          } else if (data.data.code === 20030) {
            this.$notify({
              title: "停售失败",
              type: "warning",
            });
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    submitHandle(row) {
      modifyDrug({
        drugId: row.drugId.toString(),
        checkStatus: "2",
        updateTime: this.getNowFormatDate(),
        checkStartTime: this.getNowFormatDate(),
      })
        .then((data) => {
          if (data.data.code === 20031) {
            this.$notify({
              title: "提交成功",
              type: "success",
            });
            this.handleCurrentChange(this.currentPage);
          } else if (data.data.code === 20030) {
            this.$notify({
              title: "提交失败",
              type: "warning",
            });
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
.drug-manage-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .drug-manage-header {
    margin-top: 20px;
    width: 1350px;
    display: flex;
    justify-content: space-between;
    .header-search {
      .el-form {
        .el-select {
          /deep/ .el-input__inner {
            cursor: text;
          }
        }
      }
    }
  }
  .el-card {
    margin-top: 10px;
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
    margin-top: 15px;
  }
}
</style>
