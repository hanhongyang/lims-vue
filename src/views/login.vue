<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">{{ title }}</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
          @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%"
          @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
          @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <!-- <span>Copyright © 2018-2025 ruoyi.vip All Rights Reserved.</span> -->
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      title: process.env.VUE_APP_TITLE,
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
    this.isPadPc()
  },
  methods: {
    /** 检测是否为真正的平板设备 */
    isTabletDevice() {
      const userAgent = navigator.userAgent.toLowerCase();

      // 1. 首先排除明确的桌面设备
      const isWindows = /windows nt/.test(userAgent);
      const isMac = /macintosh/.test(userAgent) && !('ontouchend' in document);
      const isLinuxDesktop = /linux/.test(userAgent) && !/android/.test(userAgent);

      // 如果是桌面操作系统，直接返回false
      if (isWindows || isMac || isLinuxDesktop) {
        // Windows平板需要特殊判断（Surface等）
        if (isWindows) {
          // Windows平板通常有这些特征
          const isWindowsTablet = /tablet/.test(userAgent) ||
            (/touch/.test(userAgent) && window.screen.width <= 1366 &&
              'ontouchstart' in window && navigator.maxTouchPoints > 1);
          return isWindowsTablet;
        }
        return false;
      }

      // 2. iPad检测（包括新版iPad Safari伪装成Mac的情况）
      const isIPad = /ipad/.test(userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      // 3. Android平板检测
      const isAndroid = /android/.test(userAgent);
      const isMobile = /mobile/.test(userAgent);
      const isAndroidTablet = isAndroid && !isMobile;

      // 4. 综合判断
      return isIPad || isAndroidTablet;
    },

    /** 检测是否为华为平板 */
    isHuaweiPad() {
      const userAgent = navigator.userAgent.toLowerCase();

      // 必须是Android设备
      const isAndroid = /android/.test(userAgent);
      if (!isAndroid) return false;

      // 华为/荣耀品牌检测
      const isHuawei = /huawei|honor/.test(userAgent);

      // 非手机（平板）
      const isMobile = /mobile/.test(userAgent);

      return isHuawei && !isMobile;
    },

    /** 综合判断设备类型 */
    getDeviceType() {
      // 优先检测华为平板
      if (this.isHuaweiPad()) {
        return 'huawei-pad';
      }

      // 检测其他平板
      if (this.isTabletDevice()) {
        return 'pad';
      }

      // 默认PC
      return 'pc';
    },

    isPadPc() {
      const deviceType = this.getDeviceType();
      console.log('检测到设备类型:', deviceType);
      console.log('UserAgent:', navigator.userAgent);
      console.log('屏幕尺寸:', window.screen.width, 'x', window.screen.height);
      console.log('触摸点数:', navigator.maxTouchPoints);

      // 存储设备类型，供其他地方使用
      this.deviceType = deviceType;
    },
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;

          // 1. 处理记住密码的Cookie存储
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }

          // 2. 创建登录请求数据（加密密码）
          const loginData = {
            ...this.loginForm,
            password: encrypt(this.loginForm.password) // 加密密码后再发送
          }

          // 3. 发送加密后的登录请求
          this.$store.dispatch("Login", loginData).then(() => {
            const deviceType = this.getDeviceType();

            if (deviceType === 'huawei-pad' || deviceType === 'pad') {
              this.$router.push('/pad');
            } else {
              this.$router.push({ path: this.redirect || "/" }).catch(() => { });
            }
          }).catch(() => {
            this.loading = false;
            if (this.captchaEnabled) {
              this.getCode();
            }
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  margin-left: 900px;
  margin-top: 100px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 38px;
}
</style>