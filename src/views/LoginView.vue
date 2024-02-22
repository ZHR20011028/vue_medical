<template>
  <div class="login-container" :style="windowStyle">
    <el-card shadow="hover">
      <img src="../assets/login_background.jpg" alt="" />
      <div class="login-from">
        <h2>账号密码登录</h2>
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item prop="username">
            <el-input
              prefix-icon="el-icon-user"
              v-model="form.username"
              clearable
              placeholder="请输入账号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="inputIcon"
              @focus="handleFocus"
              @blur="handleBlur"
              v-model="form.password"
              clearable
              placeholder="请输入密码"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" @click="loginHandle"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
        <p>没有账号？<router-link to="/userRegistered">去注册</router-link></p>
      </div>
    </el-card>
  </div>
</template>
<script>
import { login } from "@/api/userApi";
import { addLog } from "@/api/logApi";
import Cookie from "js-cookie";
import moment from "moment";
export default {
  data() {
    return {
      windowStyle: {
        width: "100%",
        height: "100%",
      },
      form: {
        password: "",
        username: "",
      },
      checked: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { max: 10, message: "不能大于10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { max: 10, message: "不能大于10个字符", trigger: "blur" },
        ],
      },
      inputFocused: false,
    };
  },
  computed: {
    inputIcon() {
      return this.inputFocused ? "el-icon-unlock" : "el-icon-lock";
    },
  },
  mounted() {
    this.updateWindowSize();
    window.addEventListener("resize", this.updateWindowSize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateWindowSize);
  },
  methods: {
    handleFocus() {
      this.inputFocused = true;
    },
    handleBlur() {
      this.inputFocused = false;
    },
    updateWindowSize() {
      this.windowStyle.width = window.innerWidth + "px";
      this.windowStyle.height = window.innerHeight + "px";
    },
    loginHandle() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          login({
            username: this.form.username,
            password: this.form.password,
          })
            .then((data) => {
              if (data.data.code === 20041) {
                let permissions = 1;
                if (data.data.data.doctorData != null) {
                  permissions = 2;
                } else if (data.data.data.patientData !== null) {
                  permissions = 3;
                }
                this.$store.commit("setRouterAndNavData", permissions);
                localStorage.setItem(
                  "userData",
                  JSON.stringify(data.data.data.userData)
                );
                localStorage.setItem(
                  "doctorData",
                  JSON.stringify(data.data.data.doctorData)
                );
                localStorage.setItem(
                  "patientData",
                  JSON.stringify(data.data.data.patientData)
                );
                Cookie.set("token", data.data.data.token);
                addLog({
                  userId: data.data.data.userData.userId.toString(),
                  logContent: "登录日志",
                  createTime: moment().format("YYYY-MM-DD hh:mm:SS"),
                });
                this.$notify({
                  title: "登录成功",
                  type: "success",
                });
                this.$router.push("/home");
              } else if (data.data.code === 20040) {
                this.$notify({
                  title: "登录失败",
                  type: "error",
                  message: "账号或密码错误",
                });
              } else {
                this.$message.error("请求超时，请稍后再试！");
              }
            })
            .catch((error) => {
              this.$message.error(error);
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  background-color: #eff0f4;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-card {
    width: 1000px;
    /deep/ .el-card__body {
      padding: 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      img {
        width: 600px;
        height: 400px;
      }
    }
    .login-from {
      width: 400px;
      height: 400px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      h2 {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
