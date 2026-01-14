import { csfhyJHY } from "@/api/hyd";
import Decimal from "decimal.js";

export default {
    data() {
        return {
            cachedCsfhyData: null,
        };
    },
    methods: {
        /**
         * 加载初水分数据
         */
        async loadCsfhyDataAndCalculateMixin() {
            console.log('========== 开始加载初水分数据 (JHY) ==========');

            if (!this.Details?.infoList?.length) {
                console.log('样品列表为空，跳过');
                return;
            }

            // 提取样品ID列表
            const sampleList = this.Details.infoList
                .map(item => item.opFeedEntrustOrderSampleId)
                .filter(id => id);

            console.log('提取的样品ID:', sampleList);

            if (sampleList.length === 0) {
                console.log('未能提取有效的样品ID');
                return;
            }

            try {
                const res = await csfhyJHY(sampleList);
                console.log('初水分接口返回:', res);

                if (res.code === 200 && res.data) {
                    this.cachedCsfhyData = res.data.infoList;
                    console.log('初水分数据已缓存:', this.cachedCsfhyData);

                    // 批量计算所有样品
                    this.calculateFreshSampleMixin(res.data);
                } else {
                    console.warn('初水分数据为空或加载失败');
                }
            } catch (error) {
                console.error('加载初水分数据失败:', error);
            }
        },

        /**
         * ★★★ 核心方法：计算单个样品的鲜样含量（适配嵌套结构）★★★
         */
        calculateFreshSampleForItemMixin(item) {
            console.log('---------- 计算鲜样含量 ----------');
            console.log('样品编号:', item.sampleNo);
            console.log('缓存数组当前内容:', JSON.parse(JSON.stringify(this.cachedCsfhyData)));
            console.log('待匹配样品:', {
                sampleNo: item.sampleNo,
                opFeedEntrustOrderSampleId: item.opFeedEntrustOrderSampleId,
             
            });
            console.log('缓存里每条:', this.cachedCsfhyData.map(e => ({
                sampleNo: e.sampleNo,
                opFeedEntrustOrderSampleId: e.opFeedEntrustOrderSampleId,
                csf: e.csf
            })));
            // 1. 检查 testItem 是否存在
            // if (!item.testItem || item.testItem.length === 0) {
            //     console.log('testItem 为空，跳过');
            //     return;
            // }

            // 2. 查找该样品对应的初水分值
            let csfValue = null;

            if (this.cachedCsfhyData) {
                console.log('缓存数组长度:', this.cachedCsfhyData);
                const csfItem = this.cachedCsfhyData.find(csf =>
                    
                    (csf.entrustOrderSampleId && csf.entrustOrderSampleId === item.opFeedEntrustOrderSampleId) ||
                    (csf.sampleNo && csf.sampleNo === item.sampleNo)
                );
                if (csfItem && csfItem.csf != null && csfItem.csf !== '') {
                    csfValue = parseFloat(csfItem.csf);
                }

                console.log('匹配到的初水分项:', csfItem);
                if (!csfItem) {
                    console.warn('⚠️ 未匹配成功，请检查字段值是否完全一致（大小写、空格、null）');
                }

                if (csfItem && csfItem.csf !== null && csfItem.csf !== undefined && csfItem.csf !== '') {
                    csfValue = parseFloat(csfItem.csf);
                    console.log('初水分值 csf:', csfValue);
                }
            } else {
                console.log('cachedCsfhyData 为空，无法获取初水分');
            }

            // 3. ★★★ 遍历 testItem 数组，逐个计算 ★★★
            item.testItem.forEach((testItem, idx) => {
                const average = testItem.average;
                console.log(`项目${idx} - 结果值 average:`, average, '初水分 csf:', csfValue);

                // 结果为空，清空鲜样含量
                if (average === null || average === undefined || average === '') {
                    console.log('结果为空，清空 remark');
                    this.$set(testItem, 'remark', '');
                    return;
                }

                // 没有初水分数据，清空鲜样含量
                if (csfValue === null || isNaN(csfValue)) {
                    console.log('无初水分数据，清空 remark');
                    this.$set(testItem, 'remark', '');
                    return;
                }

                // 4. ★★★ 计算鲜样含量 ★★★
                try {
                    const avgNum = parseFloat(average);
                    if (isNaN(avgNum)) {
                        console.log('结果不是有效数字');
                        this.$set(testItem, 'remark', '');
                        return;
                    }

                    // 公式：鲜样含量 = 干基结果 × (100 - 初水分) / 100
                    const result = avgNum * (100 - csfValue) / 100;
                    const formattedResult = result.toFixed(2);

                    console.log(`计算公式: ${avgNum} × (100 - ${csfValue}) / 100 = ${formattedResult}`);

                    // ★★★ 写入 remark 字段 ★★★
                    this.$set(testItem, 'remark', formattedResult);
                    console.log('已设置 remark:', testItem.remark);

                } catch (error) {
                    console.error('计算错误:', error);
                    this.$set(testItem, 'remark', '');
                }
            });
        },

        /**
         * 批量计算所有样品
         */
        calculateFreshSampleMixin(csfhyData) {
            console.log('========== 批量计算鲜样含量 ==========');
            if (!this.Details?.infoList) return;

            this.Details.infoList.forEach(item => {
                this.calculateFreshSampleForItemMixin(item);
            });

            console.log('批量计算完成');
        },

        // 兼容方法
        calculateSingleFreshSampleMixin(item, csfValue) {
            this.calculateFreshSampleForItemMixin(item);
        }
    }
};