<template>
  <div class="drug-review-container">
    <el-dialog title="药品详情" :visible.sync="detailVisible">
      <el-descriptions :column="3" border>
        <el-descriptions-item :span="2">
          <template slot="label"> 药品名 </template>
          {{ descriptionData.drugsName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 规格 </template>
          {{ descriptionData.drugsSpecifications }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 药品企业 </template>
          {{ descriptionData.drugsManuFactor }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 生产日期 </template>
          {{ descriptionData.manufactureTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 过期日期 </template>
          {{ descriptionData.expireTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 是否进口 </template>
          {{ descriptionData.isImport }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 进价 </template>
          {{ descriptionData.purchasePrice }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 零售价 </template>
          {{ descriptionData.salePrice }}
        </el-descriptions-item>
        <el-descriptions-item :span="3">
          <template slot="label"> 产品说明 </template>
          {{ descriptionData.drugsDesc }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 审核状态 </template>
          {{ descriptionData.checkStatus }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 审核开始时间 </template>
          {{ descriptionData.checkStartTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 审核结束时间 </template>
          {{ descriptionData.checkEndTime }}
        </el-descriptions-item>
        <el-descriptions-item :span="3">
          <template slot="label"> 审核意见 </template>
          {{ descriptionData.checkContent }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <el-dialog
      title="药品审核"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      center
    >
      <el-form :model="dialogAuditData" label-width="80px" size="small">
        <el-form-item label="药品名">
          <el-input
            style="color: black"
            v-model="dialogAuditData.drugsName"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="生产企业">
          <el-input
            style="color: black"
            v-model="dialogAuditData.drugsManuFactor"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input
            type="textarea"
            v-model="dialogAuditData.checkContent"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-success" @click="auditEndOK"
            >通过</el-button
          >
          <el-button type="danger" icon="el-icon-error" @click="auditEndNO"
            >不通过</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="drug-review-header">
      <el-button
        size="medium"
        icon="el-icon-refresh-left"
        type="primary"
        @click="refresh"
      ></el-button>
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
    <el-card>
      <el-table
        :data="drugData"
        border
        height="410"
        header-cell-class-name="my-header"
        stripe
      >
        <el-table-column label="编号" width="180">
          <template slot-scope="scope">
            {{ scope.row.drugId.toString() }}
          </template>
        </el-table-column>
        <el-table-column prop="drugsName" label="药品名"> </el-table-column>
        <el-table-column prop="drugsManuFactor" label="生产企业">
        </el-table-column>
        <el-table-column prop="checkStartTime" label="开始时间" width="100">
        </el-table-column>
        <el-table-column prop="checkEndTime" label="结束时间" width="100">
        </el-table-column>
        <el-table-column label="审核状态" width="100">
          <template slot-scope="scope">
            {{
              scope.row.checkStatus === "0"
                ? "通过"
                : scope.row.checkStatus === "1"
                ? "不通过"
                : scope.row.checkStatus === "2"
                ? "审核中"
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              icon="el-icon-info"
              @click="detailHandle(scope.row)"
              >查看详情</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-success"
              @click="auditBefore(scope.row)"
              :disabled="scope.row.checkStatus === '0'"
              >审核</el-button
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
  getPageDrugReview,
  getLikeDrug,
  getDrugByDrugsName,
  modifyDrug,
} from "@/api/drugApi";
export default {
  data() {
    return {
      dialogVisible: false,
      detailVisible: false,
      descriptionData: {
        drugsName: "",
        drugsManuFactor: "",
        drugsSpecifications: "",
        manufactureTime: "",
        expireTime: "",
        purchasePrice: "",
        salePrice: "",
        isImport: "",
        drugsDesc: "",
        checkStatus: "",
        checkStartTime: "",
        checkEndTime: "",
        checkContent: "",
      },
      dialogAuditData: {
        drugId: "",
        drugsName: "",
        drugsManuFactor: "",
        checkContent: "",
      },
      searchForm: {
        value: "",
        options: [],
        loading: false,
      },
      drugData: [],
      pageSize: 20,
      currentPage: 1,
      total: 1,
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
      getPageDrugReview({ current: val, pageSize: this.pageSize })
        .then((data) => {
          if (data.data.code === 20041) {
            this.total = data.data.data.total;
            this.drugData = data.data.data.drugData;
          }
        })
        .catch((error) => {
          this.$message.error(error);
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
                if (item.checkStatus !== null) {
                  return {
                    label: item.drugsName,
                    value: item.drugsName,
                    drugId: item.drugId.toString(),
                  };
                }
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
            this.drugData = data.data.data;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    detailHandle(row) {
      this.descriptionData.drugsName = row.drugsName;
      this.descriptionData.drugsSpecifications = row.drugsSpecifications;
      this.descriptionData.drugsManuFactor = row.drugsManuFactor;
      this.descriptionData.manufactureTime = row.manufactureTime;
      this.descriptionData.expireTime = row.expireTime;
      this.descriptionData.isImport = row.isImport === "0" ? "是" : "否";
      this.descriptionData.purchasePrice = row.purchasePrice;
      this.descriptionData.salePrice = row.salePrice;
      this.descriptionData.drugsDesc = row.drugsDesc;
      this.descriptionData.checkStatus =
        row.checkStatus === "0"
          ? "通过"
          : row.checkStatus === "1"
          ? "不通过"
          : "审核中";
      this.descriptionData.checkStartTime = row.checkStartTime;
      this.descriptionData.checkEndTime = row.checkEndTime;
      this.descriptionData.checkContent = row.checkContent;
      this.detailVisible = true;
    },
    auditBefore(row) {
      this.dialogAuditData.drugId = row.drugId.toString();
      this.dialogAuditData.drugsName = row.drugsName;
      this.dialogAuditData.drugsManuFactor = row.drugsManuFactor;
      this.dialogAuditData.checkContent = row.checkContent;
      this.dialogVisible = true;
    },
    auditEndOK() {
      modifyDrug({
        drugId: this.dialogAuditData.drugId,
        checkContent: this.dialogAuditData.checkContent,
        checkStatus: "0",
        checkEndTime: this.getNowFormatDate(),
      })
        .then((data) => {
          if (data.data.code === 20031) {
            this.handleCurrentChange(this.currentPage);
            this.dialogVisible = false;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    auditEndNO() {
      modifyDrug({
        drugId: this.dialogAuditData.drugId,
        checkContent: this.dialogAuditData.checkContent,
        checkStatus: "1",
        checkEndTime: this.getNowFormatDate(),
      })
        .then((data) => {
          if (data.data.code === 20031) {
            this.handleCurrentChange(this.currentPage);
            this.dialogVisible = false;
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
.drug-review-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .drug-review-header {
    margin-top: 25px;
    width: 1100px;
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
    margin-top: 10px;
    width: 1150px;
    height: 450px;
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
