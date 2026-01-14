
import { csfhy } from "@/api/hyd";
import Decimal from "decimal.js";

export default {
    data() {
        return {
            cachedCsfhyData: null,
        };
    },
    methods: {

        //废弃
        //async csfhyMixinHandler() {
        //   try {
        //     const saveResult = await this.submitForm(true);
        //   if (!saveResult.success) {
        //     this.$message.error('主单据保存失败，无法进行初水分化验');
        //   return;
        //}
        //const res = await csfhy(this.Details.opJczxFeedResultBaseId);
        // const routeParams = {
        //      parentId: this.Details.opJczxFeedResultBaseId,
        //       sampleInfo: this.Details.infoList.map(item => ({
        //          sampleNo: item.sampleNo,
        //          sampleName: item.sampleName,
        //          entrustOrderItemId: item.entrustOrderItemId,
        //          entrustOrderSampleId: item.entrustOrderSampleId
        //      })),
        //      existingData: res.code === 200 && res.data ? res.data : null
        //  };
        //  this.$router.push({
        //      path: '/JJ15Pad',
        //      query: routeParams
        //  });
        // } catch (error) {
        //     console.error('查询初水分数据失败:', error);
        //     this.$message.error('查询初水分数据失败');
        // }
        //},
        async loadCsfhyDataAndCalculateMixin() {
            console.log('开始加载初水分数据 (Mixin)...');
            // 检查 infoList 是否存在且有数据
            if (!this.Details || !this.Details.infoList || this.Details.infoList.length === 0) {
                console.log('主单据样品列表为空，无法查询初水分数据');
                return;
            }

            // 提取 entrustOrderSampleId 列表
            const sampleList = this.Details.infoList
                .map(item => item.entrustOrderSampleId)
                .filter(id => id); // 过滤掉可能为空的ID

            if (sampleList.length === 0) {
                console.log('未能从主单据样品列表中提取有效的 entrustOrderSampleId');
                return;
            }

            console.log('查询初水分数据，参数 sampleList:', sampleList);

            try {
                // 调用修改后的 csfhy 接口，传入 sampleList
                const res = await csfhy(sampleList); // 修改调用方式
                if (res.code === 200 && res.data) {
                    console.log('初水分数据加载成功 (Mixin):', res.data);
                    this.cachedCsfhyData = res.data;
                    // 后续处理逻辑不变
                    this.calculateFreshSampleMixin(res.data);
                    // 如果需要在 Mixin 中单独计算每个 item 的鲜样含量（通常在 updateValues 调用），
                    // 可以保留这个循环，或者确保在主组件的 updateValues 中调用 calculateFreshSampleForItemMixin
                    // this.Details.infoList.forEach(item => {
                    //     this.calculateFreshSampleForItemMixin(item);
                    // });
                } else {
                    console.warn('加载初水分数据失败或无数据:', res);
                }
            } catch (error) {
                console.error('加载初水分数据失败 (Mixin):', error);
                // 即使加载失败，也尝试触发一次计算，以防某些字段依赖默认值
                this.Details.infoList.forEach(item => {
                    this.calculateFreshSampleForItemMixin(item);
                });
            }
        },

        calculateFreshSampleForItemMixin(item) {
            console.log(`尝试为样品 ${item.sampleNo} 计算鲜样含量... 平均值: ${item.average}`);
            // average 必须有值才能计算
            if (item.average === null || item.average === undefined || item.average === '') {
                console.log(`样品 ${item.sampleNo} 平均值为空，跳过鲜样含量计算`);
                this.$set(item, 'xyzhl', ''); // 确保清空旧值
                return;
            }
            let csfValue = null;
            if (this.cachedCsfhyData && this.cachedCsfhyData.infoList) {
                const csfItem = this.cachedCsfhyData.infoList.find(csf =>
                    // 优先使用 entrustOrderSampleId 匹配，其次 sampleNo
                    (csf.entrustOrderSampleId && csf.entrustOrderSampleId === item.entrustOrderSampleId) ||
                    (csf.sampleNo && csf.sampleNo === item.sampleNo)
                );
                console.log(`为样品 ${item.sampleNo} 匹配到的初水分项:`, csfItem);
                if (csfItem && (csfItem.csf || csfItem.csf === 0)) { // 检查 csf 是否存在或为 0
                    csfValue = csfItem.csf;
                }
            }

            if (csfValue !== null) {
                console.log(`找到样品 ${item.sampleNo} 的初水分值: ${csfValue}`);
                this.calculateSingleFreshSampleMixin(item, csfValue);
            } else {
                console.log(`未找到样品 ${item.sampleNo} 对应的初水分值，鲜样含量设置为空`);
                this.$set(item, 'xyzhl', ''); // 如果没有初水分数据，清空鲜样含量
            }
        },

        calculateSingleFreshSampleMixin(item, csfValue) {
            try {
                // 再次检查 average 是否有效
                if (item.average === null || item.average === undefined || item.average === '') {
                    console.error(`计算鲜样含量错误: 样品 ${item.sampleNo} 的 average 值无效`);
                    this.$set(item, 'xyzhl', '');
                    return;
                }
                const average = new Decimal(item.average); // average 应该是计算后的值
                const csf = new Decimal(csfValue);

                // 公式： 鲜样含量 = 平均值 * (100 - 初水分) / 100
                const result = average.times(new Decimal(100).minus(csf)).dividedBy(100);

                // 假设 formatPrecision 方法存在于主组件或另一个 Mixin 中
                // const formattedResult = typeof this.formatPrecision === 'function'
                //     ? this.formatPrecision(result)
                //     : result.toFixed(3); // 默认保留两位小数
                const formattedResult = result.toSignificantDigits(3).toString();

                console.log(`计算样品 ${item.sampleNo} 鲜样含量: ${average} * (100 - ${csf}) / 100 = ${formattedResult}`);
                this.$set(item, 'xyzhl', formattedResult);
            } catch (error) {
                console.error(`计算样品 ${item.sampleNo} 的单个鲜样含量错误:`, error);
                this.$set(item, 'xyzhl', ''); // 出错时清空
            }
        },

        calculateFreshSampleMixin(csfhyData) {
            console.log('批量计算鲜样含量 (Mixin)...');
            if (!csfhyData || !csfhyData.infoList || !this.Details || !this.Details.infoList) {
                console.log('缺少计算鲜样含量所需的数据');
                return;
            }
            this.Details.infoList.forEach(mainItem => {
                // 调用单个计算方法
                this.calculateFreshSampleForItemMixin(mainItem);
            });
            console.log('批量计算鲜样含量完成 (Mixin)');
        }
    }
};
