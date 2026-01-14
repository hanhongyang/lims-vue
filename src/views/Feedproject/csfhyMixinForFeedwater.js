import { csfhy } from "@/api/hyd";
import Decimal from "decimal.js";

export default {
    data() {
        return {
            cachedCsfhyData: null,
        };
    },
    methods: {
        // 1. 移除 csfhyMixinHandler()
        // async csfhyMixinHandler() {
        //     try {
        //         const saveResult = await this.submitForm(true); // submitForm(true) 是旧逻辑
        //         if (!saveResult.success) {
        //             this.$message.error('主单据保存失败，无法进行初水分化验');
        //             return;
        //         }
        //         const res = await csfhy(this.Details.opJczxFeedResultBaseId); // 旧的 API 调用
        //         const routeParams = {
        //             parentId: this.Details.opJczxFeedResultBaseId,
        //             sampleInfo: this.Details.infoList.map(item => ({
        //                 sampleNo: item.sampleNo,
        //                 sampleName: item.sampleName,
        //                 entrustOrderItemId: item.entrustOrderItemId,
        //                 entrustOrderSampleId: item.entrustOrderSampleId
        //             })),
        //             existingData: res.code === 200 && res.data ? res.data : null
        //         };
        //         this.$router.push({
        //             path: '/JJ15Pad',
        //             query: routeParams
        //         });
        //     } catch (error) {
        //         console.error('查询初水分数据失败:', error);
        //         this.$message.error('查询初水分数据失败');
        //     }
        // },

        // 2. 修改 loadCsfhyDataAndCalculateMixin()
        async loadCsfhyDataAndCalculateMixin() {
            console.log('开始加载初水分数据 (MixinForFeedwater)...');

            // 检查 infoList 是否存在且有数据
            if (!this.Details || !this.Details.infoList || this.Details.infoList.length === 0) {
                // 主单据在 mounted 时 infoList 应该已有，如果为空则无法查询
                console.log('主单据样品列表(infoList)为空，无法查询初水分数据 (MixinForFeedwater)');
                // 尝试触发一次计算（使用空数据），以确保依赖 M1 的字段被清空
                this.calculateFreshSampleMixin(null);
                return;
            }

            // 提取 entrustOrderSampleId 列表
            const sampleList = this.Details.infoList
                .map(item => item.entrustOrderSampleId)
                .filter(id => id); // 过滤掉可能为空的ID

            if (sampleList.length === 0) {
                console.log('未能从主单据样品列表中提取有效的 entrustOrderSampleId (MixinForFeedwater)');
                // 尝试触发一次计算（使用空数据）
                this.calculateFreshSampleMixin(null);
                return;
            }

            console.log('查询初水分数据，参数 sampleList (MixinForFeedwater):', sampleList);

            if (localStorage.getItem('isCSF') == 'true') {
                try {
                    // 3. 调用修改后的 csfhy 接口 (POST sampleList)
                    // (确保 api/hyd.js 中的 csfhy 接口已修改为 POST List<String>)
                    const res = await csfhy(sampleList);

                    if (res.code === 200 && res.data) {
                        console.log('初水分数据加载成功 (MixinForFeedwater):', res.data);
                        this.cachedCsfhyData = res.data;
                        this.calculateFreshSampleMixin(res.data); // 逻辑不变
                    } else {
                        console.warn('加载初水分数据失败或无数据 (MixinForFeedwater):', res);
                        this.cachedCsfhyData = null; // 确保清空缓存
                        this.calculateFreshSampleMixin(null); // 使用 null 触发清空
                    }
                } catch (error) {
                    console.error('加载初水分数据失败 (MixinForFeedwater):', error);
                    this.cachedCsfhyData = null;
                    this.calculateFreshSampleMixin(null); // 出错时也触发清空
                }
            }

        },

        // 4. 计算逻辑 (calculateFreshSampleForItemMixin) - 保持不变 (但增加了健壮性)
        calculateFreshSampleForItemMixin(item) {
            if (!this.cachedCsfhyData || !this.cachedCsfhyData.infoList) {
                // 如果没有缓存数据，确保 M1 字段被清空
                this.$set(item, 'upperM1', '');
                this.$set(item, 'compareUpperM1', '');
                // 触发一次 updateCompareValues 来清空依赖 M1 的计算
                if (typeof this.updateCompareValues === 'function') {
                    this.$nextTick(() => this.updateCompareValues(item));
                }
                return;
            }

            const csfItem = this.cachedCsfhyData.infoList.find(csf =>
                (csf.entrustOrderSampleId && csf.entrustOrderSampleId === item.entrustOrderSampleId) ||
                (csf.sampleNo && csf.sampleNo === item.sampleNo)
            );

            // console.log('匹配到的初水分数据:', csfItem);

            if (csfItem && (csfItem.csf || csfItem.csf === 0)) {
                // 设置初水分M1值（普通样和平行样使用相同的csf值）
                const csfValue = csfItem.csf;
                console.log(`设置样品 ${item.sampleNo} 的M1值为:`, csfValue);

                this.$set(item, 'upperM1', csfValue.toString());
                this.$set(item, 'compareUpperM1', csfValue.toString());

            } else {
                console.log(`未找到样品 ${item.sampleNo} 对应的初水分数据`);
                this.$set(item, 'upperM1', '');
                this.$set(item, 'compareUpperM1', '');
            }

            // 确保在设置 M1 后（无论是否找到），都触发一次主单据的重算
            if (typeof this.updateCompareValues === 'function') {
                this.$nextTick(() => this.updateCompareValues(item));
            }
        },

        // 5. 计算逻辑 (calculateFreshSampleMixin) - 保持不变 (但增加了健壮性)
        calculateFreshSampleMixin(csfhyData) {
            if (!this.Details.infoList) return;

            console.log('开始批量计算所有样品的M1值 (MixinForFeedwater)...');

            const foundData = csfhyData && csfhyData.infoList;

            this.Details.infoList.forEach(mainItem => {
                let csfValue = null;
                if (foundData) {
                    const csfItem = csfhyData.infoList.find(csf =>
                        (csf.entrustOrderSampleId && csf.entrustOrderSampleId === mainItem.entrustOrderSampleId) ||
                        (csf.sampleNo && csf.sampleNo === mainItem.sampleNo)
                    );

                    if (csfItem && (csfItem.csf || csfItem.csf === 0)) {
                        csfValue = csfItem.csf;
                    }
                }

                if (csfValue !== null) {
                    // console.log(`设置样品 ${mainItem.sampleNo} 的M1值为:`, csfValue);
                    this.$set(mainItem, 'upperM1', csfValue.toString());
                    this.$set(mainItem, 'compareUpperM1', csfValue.toString());
                } else {
                    // console.log(`未找到样品 ${mainItem.sampleNo} 的初水分数据，M1清空`);
                    this.$set(mainItem, 'upperM1', '');
                    this.$set(mainItem, 'compareUpperM1', '');
                }
            });

            // 在所有M1值设置完成后，统一触发一次重新计算
            this.$nextTick(() => {
                if (typeof this.updateCompareValues === 'function') {
                    this.Details.infoList.forEach(item => {
                        this.updateCompareValues(item);
                    });
                } else {
                    console.warn("MixinForFeedwater 期望主组件有 updateCompareValues 方法，但未找到。");
                }
            });
        }
    }
};