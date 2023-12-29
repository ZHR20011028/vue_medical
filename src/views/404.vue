<template>
  <div class="error-page">
    <h1>404</h1>
    <h2>页面未找到</h2>
    <p>您正在寻找的页面不存在或已移动,请稍后再试。</p>
    
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

h1 {
  font-size: 8rem;
  margin: 0;
}

h2 {
  font-size: 2rem;
  margin-top: 10px;
}

p {
  font-size: 1.5rem;
  margin-top: 20px;
}

.back-home {
  display: inline-block;
  margin-top: 30px;
  padding: 10px 20px;
  background-color: #42b983; /* 可以自定义颜色 */
  color: white; /* 可以自定义颜色 */
  text-decoration: none;
  border-radius: 5px;
}
</style>
