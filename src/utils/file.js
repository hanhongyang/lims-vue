// 图片转为base64格式
export const imageToBase64 = (img) => {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
  var dataURL = canvas.toDataURL("image/" + ext);
  return dataURL;
};

export const base64ToFile = (urlData, fileName) => {
  let arr = urlData.split(',');
  let mime = arr[0].match(/:(.*?);/)[1];
  let bytes = atob(arr[1]); // 解码base64
  let n = bytes.length;
  let ia = new Uint8Array(n);
  while (n--) {
    ia[n] = bytes.charCodeAt(n);
  }
  return new File([ia], fileName, { type: mime });
};
// 图片压缩
export const compressedImage = (params) => {
  var initParams = {
    src: params.src || "",
    quality: params.quality || 1,
  };
  var image = new Image();
  image.src = initParams.src;
  image.onload = function () {
    //获取图片初始宽高
    var width = image.width;
    var height = image.height;
    //判断图片宽度，再按比例设置宽度和高度的值
    if (width > 1024) {
      // width = 1024;
      // height = Math.ceil(1024 * (image.height / image.width));
      width = width * 0.5;
      height = height * 0.5;
      console.log(width);
    }
    //将图片重新画入canvas中
    var canvas = document.getElementById("compressCanvas");
    if (!canvas) { //创建一个canvas画布
      var body = document.body;
      canvas = document.createElement("canvas"); //创建canvas标签
      canvas.id = "compressCanvas"; //给外层容器添加一个id
      canvas.style.position = "fixed";
      canvas.style.zIndex = "-1";
      canvas.style.opacity = "0";
      canvas.style.top = "-100%";
      canvas.style.left = "-100%";
      body.append(canvas);
    }

    var context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    context.beginPath();
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.fill();
    context.closePath();
    context.drawImage(image, 0, 0, width, height);
    var replaceSrc = canvas.toDataURL("image/jpeg", initParams.quality); //canvas转DataURL(base64格式)

    params.success && params.success(replaceSrc);
  };
};

/* 图片压缩方法-canvas压缩 */
export const compressUpload = (image, file) => {
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  let initSize = image.src.length;
  let { width } = image, { height } = image;
  canvas.width = width * 0.6;
  canvas.height = height * 0.6;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // 进行最小压缩0.1
  //  compressData = canvas.toDataURL(file.type || 'image/jpeg', 0.1);
  let compressData = canvas.toDataURL(file.type || "image/jpeg", 0.5); //canvas转DataURL(base64格式)

  // 压缩后调用方法进行base64转Blob，方法写在下边
  let blobImg = dataURItoBlob(compressData);
  return blobImg;
};

/* base64转Blob对象 */
export const dataURItoBlob = (data) => {
  let byteString;
  if (data.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(data.split(',')[1]);
  } else {
    byteString = unescape(data.split(',')[1]);
  }
  let mimeString = data
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];
  let ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], { type: mimeString });
};

// 在 utils/file.js 的末尾添加以下方法：

/**
 * 将canvas转换为base64并压缩
 * @param {HTMLCanvasElement} canvas - canvas元素
 * @param {number} quality - 压缩质量，0-1，默认0.8
 * @param {number} maxWidth - 最大宽度，默认不缩放
 * @param {string} format - 图片格式，默认'image/png'
 * @returns {string} base64数据
 */
export const canvasToCompressedBase64 = (canvas, quality = 0.8, maxWidth = null, format = 'image/png') => {
  let targetCanvas = canvas;
  
  // 如果需要缩放
  if (maxWidth && canvas.width > maxWidth) {
    const scale = maxWidth / canvas.width;
    const width = canvas.width * scale;
    const height = canvas.height * scale;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext('2d');
    
    // 设置白色背景（对于签名很重要）
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    // 绘制缩放后的图像
    ctx.drawImage(canvas, 0, 0, width, height);
    targetCanvas = tempCanvas;
  }
  
  // 返回压缩后的base64
  return targetCanvas.toDataURL(format, quality);
};