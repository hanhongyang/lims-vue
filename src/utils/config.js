//id 是你要打印的某个dom元素的id名
export function printExcel(id) {
    // 空页面
    let printStr = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'></head>";
    // 定义element-ui table组件的样式
    const tabStyle = `<style>
    body{padding:0px}
    .divbody{width:100%;margin:0 auto;}
    .text-center{text-align:center;font-size:16px;padding:10px;color:#000;}
    .tableshd{margin:0 auto;text-align:center;width:98%;border:1px solid #000;border-bottom:0;border-left:0;}  
    .tableshd tr td,.tableshd tr th{border:1px solid #000;font-size:12px;padding:2px;line-height: 21px;color:#000;height:23px;word-wrap:break-word;border-top:0;border-right:0;text-align:center}
    .tableshd tr td span{width:80px;display: inline-block;}
</style><body>`;
    let content = "";
    // 获取名为传入id的 dom元素内的内容
    let str = document.getElementById(id).innerHTML;

    // 拼接空页面+style样式+dom内容
    content = content + str;
    printStr = printStr + tabStyle + content + "</body></html>";
    // 打开新页面
    let pwin = window.open("_blank");
    document.getElementById(id).style.zoom = 0.2;
    // 将内容赋值到新页面
    pwin.document.write(printStr);
    pwin.document.close();
    // 聚焦-不加focuse，在某些情况下，打印页面会有问题。
    pwin.focus();
    // 使用setTimeout，等页面dom元素渲染完成后再打印。
    setTimeout(() => {
        pwin.print(); // 打印功能。 例如 window.print() 直接打印当前整个页面。 
        pwin.close(); // 关闭 打印创建的当前页面
    }, 500);

}
//id 是你要打印的某个dom元素的id名
export function printExceldz(id) {
    // 空页面
    let printStr = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'></head>";
    // 定义element-ui table组件的样式
    const tabStyle = `<style>
    body{padding:0px}
    @page {
    size: auto;
    margin:100px 50px;
}
    .divbody{width:100%;margin:0 auto;}
    .text-center{text-align:center;font-size:16px;padding:10px;color:#000;}
    .tableshd{margin:0 auto;text-align:center;width:98%;border:1px solid #000;border-bottom:0;border-left:0;}  
    .tableshd tr td,.tableshd tr th{border:1px solid #000;font-size:12px;padding:2px;line-height: 21px;color:#000;height:23px;word-wrap:break-word;border-top:0;border-right:0;text-align:center}
    .tableshd tr td span{width:80px;display: inline-block;}
</style><body>`;
    let content = "";
    // 获取名为传入id的 dom元素内的内容
    let str = document.getElementById(id).innerHTML;

    // 拼接空页面+style样式+dom内容
    content = content + str;
    printStr = printStr + tabStyle + content + "</body></html>";
    // 打开新页面
    let pwin = window.open("_blank");
    document.getElementById(id).style.zoom = 0.2;
    // 将内容赋值到新页面
    pwin.document.write(printStr);
    pwin.document.close();
    // 聚焦-不加focuse，在某些情况下，打印页面会有问题。
    pwin.focus();
    // 使用setTimeout，等页面dom元素渲染完成后再打印。
    setTimeout(() => {
        pwin.print(); // 打印功能。 例如 window.print() 直接打印当前整个页面。 
        pwin.close(); // 关闭 打印创建的当前页面
    }, 500);

}
// 数字金额转大写
export const numToCny = (money) => {
    // 汉字的数字
    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆',
        '柒', '捌', '玖');
    // 基本单位
    var cnIntRadice = new Array('', '拾', '佰', '仟');
    // 对应整数部分扩展单位
    var cnIntUnits = new Array('', '万', '亿', '兆');
    // 对应小数部分单位
    var cnDecUnits = new Array('角', '分', '毫', '厘');
    // 整数金额时后面跟的字符
    var cnInteger = '整';
    // 整型完以后的单位
    var cnIntLast = '元';
    // 最大处理的数字
    var maxNum = 999999999999999.9999;
    // 金额整数部分
    var integerNum;
    // 金额小数部分
    var decimalNum;
    // 输出的中文金额字符串
    var chineseStr = '';
    // 分离金额后用的数组，预定义
    var parts;
    if (money == '') {
        return '';
    }
    money = parseFloat(money);
    if (money >= maxNum) {
        // 超出最大处理数字
        return '';
    }
    if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
    }
    // 转换为字符串
    money = money.toString();
    if (money.indexOf('.') == -1) {
        integerNum = money;
        decimalNum = '';
    } else {
        parts = money.split('.');
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
    }
    // 获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
            var n = integerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                // 归零
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)]
                    + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += cnIntLast;
    }
    // 小数部分
    if (decimalNum != '') {
        var decLen = decimalNum.length;
        for (var i = 0; i < decLen; i++) {
            var n = decimalNum.substr(i, 1);
            if (n != '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (chineseStr == '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum == '') {
        chineseStr += cnInteger;
    }
    return chineseStr;
}

