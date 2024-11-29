<!--  -->
<template>

  <div class="upload-item">
    <el-upload ref="uploadfiles" action="/api/common/upload" :show-file-list="false" :on-success="handleAvatarSuccess"
      :on-error="handleError" :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">

      <i v-else class="el-icon-plus avatar-uploader-icon" />
      <span v-if="imageUrl" class="el-upload-list__item-actions">
        <span @click.stop="oploadImgDel">
          删除图片
        </span>
        <span> 重新上传 </span>
      </span>
    </el-upload>
    <p class="upload-tips">
      <slot />
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component({
  name: 'UploadImage'
})
export default class extends Vue {

  private imageUrl = ''

  @Prop({ default: '' }) propImageUrl: string

  handleError(err, file, fileList) {
    console.log(err, file, fileList, 'handleError')
    this.$message({
      message: '图片上传失败',
      type: 'error'
    })
  }

  @Watch('propImageUrl')
  private updateFromFather(val){
      this.imageUrl = val;
  }

  remove(){
    this.imageUrl = '';
  }

  handleAvatarSuccess(response: any, file: any, fileList: any) {
    // this.imageUrl = response.data
    // this.imageUrl = `http://172.17.2.120:8080/common/download?name=${response.data}`
    this.imageUrl = `${response.data}`
    // this.imageUrl = `${baseUrl}/common/download?name=${response.data}`
    this.$emit('imageChange', this.imageUrl)
  }

  oploadImgDel() {
    this.imageUrl = ''
    this.$emit('imageChange', this.imageUrl)
  }
  beforeAvatarUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      this.$message({
        message: `上传文件大小不能超过2M!`,
        type: 'error'
      })
      return false
    }
  }
}
</script>
