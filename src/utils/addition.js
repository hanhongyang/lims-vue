// 可以全局挂载在main.js文件中再优化一下，可以新建config文件，创建js文件，专门放公共方法，然后在main.js中importconfig文件  util.js

// 乘法
export function NumberMul(arg1, arg2) {
  var m = 0;
  var s1 = arg1.toString();
  var s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) { }
  try {
    m += s2.split(".")[1].length;
  } catch (e) { }

  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}


// 除法
// 除数，被除数， 保留的小数点后的位数
export function NumberDiv(arg1, arg2, digit) {
  var t1 = 0, t2 = 0, r1, r2;
  try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
  try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
  r1 = Number(arg1.toString().replace(".", ""))
  r2 = Number(arg2.toString().replace(".", ""))
  //获取小数点后的计算值
  var result = ((r1 / r2) * Math.pow(10, t2 - t1)).toString()
  var result2 = result.split(".")[1];
  result2 = result2.substring(0, digit > result2.length ? result2.length : digit);

  return Number(result.split(".")[0] + "." + result2);
}

// 加法
export function NumberAdd(arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m + arg2 * m) / m).toFixed(n);
}


// 减法
export function NumberSub(arg1, arg2) {
  var re1, re2, m, n;
  try {
    re1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    re1 = 0;
  }
  try {
    re2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    re2 = 0;
  }
  m = Math.pow(10, Math.max(re1, re2));
  n = (re1 >= re2) ? re1 : re2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
