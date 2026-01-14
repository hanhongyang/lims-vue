function listen() {
  const origin = {
    open: XMLHttpRequest.prototype.open,
    send: XMLHttpRequest.prototype.send
  }

  XMLHttpRequest.prototype.open = function () {
    origin.open.apply(this, arguments)
  }
  XMLHttpRequest.prototype.send = function () {
    this.setRequestHeader('eiversion', '')
    this.setRequestHeader('Authorization', getTokenFromCookie())
    origin.send.apply(this, arguments)
  }

}

listen()


function getTokenFromCookie() {
  const cookies = document.cookie.split(';'); // 获取所有cookie并拆分成数组
  let token = null;
  debugger
  for (const cookie of cookies) {
    debugger
    const [name, value] = cookie.trim().split('='); // 拆分键值对

    if (name === 'Authorization_gdtsrm') {
      token = decodeURIComponent(value); // 找到名为'token'的cookie的值
      break;
    }
  }
  return token;
}

// const token = getTokenFromCookie();
// if (!token) {
//   window.location = '/login'
// }
