<template>
  <div class="content" :style="isSpinning?'text-align:center':''">
    <!--SPIN-->
    <a-spin v-if="isSpinning" :spinning="isSpinning" tip="载入中……" />
    <!--FORM-->
    <div v-else>
      <!--1.树木信息-->
      <a-divider>1.树木信息</a-divider>
      <a-row>
        <a-col :span="8">
          <a-form-item label="树种" v-bind="LAYOUT.form">
            <span v-if="isResult">{{treeInfo.species}}</span>
            <a-input v-else v-model="treeInfo.species" placeholder="请填写树种" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="树龄" v-bind="LAYOUT.form">
            <span v-if="isResult">{{treeInfo.age}}</span>
            <a-input-number v-else v-model="treeInfo.age" :min="1" @change="onTreeAgeChange" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="树高" v-bind="LAYOUT.form">
            <span v-if="isResult">{{treeInfo.height}}</span>
            <a-input-number v-else v-model="treeInfo.height" :min="2.6" />
          </a-form-item>
        </a-col>
      </a-row>
      <!--2.圆盘信息-->
      <a-divider>2.圆盘信息</a-divider>
      <a-row>
        <a-col :span="8">
          <a-form-item label="数量" v-bind="LAYOUT.form">
            <span v-if="isResult">{{discsInfo.count}}</span>
            <a-input-number
              v-else
              v-model="discsInfo.count"
              :min="3"
              :max="Math.floor(treeInfo.height)"
              @change="onDiscsCountChange"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="龄阶" v-bind="LAYOUT.form">
            <span v-if="isResult">{{discsInfo.gradation}}</span>
            <a-input-number
              v-else
              v-model="discsInfo.gradation"
              :min="1"
              :max="treeInfo.age"
              @change="onDiscsgradationChange"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="带皮" v-bind="LAYOUT.form">
            <span v-if="isResult">{{discsInfo.bark==='with'?'是':'否'}}</span>
            <a-select v-else v-model="discsInfo.bark" @change="onDiscsBarkChange">
              <a-select-option value="with">是</a-select-option>
              <a-select-option value="without">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-table
        :columns="discsInfo.columns"
        :dataSource="discsInfo.datas"
        :pagination="false"
        :rowKey="record => record.number"
      >
        <template slot="height" slot-scope="value,record,index">
          <span v-if="isResult">{{discsInfo.datas[index].height}}</span>
          <a-input-number
            v-else
            v-model="discsInfo.datas[index].height"
            size="small"
            :min="0"
            :disabled="index<2"
          />
        </template>
        <template slot="ring" slot-scope="value,record,index">
          <span v-if="isResult">{{discsInfo.datas[index].ring}}</span>
          <a-input-number
            v-else
            v-model="discsInfo.datas[index].ring"
            size="small"
            :min="1"
            :max="treeInfo.age"
            :disabled="index<1"
          />
        </template>
        <template slot="bark" slot-scope="value,record,index">
          <span v-if="isResult">{{discsInfo.datas[index]['bark']}}</span>
          <a-input-number v-else v-model="discsInfo.datas[index]['bark']" size="small" :min="0" />
        </template>
        <span
          v-for="gradation in gradationCount"
          :key="gradation"
          :slot="gradation"
          slot-scope="value,record,index"
        >
          <span
            v-if="isResult && treeInfo.age-record.ring<discsInfo.columns[3].children[gradation-1].title"
          >{{discsInfo.datas[index][gradation]}}</span>
          <a-input-number
            v-if="!isResult && treeInfo.age-record.ring<discsInfo.columns[3].children[gradation-1].title"
            v-model="discsInfo.datas[index][gradation]"
            size="small"
            :min="0"
          />
        </span>
      </a-table>
      <!--3.其他信息-->
      <a-divider>3.其他信息</a-divider>
      <a-form-item label="颜色">
        <span v-if="isResult">
          <a-tag :color="extraInfo.color">⚪</a-tag>
          {{extraInfo.color}}
        </span>
        <a-select v-else v-model="extraInfo.color">
          <a-select-option
            v-for="(color,colorIndex) in Object.keys(COLORS)"
            :key="colorIndex"
            :value="color"
          >
            <a-tag :color="color">⚪</a-tag>
            {{color}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="备注">
        <pre v-if="isResult">{{extraInfo.remarks}}</pre>
        <a-textarea v-else v-model="extraInfo.remarks" :rows="8" placeholder="请填写备注" />
      </a-form-item>
      <div v-if="!isResult">
        <a-divider />
        <a-button type="primary" block @click="handleSubmit">提交</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { COLORS, LAYOUT, COLUMNS } from "@/const";
import { serviceGetTree } from "@/services";
export default {
  name: "TreeForm",
  props: {
    scene: { type: String, required: true }
  },
  data() {
    return {
      // 颜色
      COLORS,
      // 布局
      LAYOUT,
      // 正在加载？
      isSpinning: true,
      // 1.树木信息
      treeInfo: {
        species: "",
        age: 12,
        height: 11.6
      },
      // 2.圆盘信息
      discsInfo: {
        count: 7,
        gradation: 1,
        bark: "with",
        columns: COLUMNS.discs,
        datas: []
      },
      // 3.其他信息
      extraInfo: {
        color: "saddlebrown",
        remarks: ""
      }
    };
  },
  computed: {
    // 用户ID
    userID() {
      return this.$store.state.user._id;
    },
    // 解析木ID
    treeID() {
      return this.$route.params.id;
    },
    // 龄阶数量
    gradationCount() {
      return Math.ceil(this.treeInfo.age / this.discsInfo.gradation);
    },
    // 是添加页面？
    isAdd() {
      return this.scene === "add";
    },
    // 是编辑页面？
    isEdit() {
      return this.scene === "edit";
    },
    // 是结果页面？
    isResult() {
      return this.scene === "result";
    }
  },
  async created() {
    // 初始化
    this.isSpinning = true;
    // 如果不是添加页面，则获取解析木信息
    if (!this.isAdd) {
      await this.getTree();
    }
    // 更新表格列和数据
    this.updateDiscsColumns();
    this.updateDiscsDatas();
    // 如果是结果和非详情页面，则传输数据给父组件
    if (this.isResult) {
      let treeData = {
        id: this.treeID,
        treeInfo: this.treeInfo,
        discsInfo: this.discsInfo,
        extraInfo: this.extraInfo
      };
      this.$emit("transport", treeData);
    }
    // 初始化完毕
    this.isSpinning = false;
  },
  methods: {
    // 更新表格列
    updateDiscsColumns() {
      // 重置各龄阶列
      this.$set(this.discsInfo.columns[3], "children", []);
      // 获取参数，count为龄阶数量（不包含带皮这一列）
      let { age } = this.treeInfo,
        { gradation, bark, columns } = this.discsInfo,
        count = this.gradationCount;
      // 设置各龄阶列
      for (let i = 1; i <= count; i++) {
        let key = count - i + 1,
          diameter = Math.min(i * gradation, age),
          column;
        // 带皮
        if (bark === "with" && i === count) {
          column = {
            children: [
              {
                dataIndex: "bark",
                scopedSlots: { customRender: "bark" },
                title: "带皮",
                align: "center"
              },
              {
                dataIndex: key,
                scopedSlots: { customRender: key },
                title: "去皮",
                align: "center"
              }
            ]
          };
        }
        // 不带皮
        else {
          column = {
            dataIndex: key,
            scopedSlots: { customRender: key },
            align: "center"
          };
        }
        column.title = diameter;
        columns[3].children.unshift(column);
      }
    },
    // 更新表格数据
    updateDiscsDatas() {
      // 获取参数
      let { age } = this.treeInfo,
        { count, datas } = this.discsInfo;
      // 如果新的圆盘数量少于数据数量，则缩减
      if (count < datas.length) datas.splice(count, datas.length - count);
      // 反之扩充
      for (let i = datas.length; i < count; i++) {
        let data = {};
        switch (i) {
          case 0:
            data.height = 0;
            data.ring = age;
            break;
          case 1:
            data.height = 1.3;
            break;
          case 2:
            data.height = 2.6;
            break;
        }
        data.number = i + 1;
        datas.push(data);
      }
      datas[0].ring = age;
    },
    // 当树龄更新时，更新表格列和数据
    onTreeAgeChange() {
      this.updateDiscsColumns();
      this.updateDiscsDatas();
    },
    // 当圆盘数量更新时，更新表格数据
    onDiscsCountChange() {
      // 防止无意义更新导致的卡死
      let { height } = this.treeInfo,
        { count } = this.discsInfo;
      if (count <= height) this.updateDiscsDatas();
    },
    // 当龄阶更新时，更新表格列
    onDiscsgradationChange() {
      // 防止无意义更新导致的卡死
      let { age } = this.treeInfo,
        { gradation } = this.discsInfo;
      if (gradation <= age) this.updateDiscsColumns();
    },
    // 当带皮更新时，更新表格列
    onDiscsBarkChange() {
      this.updateDiscsColumns();
    },
    // 表单→数据库
    formTreeData() {
      let { treeInfo, discsInfo, extraInfo } = this,
        { species, age, height } = treeInfo,
        { count, gradation, bark, datas } = discsInfo,
        { color, remarks } = extraInfo,
        treeData = {
          id: this.treeID,
          treeInfo: {
            species,
            age,
            height
          },
          discsInfo: {
            count,
            gradation,
            bark: bark === "with" ? true : false,
            datas: []
          },
          extraInfo: {
            color,
            remarks
          }
        };
      for (let i = 0; i < datas.length; i++) {
        let data = datas[i],
          { number, ring, height } = data,
          data_ = { number, ring, height, diameters: {} };
        if (bark === "with") data_.diameters.bark = data.bark;
        for (let j = 1; j <= ring; j++) {
          data_.diameters[j] = data[j];
        }
        treeData.discsInfo.datas.push(data_);
      }
      return treeData;
    },
    // 数据库→表单
    parseTreeData(treeData) {
      let { treeInfo, discsInfo, extraInfo } = treeData,
        { species, age, height } = treeInfo,
        { count, gradation, bark, datas } = discsInfo,
        { color, remarks } = extraInfo;
      //
      this.treeInfo.species = species;
      this.treeInfo.age = age;
      this.treeInfo.height = height;
      //
      this.discsInfo.count = count;
      this.discsInfo.gradation = gradation;
      this.discsInfo.bark = bark ? "with" : "without";
      this.discsInfo.datas = [];
      for (let i = 0; i < datas.length; i++) {
        let { number, height, ring, diameters } = datas[i],
          data = {
            number,
            height,
            ring,
            ...diameters
          };
        this.discsInfo.datas.push(data);
      }
      //
      this.extraInfo.color = color;
      this.extraInfo.remarks = remarks;
    },
    // 获取解析木信息
    async getTree() {
      try {
        this.isSpinning = true;
        let params = { id: this.treeID };
        let result = await serviceGetTree(params);
        this.parseTreeData(result.data);
        this.isSpinning = false;
      } catch (err) {
        this.$message.error(err);
      }
    },
    // 点击提交按钮
    handleSubmit() {
      let treeData = this.formTreeData();
      this.$emit("submit", treeData);
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  min-height: 320px;
}
.ant-table {
  .ant-input-number {
    width: 64px !important;
  }
}
</style>