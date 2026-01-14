export default class func {

  /**
   * 数组判断是否为空
   * @param val
   */
  static arrayIsEmpty(val) {
    const filter = this.filterArray(val)
    if (filter.length > 0) {
      return false
    }
    return true
  }

  /**
   * 过滤数组中的空值
   * @param val
   * @returns {*}
   */
  static filterArray(val) {
    return val.filter(item => !this.isEmpty(item))
  }

  /**
   * 为空
   * @param val
   * @returns {boolean}
   */
  static isEmpty(val) {
    if (
      val === null ||
      typeof val === 'undefined' ||
      (typeof val === 'string' && val === '' && val !== 'undefined')
    ) {
      return true
    }
    return false
  }

  static isNotEmpty(val){
    return !this.isEmpty(val)
  }

  static isVehicleNumber(vehicleNumber) {
    const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
    const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
    if (this.isEmpty(vehicleNumber)) {
      return false
    }
    if (vehicleNumber.length === 7) {
      return creg.test(vehicleNumber)
    } else if (vehicleNumber.length === 8) {
      return xreg.test(vehicleNumber)
    } else {
      return false
    }
  }

  static isVehiclePhone(vehicleNumber){
    return !/^1[3456789]\d{9}$/.test(vehicleNumber)
  }

  static isNumber(val){
    return Number(val)
  }
  /**
   * 根据逗号联合
   * @param arr
   * @returns {string}
   */
  static join(arr) {
    return arr ? arr.join(',') : '';
  }

}
