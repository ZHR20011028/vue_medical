<template>
  <div class="userRegistered-container">
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
            @click="addPatientHandle"
            >完成</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-card>
      <div class="aside">
        <el-button type="primary" :plain="active !== 1" @click="active = 1"
          >用户注册</el-button
        >
        <el-button type="primary" :plain="active !== 2" @click="active = 2"
          >医护注册</el-button
        >
        <img src="../assets/CT解读.png" alt="" />
      </div>
      <div class="register-content">
        <h1 style="margin-bottom: 30px">欢迎使用分诊系统</h1>
        <el-form
          ref="userForm"
          v-if="active === 1"
          :model="userFrom"
          :rules="userRules"
          style="width: 350px"
        >
          <el-form-item prop="username">
            <el-input
              prefix-icon="el-icon-user"
              v-model="userFrom.username"
              placeholder="请输入用户名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              prefix-icon="el-icon-lock"
              v-model="userFrom.password"
              placeholder="请输入密码"
              show-password
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="checkPassword">
            <el-input
              prefix-icon="el-icon-lock"
              type="password"
              show-password
              clearable
              v-model="userFrom.checkPassword"
              placeholder="请再次输入密码"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-form
          class="doctorFrom"
          v-else-if="active === 2"
          :model="doctorFrom"
          style="width: 350px"
        >
          <el-input
            prefix-icon="iconfont icon-medtitle"
            v-model="doctorFrom.doctorId"
            placeholder="请输入工号"
          ></el-input>
          <el-input
            prefix-icon="el-icon-user"
            v-model="doctorFrom.username"
            placeholder="请输入用户名"
            clearable
          ></el-input>
          <el-input
            type="password"
            prefix-icon="el-icon-lock"
            v-model="doctorFrom.password"
            placeholder="请输入密码"
            show-password
            clearable
          ></el-input>
          <el-input
            prefix-icon="el-icon-lock"
            type="password"
            show-password
            clearable
            v-model="doctorFrom.checkPassword"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form>
        <el-button v-if="active === 1" @click="addInfoHandle">注册</el-button>
        <el-button v-else-if="active === 2" @click="addDoctorHandle"
          >注册</el-button
        >
        <p style="margin-top: 15px">
          已有帐号?<router-link to="/login">去登陆</router-link>
        </p>
      </div>
    </el-card>
  </div>
</template>

<script>
import { addPatient } from "@/api/patientApi";
import { addPatientUser, addDoctorUser } from "@/api/userApi";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.userFrom.checkPassword !== "") {
          this.$refs.ruleForm.validateField("checkPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userFrom.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      active: 1,
      patientForm: {
        patientName: "",
        patientGender: "男",
        patientBirthday: "",
        patientTelephone: "",
        idCard: "",
        address: "",
      },
      doctorFrom: {
        doctorId: "",
        username: "",
        password: "",
        checkPassword: "",
      },
      userFrom: {
        username: "",
        password: "",
        checkPassword: "",
      },
      userRules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 6,
            max: 13,
            message: "长度在 6 到 13 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        checkPassword: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    addInfoHandle() {
      if (this.userFrom.username === "" || this.userFrom.password === "") {
        this.$message.error("账号或密码不能为空");
        return;
      } else if (this.userFrom.password !== this.userFrom.checkPassword) {
        this.$message.error("两次密码不同");
        return;
      } else {
        this.dialogVisible = true;
      }
    },
    addPatientHandle() {
      if (this.patientForm.idCard === "") {
        this.$message.error("请正确的输入身份证号");
        return;
      }
      addPatient(this.patientForm)
        .then((data) => {
          if (data.data.code === 20011) {
            addPatientUser(this.userFrom, this.patientForm.idCard)
              .then((data) => {
                if (data.data.code === 20011) {
                  this.$notify({
                    title: "注册成功",
                    type: "success",
                  });
                  this.dialogVisible = false;
                  this.$router.push("/login");
                } else {
                  this.$notify({
                    title: "注册失败",
                    type: "warning",
                  });
                }
              })
              .catch((error) => {
                this.$message.error(error);
              });
          } else {
            this.$notify({
              title: "注册失败",
              type: "warning",
            });
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    addDoctorHandle() {
      if (this.doctorFrom.doctorId === "") {
        this.$message.error("工号不能为空");
      } else if (
        this.doctorFrom.username === "" ||
        this.doctorFrom.password === ""
      ) {
        this.$message.error("账号或密码不能为空");
        return;
      } else if (this.doctorFrom.password !== this.doctorFrom.checkPassword) {
        this.$message.error("两次密码不同");
        return;
      } else {
        addDoctorUser(this.doctorFrom)
          .then((data) => {
            if (data.data.code === 20011) {
              this.$notify({
                title: "注册成功",
                type: "success",
              });
              this.$router.push("/login");
            } else if (data.data.code === 20010) {
              this.$notify({
                title: "注册失败",
                type: "warning",
              });
            }
          })
          .catch((error) => {
            this.$message.error(error);
          });
      }
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
.userRegistered-container {
  display: flex;
  justify-content: center;
  .el-card {
    margin-top: 150px;
    padding: 0;
    width: 820px;
    height: 450px;
    /deep/ .el-card__body {
      padding: 0;
      display: flex;
      height: inherit;
      justify-content: space-between;
      .aside {
        display: flex;
        flex-direction: column;
        width: 280px;
        border-right: 1px #dcdfe6 solid;
        .el-button {
          margin: 0;
          width: 280px;
          border: none;
          height: 108px;
        }
      }
      .register-content {
        width: 540px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .doctorFrom {
          .el-input {
            margin-bottom: 10px;
          }
        }
      }
    }
  }
}
</style>
