<template>
  <div class="header-container">
    <el-dialog
      title="个人信息"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="patientForm" label-width="80px" size="small">
        <el-form-item label="姓名">
          <el-input v-model="patientForm.patientName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="patientForm.patientGender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="patientForm.patientBirthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="patientForm.patientTelephone"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="patientForm.idCard"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="patientForm.address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            style="width: 180px; margin-left: 30px"
            @click="addPatientEnd"
            >完成</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-drawer title="个人信息" :visible.sync="drawer" :with-header="false">
      <div class="drawer-container">
        <div class="drawer-herder">
          <el-avatar icon="el-icon-user-solid"></el-avatar>
          <span>{{ username }}</span>
        </div>
        <div class="drawer-content">
          <el-descriptions
            v-if="id === 'doctor'"
            class="margin-top"
            title="个人信息"
            :column="2"
            border
          >
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user"></i>
                姓名
              </template>
              {{ descriptionData.doctorName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i
                  v-if="descriptionData.doctorGender === '男'"
                  class="el-icon-male"
                ></i>
                <i v-else class="el-icon-female"></i>
                性别
              </template>
              {{ descriptionData.doctorGender }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template slot="label">
                <i class="el-icon-date"></i>
                出生日期
              </template>
              {{ descriptionData.doctorBirthday }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template slot="label">
                <i class="el-icon-mobile-phone"></i>
                电话
              </template>
              {{ descriptionData.doctorTelephone }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template slot="label">
                <i class="iconfont icon-medtitle"></i>
                职称
              </template>
              {{ descriptionData.jobTitle }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template slot="label">
                <i class="iconfont icon-youxiang"></i>
                邮箱
              </template>
              {{ descriptionData.email }}
            </el-descriptions-item>
          </el-descriptions>
          <el-descriptions
            v-else-if="id === 'patient'"
            class="margin-top"
            title="个人信息"
            :column="2"
            border
          >
            <template slot="extra">
              <el-button type="primary" size="small" @click="modifyPatientStart"
                >修改</el-button
              >
            </template>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user"></i>
                姓名
              </template>
              {{ descriptionData.patientName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i
                  v-if="descriptionData.patientGender === '男'"
                  class="el-icon-male"
                ></i>
                <i v-else class="el-icon-female"></i>
                性别
              </template>
              {{ descriptionData.patientGender }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-date"></i>
                出生日期
              </template>
              {{ descriptionData.patientBirthday }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-mobile-phone"></i>
                电话
              </template>
              {{ descriptionData.patientTelephone }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template slot="label">
                <i class="el-icon-s-order"></i>
                身份证号
              </template>
              {{ descriptionData.idCard }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template slot="label">
                <i class="el-icon-location"></i>
                地址
              </template>
              {{ descriptionData.address }}
            </el-descriptions-item>
          </el-descriptions>
          <div class="admin-div" v-else>
            <img src="../assets/OIP-C.jpg" alt="" />
          </div>
          <el-card v-if="id === 'patient'" class="patient-card">
            <div slot="header">
              <span>消息</span>
            </div>
            <div v-for="o in registerData" :key="o.index" class="text item">
              {{
                "请到" +
                o.deptName +
                "科室，地址为" +
                o.deptLocation +
                "，你的号码为" +
                o.deptRank
              }}
            </div>
          </el-card>
          <el-card
            v-else-if="id === 'doctor'"
            class="doctor-card"
            shadow="hover"
          >
            <img src="../assets/讨论病情.png" alt="" />
          </el-card>
        </div>
        <div class="drawer-footer">
          <span v-if="id === 'doctor'">
            工号：{{ descriptionData.doctorId + "" }}
          </span>
          <el-button type="danger" @click="logOffHandle">退出登录</el-button>
        </div>
      </div>
    </el-drawer>
    <div class="l_content">
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        background-color="#f8f8f8"
        text-color="#777"
      >
        <h3>分诊管理系统</h3>
        <el-menu-item
          @click="clickMenu(item)"
          v-for="item in noChildren"
          :key="item.name"
          :index="item.name"
          >{{ item.label }}</el-menu-item
        >
        <el-submenu
          v-for="subItem in hasChildren"
          :key="subItem.label"
          :index="subItem.label"
        >
          <template slot="title">{{ subItem.label }}</template>
          <el-menu-item
            @click="clickMenu(item)"
            v-for="item in subItem.children"
            :key="item.name"
            :index="item.name"
            >{{ item.label }}</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </div>
    <div class="r_content">
      <el-button @click="drawer = true" circle
        ><el-avatar icon="el-icon-user-solid"></el-avatar
      ></el-button>
    </div>
  </div>
</template>

<script>
import Cookie from "js-cookie";
import { getRegisterData } from "@/api/userApi";
import { modifyPatient, getPatientByPatientId } from "@/api/patientApi";
export default {
  data() {
    return {
      dialogVisible: false,
      drawer: false,
      id: "",
      descriptionData: {},
      username: "",
      registerData: [],
      patientForm: {},
    };
  },
  mounted() {
    this.getDescriptionData();
    this.getRegistered();
  },
  computed: {
    noChildren() {
      return this.menuData.filter((item) => !item.children);
    },
    hasChildren() {
      return this.menuData.filter((item) => item.children);
    },
    menuData() {
      return JSON.parse(localStorage.getItem("menuData"));
    },
  },
  methods: {
    //点击菜单
    clickMenu(item) {
      //当前页面的路由与跳转的路由不一致时才允许跳转
      if (
        this.$route.path !== item.path &&
        !(this.$route.path === "/home" && item === "/")
      ) {
        this.$router.push(item.path);
      }
    },
    getDescriptionData() {
      this.id = localStorage.getItem("id");
      this.username = JSON.parse(localStorage.getItem("userData")).username;
      if (this.id === "doctor") {
        this.descriptionData = JSON.parse(localStorage.getItem("doctorData"));
      } else if (this.id === "patient") {
        this.descriptionData = JSON.parse(localStorage.getItem("patientData"));
      }
    },
    logOffHandle() {
      localStorage.clear();
      // 获取所有的cookie
      const allCookies = Cookie.get();

      // 遍历所有cookie的键并逐个删除
      Object.keys(allCookies).forEach((cookieName) =>
        Cookie.remove(cookieName)
      );

      this.$router.push("/login");
    },
    getRegistered() {
      let _patientId = "";
      if (JSON.parse(localStorage.getItem("patientData")) !== null) {
        _patientId = JSON.parse(
          localStorage.getItem("patientData")
        ).patientId.toString();
      }
      getRegisterData({
        patientId: _patientId,
      })
        .then((data) => {
          if (data.data.code === 20041) {
            this.registerData.push({
              deptName: data.data.data.deptName,
              deptRank: data.data.data.deptRank,
              deptLocation: data.data.data.deptLocation,
            });
          } else if (data.data.code === 20040) {
            this.registerData = [];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    modifyPatientStart() {
      if (this.id === "patient") {
        this.patientForm = JSON.parse(localStorage.getItem("patientData"));
        this.dialogVisible = true;
      }
    },
    addPatientEnd() {
      modifyPatient(this.patientForm)
        .then((data) => {
          if (data.data.code === 20031) {
            getPatientByPatientId({
              patientId: this.patientForm.patientId.toString(),
            }).then((data) => {
              if (data.data.code === 20041) {
                localStorage.setItem(
                  "patientData",
                  JSON.stringify(data.data.data)
                );
                this.descriptionData = data.data.data;
              }
            });
            this.$notify({
              title: "修改成功",
              type: "success",
            });
            this.dialogVisible = false;
          } else if (data.data.code === 20030) {
            this.$notify({
              title: "修改失败",
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
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  background-color: #f8f8f8;
  border-bottom: solid 1px #e6e6e6;
  .l_content {
    .el-menu {
      display: flex;
      align-items: center;
      border-bottom: none;
      h3 {
        width: 180px;
        height: 20px;
        text-align: center;
        font-size: 30px;
        color: #777;
        line-height: 20px;
        margin: 15px;
        white-space: nowrap;
      }
    }
  }
  .r_content {
    display: flex;
    align-items: center;
    margin-right: 20px;
    .el-button {
      padding: 0;
      overflow: hidden;
      img {
        display: block;
        width: 40px; /* 头像大小 */
        height: 40px; /* 头像大小 */
        border-radius: 50%; /* 圆形边框 */
        object-fit: cover; /* 保证图片覆盖整个区域 */
      }
    }
  }
  .drawer-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    .drawer-herder {
      display: flex;
      align-items: center;
      .el-avatar {
        margin: 5px 10px;
      }
    }
    .drawer-content {
      .el-descriptions {
        margin: 10px;
      }
      .admin-div {
        margin: 10px 30px;
        img {
          width: auto;
          max-width: 480px;
          height: 580px;
          object-fit: cover;
        }
      }
      .patient-card {
        height: 300px;
        margin: 20px 10px;
      }
      .doctor-card {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 280px;
        margin: 20px 10px;
        img {
          /* 设置宽度等于父元素的宽度 */
          width: 280px;
          /* 设置最大宽度为100%，以防图片宽度超过父元素 */
          max-width: 280px;
          /* 设置高度自动适应，保证图片不会拉伸或压缩 */
          height: auto;
          /* 当宽度和高度都设置了值，你可能需要设置 object-fit 属性 */
          /* 'cover' 表示图片总是填充满父容器，图片可能会被剪裁 */
          /* 'contain' 表示图片总是完全显示，可能会在父容器内留有空白 */
          object-fit: cover;
        }
      }
    }
    .drawer-footer {
      width: 400px;
      margin-bottom: 20px;
      margin-left: 15px;
      .el-button {
        position: absolute;
        right: 15px;
      }
    }
  }
}
</style>
