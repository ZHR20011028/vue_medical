<template>
  <el-container>
    <el-row class="row_container">
      <el-col :span="24" class="main_display">
        <h1>欢迎使用医院分诊管理系统</h1>
        <p>这里是系统简介</p>
      </el-col>
    </el-row>
    <el-row class="row_card">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>近期值班表</span>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{ "列表内容 " + o }}
          </div>
          <div class="footer">时间</div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>通知</span>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{ "列表内容 " + o }}
          </div>
          <div class="footer">时间</div>
        </el-card>
      </el-col>
    </el-row>
  </el-container>
</template>
<script>
export default {};
</script>

<style lang="scss" scoped>
.el-container {
  flex-direction: column;
  .row_container {
    width: 100%;
    padding: 48px 0;
    margin-bottom: 30px;
    color: inherit;
    background-color: #eee;
    .main_display {
      max-width: 100%;
      width: 1170px;
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
      h1 {
        font-size: 63px;
        color: inherit;
        margin-top: 20px;
        margin-bottom: 10px;
        font-family: inherit;
        font-weight: 500;
        line-height: 1.1;
        margin: 0.67em 0;
        white-space: nowrap;
      }
      p {
        margin-bottom: 15px;
        font-size: 21px;
        font-weight: 200;
        margin: 0 0 10px;
        display: block;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        white-space: nowrap;
      }
    }
  }
  .row_card {
    margin: 0 100px;
    margin-bottom: 30px;
    .box-card {
      width: 620px;
      /deep/ .el-card__header {
        padding: 10px 20px;
        background-color: #d9edf7;
        .clearfix {
          color: #31708f;
        }
      }
      /deep/.el-card__body {
        padding: 0;
        .footer {
          background-color: #f5f5f5;
          padding: 10px 15px;
          border-top: 1px solid #ddd;
        }
      }
    }
  }
}
</style>
