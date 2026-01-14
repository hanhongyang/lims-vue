<template>
	<div class="signature-container">
		<!-- <div class="signature-header">
			<h2>电子签名板</h2>
			<p>请在下方区域进行签名</p>
		</div> -->

		<div class="canvas-container">
			<canvas ref="signatureCanvas" :width="canvasWidth" :height="canvasHeight" @mousedown="startDrawing"
				@mousemove="draw" @mouseup="stopDrawing" @mouseleave="stopDrawing" @touchstart="handleTouchStart"
				@touchmove="handleTouchMove" @touchend="stopDrawing" class="signature-canvas">
			</canvas>
		</div>

		<div class="status-text" v-if="!hasSignature">
			请在上面区域签名
		</div>
		<div class="status-text" v-else>
			签名完成，可点击"确认"保存或"清空"重新签名
		</div>

		<div class="button-group">
			<button class="btn-clear" @click="clearSignature">清空</button>
			<button class="btn-confirm" @click="handleConfirm" :disabled="uploading">
				{{ uploading ? '上传中...' : '确认上传' }}
			</button> <button class="btn-download" @click="downloadSignature" v-if="signatureDataUrl">下载签名</button>
		</div>

		<!-- <div class="signature-preview" v-if="signatureDataUrl">
			<h3>签名预览:</h3>
			<img :src="signatureDataUrl" alt="签名预览">
		</div> -->
		<!-- 新增：上传结果提示 -->
		<!-- <div v-if="uploadResult" class="upload-result" :class="uploadResult.success ? 'success' : 'error'">
			{{ uploadResult.message }}
		</div> -->
	</div>
</template>

<script>
import { uploadAndGetFileId } from '@/api/common/common'
import { base64ToFile, canvasToCompressedBase64 } from '@/utils/file'
export default {
	name: 'Signature',
	props: {
		canvasWidth: {
			type: Number,
			default: 1200
		},
		canvasHeight: {
			type: Number,
			default: 300
		},
		// 新增props，用于接收上传成功的回调
		onUploadSuccess: {
			type: Function,
			default: null
		},
		onUploadError: {
			type: Function,
			default: null
		},
		typename: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			isDrawing: false,
			lastX: 0,
			lastY: 0,
			hasSignature: false,
			signatureDataUrl: '',
			ctx: null,
			uploading: false,
			uploadResult: null
		}
	},
	mounted() {
		this.initCanvas()
		window.addEventListener('resize', this.handleResize)
		this.handleResize()
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.handleResize)
	},
	methods: {
		initCanvas() {
			const canvas = this.$refs.signatureCanvas
			this.ctx = canvas.getContext('2d')

			// 设置画布背景为白色
			this.ctx.fillStyle = 'white'
			this.ctx.fillRect(0, 0, canvas.width, canvas.height)

			// 设置线条样式
			this.ctx.lineWidth = 2
			this.ctx.lineCap = 'round'
			this.ctx.lineJoin = 'round'
			this.ctx.strokeStyle = '#000000'
		},

		handleResize() {
			// 响应式调整画布大小
			const container = document.querySelector('.canvas-container')
			if (container && this.$refs.signatureCanvas) {
				this.$refs.signatureCanvas.width = Math.min(container.clientWidth - 40, this.canvasWidth)
			}
		},

		startDrawing(e) {
			this.isDrawing = true
			const canvas = this.$refs.signatureCanvas
			const rect = canvas.getBoundingClientRect()

			this.lastX = e.offsetX
			this.lastY = e.offsetY
		},

		handleTouchStart(e) {
			e.preventDefault()
			this.isDrawing = true
			const canvas = this.$refs.signatureCanvas
			const rect = canvas.getBoundingClientRect()
			const touch = e.touches[0]

			this.lastX = touch.clientX - rect.left
			this.lastY = touch.clientY - rect.top
		},

		draw(e) {
			if (!this.isDrawing) return

			const canvas = this.$refs.signatureCanvas
			const currentX = e.offsetX
			const currentY = e.offsetY

			// 绘制线条
			this.ctx.beginPath()
			this.ctx.moveTo(this.lastX, this.lastY)
			this.ctx.lineTo(currentX, currentY)
			this.ctx.stroke()

			this.lastX = currentX
			this.lastY = currentY
			this.hasSignature = true
		},

		handleTouchMove(e) {
			if (!this.isDrawing) return

			e.preventDefault()
			const canvas = this.$refs.signatureCanvas
			const rect = canvas.getBoundingClientRect()
			const touch = e.touches[0]

			const currentX = touch.clientX - rect.left
			const currentY = touch.clientY - rect.top

			// 绘制线条
			this.ctx.beginPath()
			this.ctx.moveTo(this.lastX, this.lastY)
			this.ctx.lineTo(currentX, currentY)
			this.ctx.stroke()

			this.lastX = currentX
			this.lastY = currentY
			this.hasSignature = true
		},

		stopDrawing() {
			this.isDrawing = false
		},

		clearSignature() {
			const canvas = this.$refs.signatureCanvas

			// 清除画布
			this.ctx.clearRect(0, 0, canvas.width, canvas.height)

			// 重新设置白色背景
			this.ctx.fillStyle = 'white'
			this.ctx.fillRect(0, 0, canvas.width, canvas.height)

			// 重置线条样式
			this.ctx.lineWidth = 2
			this.ctx.lineCap = 'round'
			this.ctx.lineJoin = 'round'
			this.ctx.strokeStyle = '#000000'


			this.hasSignature = false
			this.signatureDataUrl = ''
			this.uploadResult = null
			this.uploading = false
		},

		handleConfirm() {
			if (!this.hasSignature) {
				this.$message.error('请先进行签名')
				return
			}
			console.log('5555555')
			const canvas = this.$refs.signatureCanvas
			// 使用压缩方法生成base64
			this.signatureDataUrl = canvasToCompressedBase64(
				canvas,
				0.8, // 压缩质量
				800, // 最大宽度
				'image/png' // 格式
			)

			// 自动上传签名
			this.uploadSignature()
		},


		downloadSignature() {
			if (!this.signatureDataUrl) {
				this.$message.error('没有可下载的签名')
				return
			}

			const link = document.createElement('a')
			link.download = 'signature.png'
			link.href = this.signatureDataUrl
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		},

		// 上传签名图片到后端
		async uploadSignature() {
			if (!this.signatureDataUrl) {
				this.$message.error('没有可上传的签名')
				return
			}

			this.uploading = true
			this.uploadResult = null

			try {
				// 使用现有的工具函数将base64转换为File对象
				const file = base64ToFile(this.signatureDataUrl, 'signature.png')
				console.log(this.signatureDataUrl, 'this.signatureDataUrl')
				// if (this.signatureDataUrl) {
				// 	this.$emit('signature-done', {
				// 		type: this.typename,
				// 		data: this.signatureDataUrl
				// 	})
				// }

				// 创建FormData对象
				const formData = new FormData()
				formData.append('file', file)
				console.log(formData, 'wenjianliu')
				// 使用封装的上传接口
				const response = await uploadAndGetFileId(formData)

				console.log('上传响应:', response); // 添加调试日志

				// 直接在这里处理响应，避免作用域问题
				if (response && response.code === 200) {
					const fileId = response.data
					this.uploadResult = {
						success: true,
						message: '签名上传成功',
						fileId: fileId
					}

					this.$message.success('签名上传成功')

					// 触发上传成功回调
					if (this.onUploadSuccess) {
						this.onUploadSuccess(fileId, this.signatureDataUrl)
					}

					// 上传成功后，通过事件传递类型、base64数据和文件ID
					console.log('发送签名完成事件:', { type: this.typename, fileId }); // 添加调试日志

					this.$emit('signature-done', {
						type: this.typename,
						data: this.signatureDataUrl,
						fileId: fileId, // 传递文件ID
						close: false
					})

				} else {
					throw new Error(response.msg || '上传失败')
				}

			} catch (error) {
				console.error('上传签名失败:', error)
				this.uploadResult = {
					success: false,
					message: `上传失败: ${error.message}`
				}

				this.$message.error('签名上传失败')

				// 触发上传失败回调
				if (this.onUploadError) {
					this.onUploadError(error)
				}
			} finally {
				this.uploading = false
			}
		},

		// 提取上传错误处理逻辑
		handleUploadError(error) {
			console.error('上传签名失败:', error)
			this.uploadResult = {
				success: false,
				message: `上传失败: ${error.message}`
			}

			this.$message.error('签名上传失败')

			// 触发上传失败回调
			if (this.onUploadError) {
				this.onUploadError(error)
			}
		},
		// 新增：将base64转换为Blob
		dataURLtoBlob(dataURL) {
			const arr = dataURL.split(',')
			const mime = arr[0].match(/:(.*?);/)[1]
			const bstr = atob(arr[1])
			let n = bstr.length
			const u8arr = new Uint8Array(n)

			while (n--) {
				u8arr[n] = bstr.charCodeAt(n)
			}

			return new Blob([u8arr], { type: mime })
		},

		// 修改clearSignature方法，清除上传状态
		clearSignature() {
			const canvas = this.$refs.signatureCanvas

			// 清除画布
			this.ctx.clearRect(0, 0, canvas.width, canvas.height)

			// 重新设置白色背景
			this.ctx.fillStyle = 'white'
			this.ctx.fillRect(0, 0, canvas.width, canvas.height)

			// 重置线条样式
			this.ctx.lineWidth = 2
			this.ctx.lineCap = 'round'
			this.ctx.lineJoin = 'round'
			this.ctx.strokeStyle = '#000000'

			this.hasSignature = false
			this.signatureDataUrl = ''
			this.uploadResult = null
			this.uploading = false
		}

	}
}
</script>

<style scoped>
.signature-container {
	max-width: 800px;
	margin: 0 auto;
	background: white;
	border-radius: 10px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
	padding: 20px;
}

.signature-header {
	text-align: center;
	margin-bottom: 20px;
	padding-bottom: 15px;
	border-bottom: 1px solid #eee;
}

.signature-header h2 {
	color: #333;
	font-weight: 500;
}

.canvas-container {
	position: relative;
	margin: 20px 0;
}

.signature-canvas {
	display: block;
	margin: 0 auto;
	background-color: #fff;
	border: 2px dashed #d9d9d9;
	border-radius: 8px;
	cursor: crosshair;
	touch-action: none;
}

.signature-preview {
	text-align: center;
	margin: 20px 0;
}

.signature-preview img {
	max-width: 100%;
	border: 1px solid #eee;
	border-radius: 4px;
}

.button-group {
	display: flex;
	justify-content: center;
	gap: 15px;
	margin-top: 20px;
}

button {
	padding: 10px 20px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 16px;
	transition: all 0.3s;
}

.btn-clear {
	background-color: #f5f5f5;
	color: #666;
	border: 1px solid #ddd;
}

.btn-clear:hover {
	background-color: #e8e8e8;
}

.btn-confirm {
	background-color: #1890ff;
	color: white;
}

.btn-confirm:hover {
	background-color: #40a9ff;
}

.btn-download {
	background-color: #52c41a;
	color: white;
}

.btn-download:hover {
	background-color: #73d13d;
}

.status-text {
	text-align: center;
	margin: 10px 0;
	color: #666;
	font-size: 14px;
}

.upload-result {
	margin-top: 15px;
	padding: 10px;
	border-radius: 4px;
	text-align: center;
	font-size: 14px;
}

.upload-result.success {
	background-color: #f6ffed;
	border: 1px solid #b7eb8f;
	color: #52c41a;
}

.upload-result.error {
	background-color: #fff2f0;
	border: 1px solid #ffccc7;
	color: #ff4d4f;
}
</style>