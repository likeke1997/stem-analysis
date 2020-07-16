 <template>
  <div class="container">
    <!--文字-->
    <div>
      作者
      <a @click="handleShowModal">{{AUTHOR.name}}</a>
    </div>
    <!--模态框-->
    <a-modal v-model="modal.isShow" :title="modal.info.title" :footer="null">
      <a-row v-for="(detail,detailIndex) in modal.info.details" :key="detailIndex">
        <a-col :span="4" style="text-align:right;">{{detail.key}}：</a-col>
        <a-col :span="20">{{detail.value}}</a-col>
      </a-row>
    </a-modal>
  </div>
</template>
          
<script>
import { INFO } from "@/const";
export default {
  name: "ContainerFooter",
  data() {
    return {
      // 作者信息
      AUTHOR: INFO.author,
      // 模态框
      modal: {
        isShow: false,
        info: INFO.author
      }
    };
  },
  methods: {
    // 【操作】显示模态框
    handleShowModal() {
      this.modal.isShow = true;
    }
  }
};
</script>
        
<style lang="less" scoped>
</style>