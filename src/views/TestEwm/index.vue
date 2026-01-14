<template>
    <div>
        <div v-for="(sample, index) in sampleList" :key="index" style="page-break-after: always; margin-bottom: 20px;"
            class="label-card">
            <table border="1" cellpadding="4" cellspacing="0" width="100%" style="text-align:center">
                <tr>
                    <td colspan="2">
                        <canvas :id="'qrcode-' + index" style="width:80px;height:80px"></canvas>
                    </td>
                </tr>

                <tr>
                    <td width="40%">样品编号</td>
                    <td width="60%">{{ sample.qrCode }}</td>
                </tr>

            </table>
        </div>
    </div>
</template>
<script>
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode'

export default {
    data() {
        return {
            sampleList: [] // 存储所有样品数据
        }
    },
    created() {
        this.sampleList = JSON.parse(this.$route.query.printData);
        console.log(this.sampleList)
    },
    mounted() {
        // this.$nextTick(() => {
        //     // 一张一张画，确保 DOM 已存在
        //     this.sampleList.forEach((sample, index) => {
        //         this.$nextTick(() => {
        //             const node = document.querySelector(`#barcode-${index}`);
        //             if (!node) {
        //                 console.warn(`节点 #barcode-${index} 不存在`);
        //                 return;
        //             }
        //             if (!sample.orderSampleId) {
        //                 console.warn(`样品 ${index} 缺少 orderSampleId`);
        //                 return;
        //             }
        //             try {
        //                 JsBarcode(node, sample.orderSampleId, {
        //                     format: 'CODE128',
        //                     width: 1,
        //                     height: 36,
        //                     displayValue: false,
        //                     background: '#fff',
        //                     lineColor: '#000',
        //                     margin: 8
        //                 });
        //             } catch (e) {
        //                 console.error(`条形码生成失败(样品${sample.orderSampleId}):`, e);
        //             }
        //         });
        //     });

        //     // 自动打印
        //     this.autoPrint();
        // });
        this.$nextTick(() => {
            this.sampleList.forEach((sample, index) => {
                const canvas = document.getElementById(`qrcode-${index}`)
                if (!canvas || !sample.qrCode) return
                QRCode.toCanvas(canvas, sample.qrCode, {
                    width: 80,
                    margin: 2,
                    color: { dark: '#000', light: '#fff' }
                }).catch(console.error)
            })
            this.autoPrint()
        })
    },
    methods: {
        autoPrint() {
            this.$nextTick(() => {
                setTimeout(() => {
                    window.print(); // 自动触发打印
                }, 500); // 确保DOM完全渲染
            });
        }
    }
}
</script>
<style scoped>
/* 打印样式 */
@media print {
    body {
        margin: 0;
        padding: 0;
    }

    .label-card {
        width: 60mm !important;
        height: 55mm !important;
        margin: 0 !important;
        padding: 2mm !important;
        page-break-after: always;
        box-sizing: border-box;
    }

    table {
        width: 100% !important;
        font-size: 10px !important;
        line-height: 1.2 !important;
    }

    /* 隐藏其他页面元素 */
    body>*:not(.label-card) {
        display: none;
    }
}

/* 屏幕预览样式 */
@media screen {
    .label-card {
        border: 1px dashed #ccc;
        margin-bottom: 10px;
    }
}
</style>