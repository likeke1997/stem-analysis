<template>
  <div>
    <!--页头-->
    <a-page-header title="解析结果" @back="handleBack" />
    <!--选项-->
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="treeData">0.解析木信息</a-menu-item>
      <a-menu-item key="discsYearInfo">1.各圆盘对应生长年数</a-menu-item>
      <a-menu-item key="volumesValueInfo">2.树木材积及其生长方程</a-menu-item>
      <a-menu-item key="volumesRateInfo">3.树木材积生长率及其曲线</a-menu-item>
      <a-menu-item key="factorsInfo">4.树木胸高形数及其曲线</a-menu-item>
      <a-menu-item key="growthsInfo">5.树木各生长量及其曲线</a-menu-item>
      <a-menu-item key="model2DInfo">6.树干纵断面图</a-menu-item>
      <a-menu-item key="model3DInfo">7.树干三维模型</a-menu-item>
    </a-menu>
    <!--结果-->
    <div>
      <!--0.-->
      <div v-if="current[0]==='treeData'">
        <!--form-->
        <TreeForm scene="result" @transport="getTreeData" />
      </div>
      <!--1.-->
      <div v-show="current[0]==='discsYearInfo'">
        <!--1.1-->
        <a-divider>1.1 各圆盘高度对应年龄</a-divider>
        <a-table
          :columns="discsYearInfo.discsYear.columns"
          :dataSource="discsYearInfo.discsYear.datas"
          :pagination="false"
          :rowKey="record => record.number"
        />
        <!--1.2-->
        <a-divider>1.2 各年龄树高</a-divider>
        <a-table
          :columns="discsYearInfo.agesHeight.columns"
          :dataSource="discsYearInfo.agesHeight.datas"
          :pagination="false"
          :rowKey="record => record.age"
        />
      </div>
      <!--2.-->
      <div v-show="current[0]==='volumesValueInfo'">
        <!--2.1-->
        <a-divider>2.1 各年龄材积计算过程</a-divider>
        <a-table
          :columns="volumesValueInfo.volumesValue.columns"
          :dataSource="volumesValueInfo.volumesValue.datas"
          :pagination="false"
          :rowKey="record => record.key"
        >
          <template
            slot="section"
            slot-scope="value,record"
          >{{record.sectionBegin.toFixed(2)}} ~ {{record.sectionEnd.toFixed(2)}}</template>
          <template slot="diameter" slot-scope="value,record">
            <span v-if="record.diameterBegin===record.diameterEnd">{{record.diameterBegin}}</span>
            <span v-else>{{record.diameterBegin.toFixed(2)}} → {{record.diameterEnd.toFixed(2)}}</span>
          </template>
          <template
            slot="length"
            slot-scope="value,record"
          >{{(record.sectionEnd-record.sectionBegin).toFixed(2)}}</template>
          <template slot="method" slot-scope="value">
            <a-tag :color="METHOD.colors[value]">{{METHOD.titles[value]}}</a-tag>
          </template>
        </a-table>
        <!--2.2-->
        <a-divider>2.2 各年龄材积</a-divider>
        <a-table
          :columns="volumesValueInfo.agesVolume.columns"
          :dataSource="volumesValueInfo.agesVolume.datas"
          :pagination="false"
          :rowKey="record => record.age"
        />
        <!--2.3-->
        <a-divider>2.3 材积生长方程</a-divider>
        <div id="volumesModelCurve" />
        <a-descriptions title="Logistic方程" layout="vertical">
          <a-descriptions-item label="参数a">{{volumesValueInfo.volumesModel.params.a}}</a-descriptions-item>
          <a-descriptions-item label="参数b">{{volumesValueInfo.volumesModel.params.b}}</a-descriptions-item>
          <a-descriptions-item label="参数k">{{volumesValueInfo.volumesModel.params.k}}</a-descriptions-item>
          <a-descriptions-item label="SSE">{{volumesValueInfo.volumesModel.quota.SSE}}</a-descriptions-item>
          <a-descriptions-item label="R-Square">{{volumesValueInfo.volumesModel.quota.R2}}</a-descriptions-item>
          <a-descriptions-item label="RMSE">{{volumesValueInfo.volumesModel.quota.RMSE}}</a-descriptions-item>
        </a-descriptions>
      </div>
      <!--3.-->
      <div v-show="current[0]==='volumesRateInfo'">
        <!--3.1-->
        <a-divider>3.1 各年龄材积生长率</a-divider>
        <a-table
          :columns="volumesRateInfo.volumesRate.columns"
          :dataSource="volumesRateInfo.volumesRate.datas"
          :pagination="false"
          :rowKey="record => record.age"
        />
        <!--3.2-->
        <a-divider>3.2 材积生长率曲线</a-divider>
        <div id="volumesRateCurve" />
      </div>
      <!--4-->
      <div v-show="current[0]==='factorsInfo'">
        <!--4.1-->
        <a-divider>4.1 各年龄胸高形数</a-divider>
        <a-table
          :columns="factorsInfo.factors.columns"
          :dataSource="factorsInfo.factors.datas"
          :pagination="false"
          :rowKey="record => record.age"
        />
        <!--4.2-->
        <a-divider>4.2 胸高形数曲线</a-divider>
        <div id="factorsCurve" />
      </div>
      <!--5-->
      <div v-show="current[0]==='growthsInfo'">
        <!--5.1-->
        <a-divider>5.1 胸径、树高、材积总生长量</a-divider>
        <a-table
          :columns="growthsInfo.growthsTotal.columns"
          :dataSource="growthsInfo.growthsTotal.datas"
          :pagination="false"
          :rowKey="record => record.age"
        />
        <!--5.2-->
        <a-divider>5.2 胸径、树高、材积平均生长量</a-divider>
        <a-table
          :columns="growthsInfo.growthsAverage.columns"
          :dataSource="growthsInfo.growthsAverage.datas"
          :pagination="false"
          :rowKey="record => record.age"
        />
        <!--5.3-->
        <a-divider>5.3 胸径、树高、材积连年生长量</a-divider>
        <a-table
          :columns="growthsInfo.growthsSerial.columns"
          :dataSource="growthsInfo.growthsSerial.datas"
          :pagination="false"
          :rowKey="record => record.age"
        />
        <!--5.4-->
        <a-divider>5.4 各生长量曲线</a-divider>
        <a-row class="curve">
          <a-col :span="8">
            <div id="growthsTotalDiameterCurve" />
            <div class="title">5.4.1 胸径总生长量曲线</div>
          </a-col>
          <a-col :span="8">
            <div id="growthsTotalHeightCurve" />
            <div class="title">5.4.2 树高总生长量曲线</div>
          </a-col>
          <a-col :span="8">
            <div id="growthsTotalVolumeCurve" />
            <div class="title">5.4.3 材积总生长量曲线</div>
          </a-col>
          <a-col :span="8">
            <div id="growthsAveSerDiameterCurve" />
            <div class="title">5.4.4 胸径平均和连年生长量曲线</div>
          </a-col>
          <a-col :span="8">
            <div id="growthsAveSerHeightCurve" />
            <div class="title">5.4.5 树高平均和连年生长量曲线</div>
          </a-col>
          <a-col :span="8">
            <div id="growthsAveSerVolumeCurve" />
            <div class="title">5.4.6 材积平均和连年生长量曲线</div>
          </a-col>
        </a-row>
      </div>
      <!--6-->
      <div v-show="current[0]==='model2DInfo'">
        <div id="model2DCanvas" />
        <div style="margin-top:16px;text-align:center;">
          <span style="margin-right:16px;">生长过程动态演示</span>
          <a-switch v-model="model2DInfo.model2DDynamic.switch" />
        </div>
      </div>
      <!--7-->
      <div v-show="current[0]==='model3DInfo'">
        <div id="model3DCanvas" />
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from "@antv/g2";
import * as Three from "three";
import { METHOD, COLUMNS, OPTIONS } from "@/const";
import { serviceGetTreeModel } from "@/services";
import TreeForm from "./tree-form";
export default {
  name: "TreeResult",
  components: { TreeForm },
  data() {
    return {
      // 求积方式
      METHOD,
      // 当前菜单项
      current: ["treeData"],
      // 0.
      treeData: {},
      // 1.
      discsYearInfo: {
        // 1.1
        discsYear: {
          columns: COLUMNS.discsYear,
          datas: []
        },
        // 1.2
        agesHeight: {
          columns: COLUMNS.agesHeight,
          datas: []
        }
      },
      // 2.
      volumesValueInfo: {
        // 2.1
        volumesValue: {
          columns: COLUMNS.volumesValue,
          datas: []
        },
        // 2.2
        agesVolume: {
          columns: COLUMNS.agesVolume,
          datas: []
        },
        // 2.3
        volumesModel: {
          options: OPTIONS.volumesModelCurve,
          chart: null,
          params: {},
          quota: {},
          datas: []
        }
      },
      // 3.
      volumesRateInfo: {
        // 3.1
        volumesRate: {
          columns: COLUMNS.volumesRate,
          datas: []
        },
        // 3.2
        volumesRateCurve: {
          options: OPTIONS.volumesRateCurve,
          chart: null,
          datas: []
        }
      },
      // 4.
      factorsInfo: {
        // 4.1
        factors: {
          columns: COLUMNS.factors,
          datas: []
        },
        // 4.2
        factorsCurve: {
          options: OPTIONS.factorsCurve,
          chart: null,
          datas: []
        }
      },
      // 5.
      growthsInfo: {
        // 5.1
        growthsTotal: {
          columns: COLUMNS.growths,
          datas: []
        },
        // 5.2
        growthsAverage: {
          columns: COLUMNS.growths,
          datas: []
        },
        // 5.3
        growthsSerial: {
          columns: COLUMNS.growths,
          datas: []
        },
        // 5.4
        // 5.4.1
        growthsTotalDiameterCurve: {
          options: OPTIONS.growthsTotalDiameterCurve,
          chart: null,
          datas: []
        },
        // 5.4.2
        growthsTotalHeightCurve: {
          options: OPTIONS.growthsTotalHeightCurve,
          chart: null,
          datas: []
        },
        // 5.4.3
        growthsTotalVolumeCurve: {
          options: OPTIONS.growthsTotalVolumeCurve,
          chart: null,
          datas: []
        },
        // 5.4.4
        growthsAveSerDiameterCurve: {
          options: OPTIONS.growthsAveSerDiameterCurve,
          chart: null,
          datas: []
        },
        // 5.4.5
        growthsAveSerHeightCurve: {
          options: OPTIONS.growthsAveSerHeightCurve,
          chart: null,
          datas: []
        },
        // 5.4.6
        growthsAveSerVolumeCurve: {
          options: OPTIONS.growthsAveSerVolumeCurve,
          chart: null,
          datas: []
        }
      },
      // 6.纵断面
      model2DInfo: {
        // 6.1
        model2DCanvas: {
          options: OPTIONS.model2DCanvas,
          chart: null,
          datas: []
        },
        // 6.2
        model2DDynamic: {
          options: OPTIONS.model2DDynamic,
          chart: null,
          datas: [],
          switch: false,
          current: 0
        }
      },
      // 7.三维模型
      model3DInfo: {
        // 7.1
        model3DCanvas: {
          options: OPTIONS.model3DCanvas,
          chart: null,
          datas: [],
          drawed: false
        }
      }
    };
  },
  watch: {
    current(to) {
      switch (to[0]) {
        // 2
        case "volumesValueInfo":
          setTimeout(() => {
            this.drawVolumesModelCurve();
          }, 100);
          break;
        // 3
        case "volumesRateInfo":
          setTimeout(() => {
            this.drawVolumesRateCurve();
          }, 100);
          break;
        // 4
        case "factorsInfo":
          setTimeout(() => {
            this.drawFactorsCurve();
          }, 100);
          break;
        // 5
        case "growthsInfo":
          setTimeout(() => {
            this.drawGrowthsTotalDiameterCurve();
            this.drawGrowthsTotalHeightCurve();
            this.drawGrowthsTotalVolumeCurve();
            this.drawGrowthsAveSerDiameterCurve();
            this.drawGrowthsAveSerHeightCurve();
            this.drawGrowthsAveSerVolumeCurve();
          }, 100);
          break;
        // 6
        case "model2DInfo":
          setTimeout(() => {
            this.drawModel2DCanavs();
          }, 100);
          break;
        // 7
        case "model3DInfo":
          if (this.model3DInfo.model3DCanvas.drawed) return;
          setTimeout(() => {
            this.drawModel3DCanavs();
          }, 100);
          break;
      }
    },
    "model2DInfo.model2DDynamic.switch": {
      deep: true,
      handler(value) {
        if (value) this.drawModel2DDynamic();
      }
    }
  },
  methods: {
    // 0
    getTreeData(treeData) {
      // 如果已经获取过了则返回
      if (this.treeData.id) return;
      // 设置treeData
      this.$set(this, "treeData", treeData);
      // 设置gradationMap，gradation→index
      let age = treeData.treeInfo.age,
        bark = treeData.discsInfo.bark,
        columns = treeData.discsInfo.columns[3].children,
        gradationsMap = {},
        gradationsMap_ = {};
      columns.forEach((column, index) => {
        gradationsMap[column.title] = `${index + 1}`;
        gradationsMap_[column.title] = `${index + 1}`;
      });
      if (bark === "with") {
        delete gradationsMap_[`${age}`];
        gradationsMap_[`${age}（去皮）`] = "1";
        gradationsMap_[`${age}（带皮）`] = "bark";
      }
      this.$set(this.treeData.discsInfo, "gradationsMap", gradationsMap);
      this.$set(this.treeData.discsInfo, "gradationsMap_", gradationsMap_);
      // get others data
      this.getDiscsYearInfo();
      this.getVolumesValueInfo();
      this.getVolumesRateInfo();
      this.getFactorsInfo();
      this.getGrowthsInfo();
      this.getModel2DInfo();
      this.getModel3DInfo();
    },
    // 1
    getDiscsYearInfo() {
      this.getDiscsYear();
      this.getAgesHeight();
    },
    // 2
    getVolumesValueInfo() {
      this.getVolumesValue();
      this.getAgesVolume();
      this.getVolumesModel();
    },
    // 3
    getVolumesRateInfo() {
      this.getVolumesRate();
      this.getVolumesRateCurve();
    },
    // 4
    getFactorsInfo() {
      this.getFactors();
      this.getFactorsCurve();
    },
    // 5
    getGrowthsInfo() {
      this.getGrowthsTotal();
      this.getGrowthsAverage();
      this.getGrowthsSerial();
      this.getGrowthsCurve();
    },
    // 6
    getModel2DInfo() {
      this.getModel2DCanvas();
      this.getModel2DDynamic();
    },
    // 7
    getModel3DInfo() {
      this.getModel3DCanvas();
    },
    // 1.1
    getDiscsYear() {
      let { age } = this.treeData.treeInfo,
        { count } = this.treeData.discsInfo,
        datasDiscs = this.treeData.discsInfo.datas,
        datasDiscsYear = this.discsYearInfo.discsYear.datas;
      for (let i = 0; i < count; i++) {
        let data = {
          number: datasDiscs[i].number,
          height: datasDiscs[i].height,
          ring: datasDiscs[i].ring,
          year: age - datasDiscs[i].ring
        };
        datasDiscsYear.push(data);
      }
    },
    // 1.2
    getAgesHeight() {
      //
      let { age, height } = this.treeData.treeInfo,
        { count, gradationsMap } = this.treeData.discsInfo,
        datasDiscsYear = [...this.discsYearInfo.discsYear.datas],
        datasAgesHeight = this.discsYearInfo.agesHeight.datas;
      datasDiscsYear.push({
        number: count + 1,
        height: height,
        year: age
      });
      //
      Object.keys(gradationsMap).forEach(currentAge => {
        let data = {
          age: currentAge
        };
        // 线性内插
        for (let j = 1; j < datasDiscsYear.length; j++) {
          let currentYear = datasDiscsYear[j].year,
            prevYear = datasDiscsYear[j - 1].year,
            currentHeight = datasDiscsYear[j].height,
            prevHeight = datasDiscsYear[j - 1].height;
          if (currentAge <= currentYear) {
            data.height =
              prevHeight +
              ((currentAge - prevYear) / (currentYear - prevYear)) *
                (currentHeight - prevHeight);
            break;
          }
        }
        datasAgesHeight.push(data);
      });
    },
    // 2.1
    getVolumesValue() {
      //
      let { height } = this.treeData.treeInfo,
        { bark, gradationsMap, gradationsMap_ } = this.treeData.discsInfo,
        datasDiscs = [...this.treeData.discsInfo.datas],
        datasAgesHeight = this.discsYearInfo.agesHeight.datas,
        datasVolumesValue = this.volumesValueInfo.volumesValue.datas,
        rowKey = 0;
      datasDiscs.push({ height, bark: 0, "1": 0 });
      //
      let gradationsMapUse = bark === "with" ? gradationsMap_ : gradationsMap;
      Object.keys(gradationsMapUse).forEach((currentAge, index, arr) => {
        index = bark && index === arr.length - 1 ? index - 1 : index;
        let currentHeight = datasAgesHeight[index].height,
          currentAgeKey = gradationsMapUse[currentAge];
        // height<=1.3m
        if (currentHeight <= datasDiscs[1].height) {
          let dataAll = {
            key: ++rowKey,
            age: currentAge,
            sectionBegin: 0,
            sectionEnd: currentHeight,
            diameterBegin: datasDiscs[0][currentAgeKey],
            diameterEnd: 0,
            method: "cone"
          };
          this.calcVolumeValue(dataAll);
          datasVolumesValue.push(dataAll);
        }
        // height<=2.6 or more
        else if (currentHeight <= datasDiscs[2].height) {
          let dataBottom = {
              key: ++rowKey,
              age: currentAge,
              sectionBegin: 0,
              sectionEnd: datasDiscs[1].height,
              diameterBegin: datasDiscs[0][currentAgeKey],
              diameterEnd: datasDiscs[1][currentAgeKey],
              method: "average"
            },
            dataTop = {
              key: ++rowKey,
              age: null,
              sectionBegin: datasDiscs[1].height,
              sectionEnd: currentHeight,
              diameterBegin: datasDiscs[1][currentAgeKey],
              diameterEnd: 0,
              method: "cone"
            };
          this.calcVolumeValue(dataBottom);
          this.calcVolumeValue(dataTop);
          datasVolumesValue.push(dataBottom, dataTop);
        }
        // height>2.6m or more
        else {
          //
          let is26 = datasDiscs[2].height === datasDiscs[1].height * 2,
            dataBottom,
            dataTop;
          // 0~2.6m or 0~1.3m
          dataBottom = is26
            ? {
                key: ++rowKey,
                age: currentAge,
                sectionBegin: 0,
                sectionEnd: datasDiscs[2].height,
                diameterBegin: datasDiscs[1][currentAgeKey],
                diameterEnd: datasDiscs[1][currentAgeKey],
                method: "center"
              }
            : {
                key: ++rowKey,
                age: currentAge,
                sectionBegin: 0,
                sectionEnd: datasDiscs[1].height,
                diameterBegin: datasDiscs[0][currentAgeKey],
                diameterEnd: datasDiscs[1][currentAgeKey],
                method: "average"
              };
          this.calcVolumeValue(dataBottom);
          datasVolumesValue.push(dataBottom);
          for (let j = is26 ? 2 : 1; j < datasDiscs.length - 1; j++) {
            //
            if (currentHeight > datasDiscs[j + 1].height) {
              let dataCenter = {
                key: ++rowKey,
                age: null,
                sectionBegin: datasDiscs[j].height,
                sectionEnd: datasDiscs[j + 1].height,
                diameterBegin: datasDiscs[j][currentAgeKey],
                diameterEnd: datasDiscs[j + 1][currentAgeKey],
                method: "average"
              };
              this.calcVolumeValue(dataCenter);
              datasVolumesValue.push(dataCenter);
            } else {
              dataTop = {
                key: ++rowKey,
                age: null,
                sectionBegin: datasDiscs[j].height,
                sectionEnd: datasDiscs[j + 1].height,
                diameterBegin: datasDiscs[j][currentAgeKey],
                diameterEnd: 0,
                method: "cone"
              };
              this.calcVolumeValue(dataTop);
              datasVolumesValue.push(dataTop);
              break;
            }
          }
        }
      });
    },
    // 2.2
    getAgesVolume() {
      let datasVolumesValue = this.volumesValueInfo.volumesValue.datas,
        datasAgesVolume = this.volumesValueInfo.agesVolume.datas,
        data;
      datasVolumesValue.forEach((value, index, arr) => {
        if (value.age) data = { age: value.age, volume: 0 };
        data.volume += value.volume;
        if (index === arr.length - 1 || arr[index + 1].age) {
          datasAgesVolume.push(data);
        }
      });
    },
    // 2.3
    async getVolumesModel() {
      let { gradationsMap } = this.treeData.discsInfo,
        datasAgesVolume = this.volumesValueInfo.agesVolume.datas,
        datasVolumesModelCurve = this.volumesValueInfo.volumesModel.datas,
        ages = [],
        volumes = [];
      Object.keys(gradationsMap).forEach((currentAge, index) => {
        ages.push(currentAge);
        volumes.push(datasAgesVolume[index].volume);
      });
      let params = { ages, volumes };
      let result = await serviceGetTreeModel(params);
      let datas = result.data;
      this.$set(this.volumesValueInfo.volumesModel, "params", {
        a: datas.params[0],
        b: datas.params[1],
        k: datas.params[2]
      });
      this.$set(this.volumesValueInfo.volumesModel, "quota", {
        SSE: datas.SSE,
        R2: datas.R2,
        RMSE: datas.RMSE
      });
      ages.forEach((age, index) => {
        datasVolumesModelCurve.push({
          type: "实测",
          age: Number(age),
          volume: volumes[index]
        });
        datasVolumesModelCurve.push({
          type: "预测",
          age: Number(age),
          volume: datas.predicts[index]
        });
      });
    },
    // 2.calc
    calcVolumeValue(data) {
      let pi = Math.PI,
        { sectionBegin, sectionEnd, diameterBegin, diameterEnd, method } = data,
        length = sectionEnd - sectionBegin,
        volume;
      switch (method) {
        case "cone":
          volume = ((pi / 4) * diameterBegin ** 2 * length) / 3;
          break;
        case "center":
          volume = (pi / 4) * diameterBegin ** 2 * length;
          break;
        case "average":
          volume =
            ((pi / 4) * (diameterBegin ** 2 + diameterEnd ** 2) * length) / 2;
          break;
      }
      data.volume = volume / 10000;
    },
    // 3.1
    getVolumesRate() {
      let { gradation, gradationsMap } = this.treeData.discsInfo,
        datasAgesVolume = this.volumesValueInfo.agesVolume.datas,
        datasVolumesRate = this.volumesRateInfo.volumesRate.datas;
      Object.keys(gradationsMap).forEach((currentAge, index) => {
        if (index === 0) return;
        let data = {
          age: currentAge - gradation / 2,
          current: datasAgesVolume[index].volume,
          prev: datasAgesVolume[index - 1].volume,
          gradation
        };
        this.calcVolumeRate(data);
        datasVolumesRate.push(data);
      });
    },
    // 3.2
    getVolumesRateCurve() {
      let datasVolumesRate = this.volumesRateInfo.volumesRate.datas,
        datasVolumesRateCurve = this.volumesRateInfo.volumesRateCurve.datas;
      datasVolumesRate.forEach(value => {
        let data = {
          age: value.age,
          rate: value.rate
        };
        datasVolumesRateCurve.push(data);
      });
    },
    // 3.calc
    calcVolumeRate(data) {
      let rate =
        (((data.current - data.prev) / (data.current + data.prev)) * 200) /
        data.gradation;
      data.rate = rate;
    },
    // 4.1
    getFactors() {
      let { gradationsMap } = this.treeData.discsInfo,
        datasDiscs = this.treeData.discsInfo.datas,
        datasAgesHeight = this.discsYearInfo.agesHeight.datas,
        datasAgesVolume = this.volumesValueInfo.agesVolume.datas,
        datasFactos = this.factorsInfo.factors.datas;
      Object.keys(gradationsMap).forEach((currentAge, index) => {
        if (datasAgesHeight[index].height <= 1.3) return;
        let currentAgeKey = gradationsMap[currentAge],
          data = {
            age: currentAge,
            volume: datasAgesVolume[index].volume,
            height: datasAgesHeight[index].height,
            diameter: datasDiscs[1][currentAgeKey]
          };
        this.calcFactor(data);
        datasFactos.push(data);
      });
    },
    // 4.2
    getFactorsCurve() {
      let datasFactors = this.factorsInfo.factors.datas,
        datasFactorsCurve = this.factorsInfo.factorsCurve.datas;
      datasFactors.forEach(value => {
        let data = {
          age: Number(value.age),
          factor: Number(value.factor)
        };
        datasFactorsCurve.push(data);
      });
    },
    // 4.calc
    calcFactor(data) {
      let pi = Math.PI,
        { volume, height, diameter } = data,
        area = ((pi * 1) / 40000) * diameter ** 2,
        factor = volume / (height * area);
      data.area = area;
      data.factor = factor;
    },
    // 5.1
    getGrowthsTotal() {
      let { gradationsMap } = this.treeData.discsInfo,
        datasDiscs = this.treeData.discsInfo.datas,
        datasAgesHeight = this.discsYearInfo.agesHeight.datas,
        datasAgesVolume = this.volumesValueInfo.agesVolume.datas,
        datasGrowthsTotal = this.growthsInfo.growthsTotal.datas;
      Object.keys(gradationsMap).forEach((currentAge, index) => {
        let currentAgeKey = gradationsMap[currentAge],
          data = {
            age: Number(currentAge),
            diameter: datasDiscs[1][currentAgeKey] || 0,
            height: datasAgesHeight[index].height,
            volume: datasAgesVolume[index].volume
          };
        datasGrowthsTotal.push(data);
      });
    },
    // 5.2
    getGrowthsAverage() {
      let datasGrowthsTotal = this.growthsInfo.growthsTotal.datas,
        datasGrowthsAverage = this.growthsInfo.growthsAverage.datas;
      datasGrowthsTotal.forEach(value => {
        let data = {
          age: value.age,
          diameter: value.diameter,
          height: value.height,
          volume: value.volume
        };
        data.diameter /= data.age;
        data.height /= data.age;
        data.volume /= data.age;
        datasGrowthsAverage.push(data);
      });
    },
    // 5.3
    getGrowthsSerial() {
      let { gradation } = this.treeData.discsInfo,
        datasGrowthsTotal = this.growthsInfo.growthsTotal.datas,
        datasGrowthSerial = this.growthsInfo.growthsSerial.datas;
      datasGrowthsTotal.forEach((value, index, arr) => {
        if (index === 0) return;
        let data = {
          age: value.age - gradation / 2,
          diameter: arr[index].diameter - arr[index - 1].diameter,
          height: arr[index].height - arr[index - 1].height,
          volume: arr[index].volume - arr[index - 1].volume
        };
        data.diameter /= gradation;
        data.height /= gradation;
        data.volume /= gradation;
        datasGrowthSerial.push(data);
      });
    },
    // 5.4
    getGrowthsCurve() {
      let datasGrowthsTotal = this.growthsInfo.growthsTotal.datas,
        datasGrowthsAverage = this.growthsInfo.growthsAverage.datas,
        datasGrowthsSerial = this.growthsInfo.growthsSerial.datas,
        datasGrowthsTotalDiameterCurve = this.growthsInfo
          .growthsTotalDiameterCurve.datas,
        datasGrowthsTotalHeightCurve = this.growthsInfo.growthsTotalHeightCurve
          .datas,
        datasGrowthsTotalVolumeCurve = this.growthsInfo.growthsTotalVolumeCurve
          .datas,
        datasGrowthsAveSerDiameterCurve = this.growthsInfo
          .growthsAveSerDiameterCurve.datas,
        datasGrowthsAveSerHeightCurve = this.growthsInfo
          .growthsAveSerHeightCurve.datas,
        datasGrowthsAveSerVolumeCurve = this.growthsInfo
          .growthsAveSerVolumeCurve.datas;
      datasGrowthsTotal.forEach(value => {
        datasGrowthsTotalDiameterCurve.push({
          age: value.age,
          diameter: value.diameter
        });
        datasGrowthsTotalHeightCurve.push({
          age: value.age,
          height: value.height
        });
        datasGrowthsTotalVolumeCurve.push({
          age: value.age,
          volume: value.volume
        });
      });
      datasGrowthsAverage.forEach(value => {
        datasGrowthsAveSerDiameterCurve.push({
          type: "平均",
          age: value.age,
          diameter: value.diameter
        });
        datasGrowthsAveSerHeightCurve.push({
          type: "平均",
          age: value.age,
          height: value.height
        });
        datasGrowthsAveSerVolumeCurve.push({
          type: "平均",
          age: value.age,
          volume: value.volume
        });
      });
      datasGrowthsSerial.forEach(value => {
        datasGrowthsAveSerDiameterCurve.push({
          type: "连年",
          age: value.age,
          diameter: value.diameter
        });
        datasGrowthsAveSerHeightCurve.push({
          type: "连年",
          age: value.age,
          height: value.height
        });
        datasGrowthsAveSerVolumeCurve.push({
          type: "连年",
          age: value.age,
          volume: value.volume
        });
      });
    },
    // 6.1
    getModel2DCanvas() {
      let { count, gradationsMap, datas } = this.treeData.discsInfo,
        datasAgesVolume = this.discsYearInfo.agesHeight.datas,
        datasModel2DCanavs = this.model2DInfo.model2DCanvas.datas;
      Object.keys(gradationsMap).forEach((currentAge, index) => {
        let currentKey = gradationsMap[currentAge];
        for (let i = 0; i <= count; i++) {
          let dataLeft = {
              age: currentAge,
              diameter: datas[i][currentKey] / 2,
              height: datas[i].height || 0
            },
            dataRight = {
              age: currentAge,
              diameter: -datas[i][currentKey] / 2,
              height: datas[i].height || 0
            };
          datasModel2DCanavs.push(dataLeft, dataRight);
          if (!datas[i + 1] || !datas[i + 1][currentKey]) {
            let dataMiddle = {
              age: currentAge,
              diameter: 0,
              height: datasAgesVolume[index].height
            };
            datasModel2DCanavs.push(dataMiddle);
            break;
          }
        }
      });
    },
    // 6.2
    getModel2DDynamic() {
      let { count, gradationsMap, datas } = this.treeData.discsInfo,
        datasAgesVolume = this.discsYearInfo.agesHeight.datas,
        datasModel2DDynamic = this.model2DInfo.model2DDynamic.datas;
      Object.keys(gradationsMap).forEach((currentAge, index) => {
        datasModel2DDynamic[index] = [];
        let currentKey = gradationsMap[currentAge];
        for (let i = 0; i <= count; i++) {
          let dataLeft = {
              diameter: datas[i][currentKey] / 2,
              height: datas[i].height || 0
            },
            dataRight = {
              diameter: -datas[i][currentKey] / 2,
              height: datas[i].height || 0
            };
          datasModel2DDynamic[index].push(dataLeft, dataRight);
          if (!datas[i + 1] || !datas[i + 1][currentKey]) {
            let dataMiddle = {
              diameter: 0,
              height: datasAgesVolume[index].height
            };
            datasModel2DDynamic[index].push(dataMiddle);
            break;
          }
        }
      });
    },
    // 7.1
    getModel3DCanvas() {
      let datasModel2DDynamic = this.model2DInfo.model2DDynamic.datas,
        lenDatasModel2DDynamic = datasModel2DDynamic.length,
        dataModel2DDynamic = datasModel2DDynamic[lenDatasModel2DDynamic - 1],
        lenDataModel2DDynamic = dataModel2DDynamic.length,
        datas2D = dataModel2DDynamic
          .sort((a, b) => {
            return b.diameter - a.diameter;
          })
          .slice(0, Math.ceil(lenDataModel2DDynamic / 2)),
        datasModel3DCanvas = this.model3DInfo.model3DCanvas.datas;
      for (let i = 1; i < datas2D.length; i++) {
        let data = {
          diameterBegin: datas2D[i - 1].diameter,
          diameterEnd: datas2D[i].diameter,
          length: datas2D[i].height - datas2D[i - 1].height,
          height: datas2D[i - 1].height
        };
        data.height += data.length / 2;
        datasModel3DCanvas.push(data);
      }
    },
    // draws
    drawVolumesModelCurve() {
      let { age, gradation } = this.treeData.discsInfo,
        { options, chart, datas } = this.volumesValueInfo.volumesModel;
      if (chart) return;
      let chart_ = new Chart(options);
      this.$set(this.volumesValueInfo.volumesModel, "chart", chart_);
      chart_.data(datas);
      chart_.scale({
        age: {
          min: gradation,
          max: age,
          tickInterval: gradation,
          alias: "年龄/a"
        },
        volume: {
          nice: true,
          alias: "材积/m^3"
        }
      });
      chart_.axis("age", { title: {} });
      chart_.axis("volume", { title: {} });
      chart_.tooltip({
        showCrosshairs: true,
        shared: true
      });
      chart_
        .point()
        .position("age*volume")
        .color("type");
      chart_
        .line()
        .position("age*volume")
        .color("type");
      chart_.render();
    },
    drawVolumesRateCurve() {
      let { age, gradation } = this.treeData.discsInfo,
        { options, chart, datas } = this.volumesRateInfo.volumesRateCurve;
      if (chart) return;
      let chart_ = new Chart(options);
      this.$set(this.volumesRateInfo.volumesRateCurve, "chart", chart_);
      chart_.data(datas);
      chart_.scale({
        age: {
          min: gradation,
          max: age,
          tickInterval: gradation,
          alias: "年龄/a"
        },
        rate: {
          nice: true,
          alias: "材积生长率/%"
        }
      });
      chart_.axis("age", { title: {} });
      chart_.axis("rate", { title: {} });
      chart_.tooltip({
        showCrosshairs: true,
        shared: true
      });
      chart_.point().position("age*rate");
      chart_.line().position("age*rate");
      chart_.render();
    },
    drawFactorsCurve() {
      let { age, gradation } = this.treeData.discsInfo,
        { options, chart, datas } = this.factorsInfo.factorsCurve;
      if (chart) return;
      let chart_ = new Chart(options);
      this.$set(this.factorsInfo.factorsCurve, "chart", chart_);
      chart_.data(datas);
      chart_.scale({
        age: {
          min: gradation,
          max: age,
          tickInterval: gradation,
          alias: "年龄/a"
        },
        factor: {
          nice: true,
          alias: "胸高形数"
        }
      });
      chart_.axis("age", { title: {} });
      chart_.axis("factor", { title: {} });
      chart_.tooltip({
        showCrosshairs: true,
        shared: true
      });
      chart_.point().position("age*factor");
      chart_.line().position("age*factor");
      chart_.render();
    },
    drawGrowthsTotalDiameterCurve() {
      let { age, gradation } = this.treeData.discsInfo,
        { options, chart, datas } = this.growthsInfo.growthsTotalDiameterCurve;
      if (chart) return;
      let chart_ = new Chart(options);
      this.$set(this.growthsInfo.growthsTotalDiameterCurve, "chart", chart_);
      chart_.data(datas);
      chart_.scale({
        age: {
          min: gradation,
          max: age,
          tickInterval: gradation,
          alias: "年龄/a"
        },
        diameter: {
          nice: true,
          alias: "胸径/cm"
        }
      });
      chart_.axis("age", { title: {} });
      chart_.axis("diameter", { title: {} });
      chart_.tooltip({
        showCrosshairs: true,
        shared: true
      });
      chart_.point().position("age*diameter");
      chart_.line().position("age*diameter");
      chart_.render();
    },
    drawGrowthsTotalHeightCurve() {
      let { age, gradation } = this.treeData.discsInfo,
        { options, chart, datas } = this.growthsInfo.growthsTotalHeightCurve;
      if (chart) return;
      let chart_ = new Chart(options);
      this.$set(this.growthsInfo.growthsTotalHeightCurve, "chart", chart_);
      chart_.data(datas);
      chart_.scale({
        age: {
          min: gradation,
          max: age,
          tickInterval: gradation,
          alias: "年龄/a"
        },
        height: {
          nice: true,
          alias: "树高/m"
        }
      });
      chart_.axis("age", { title: {} });
      chart_.axis("height", { title: {} });
      chart_.tooltip({
        showCrosshairs: true,
        shared: true
      });
      chart_.point().position("age*height");
      chart_.line().position("age*height");
      chart_.render();
    },
    drawGrowthsTotalVolumeCurve() {
      let { age, gradation } = this.treeData.discsInfo,
        { options, chart, datas } = this.growthsInfo.growthsTotalVolumeCurve;
      if (chart) return;
      let chart_ = new Chart(options);
      this.$set(this.growthsInfo.growthsTotalVolumeCurve, "chart", chart_);
      chart_.data(datas);
      chart_.scale({
        age: {
          min: gradation,
          max: age,
          tickInterval: gradation,
          alias: "年龄/a"
        },
        volume: {
          nice: true,
          alias: "材积/m^3"
        }
      });
      chart_.axis("age", { title: {} });
      chart_.axis("volume", { title: {} });
      chart_.tooltip({
        showCrosshairs: true,
        shared: true
      });
      chart_.point().position("age*volume");
      chart_.line().position("age*volume");
      chart_.render();
    },
    drawGrowthsAveSerDiameterCurve() {
      let { age, gradation } = this.treeData.discsInfo,
        { options, chart, datas } = this.growthsInfo.growthsAveSerDiameterCurve;
      if (chart) return;
      let chart_ = new Chart(options);
      this.$set(this.growthsInfo.growthsAveSerDiameterCurve, "chart", chart_);
      chart_.data(datas);
      chart_.scale({
        age: {
          min: gradation,
          max: age,
          tickInterval: gradation,
          alias: "年龄/a"
        },
        diameter: {
          nice: true,
          alias: "胸径/m^3"
        }
      });
      chart_.axis("age", { title: {} });
      chart_.axis("diameter", { title: {} });
      chart_.tooltip({
        showCrosshairs: true,
        shared: true
      });
      chart_
        .point()
        .position("age*diameter")
        .color("type");
      chart_
        .line()
        .position("age*diameter")
        .color("type");
      chart_.render();
    },
    drawGrowthsAveSerHeightCurve() {
      let { age, gradation } = this.treeData.discsInfo,
        { options, chart, datas } = this.growthsInfo.growthsAveSerHeightCurve;
      if (chart) return;
      let chart_ = new Chart(options);
      this.$set(this.growthsInfo.growthsAveSerHeightCurve, "chart", chart_);
      chart_.data(datas);
      chart_.scale({
        age: {
          min: gradation,
          max: age,
          tickInterval: gradation,
          alias: "年龄/a"
        },
        height: {
          nice: true,
          alias: "shugao/m^3"
        }
      });
      chart_.axis("age", { title: {} });
      chart_.axis("height", { title: {} });
      chart_.tooltip({
        showCrosshairs: true,
        shared: true
      });
      chart_
        .point()
        .position("age*height")
        .color("type");
      chart_
        .line()
        .position("age*height")
        .color("type");
      chart_.render();
    },
    drawGrowthsAveSerVolumeCurve() {
      let { age, gradation } = this.treeData.discsInfo,
        { options, chart, datas } = this.growthsInfo.growthsAveSerVolumeCurve;
      if (chart) return;
      let chart_ = new Chart(options);
      this.$set(this.growthsInfo.growthsAveSerVolumeCurve, "chart", chart_);
      chart_.data(datas);
      chart_.scale({
        age: {
          min: gradation,
          max: age,
          tickInterval: gradation,
          alias: "年龄/a"
        },
        volume: {
          nice: true,
          alias: "caiji/m^3"
        }
      });
      chart_.axis("age", { title: {} });
      chart_.axis("volume", { title: {} });
      chart_.tooltip({
        showCrosshairs: true,
        shared: true
      });
      chart_
        .point()
        .position("age*volume")
        .color("type");
      chart_
        .line()
        .position("age*volume")
        .color("type");
      chart_.render();
    },
    drawModel2DCanavs() {
      let { height } = this.treeData.treeInfo,
        { options, chart, datas } = this.model2DInfo.model2DCanvas;
      if (chart) return;
      let chart_ = new Chart(options);
      this.$set(this.model2DInfo.model2DCanvas, "chart", chart_);
      chart_.data(datas);
      chart_.scale({
        diameter: {
          min: -height * 2.5,
          max: height * 2.5,
          alias: "胸径/cm"
        },
        height: {
          min: 0,
          max: Math.ceil(height),
          tickInterval: 1,
          alias: "树高/m"
        }
      });
      chart_.axis("diameter", { title: {} });
      chart_.axis("height", { title: {} });
      chart_.tooltip({
        showCrosshairs: true,
        shared: true
      });
      chart_
        .area()
        .position("diameter*height")
        .color("age");
      chart_
        .line()
        .position("diameter*height")
        .color("age");
      chart_.render();
    },
    drawModel2DDynamic() {
      let { gradationsMap } = this.treeData.discsInfo,
        { chart, datas } = this.model2DInfo.model2DCanvas,
        dynamic = this.model2DInfo.model2DDynamic,
        interval = setInterval(() => {
          if (dynamic.switch) {
            dynamic.current += 1;
            if (dynamic.current >= Object.keys(gradationsMap).length)
              dynamic.current = 0;
            chart.changeData(dynamic.datas[dynamic.current]);
          } else {
            dynamic.current = -1;
            chart.changeData(datas);
            clearInterval(interval);
          }
        }, 500);
    },
    drawModel3DCanavs() {
      console.log("3D");
      let { height } = this.treeData.treeInfo,
        { color } = this.treeData.extraInfo,
        { options, chart, datas } = this.model3DInfo.model3DCanvas;
      if (chart) return;
      let dom = document.getElementById(options.container),
        domWidth = dom.offsetWidth,
        domHeight = dom.offsetHeight,
        renderer = new Three.WebGLRenderer(),
        scene = new Three.Scene(),
        camera = new Three.PerspectiveCamera(
          45,
          domWidth / domHeight,
          1,
          10000
        );
      //
      renderer.setSize(domWidth, domHeight);
      dom.appendChild(renderer.domElement);
      //
      let texture = new Three.TextureLoader().load(
          require("../assets/tree.jpg")
        ),
        objects = [];
      for (let i = 0; i < datas.length; i++) {
        let geometry = new Three.CylinderGeometry(
            datas[i].diameterEnd / 4,
            datas[i].diameterBegin / 4,
            datas[i].length,
            18,
            6
          ),
          material = new Three.MeshBasicMaterial({
            map: texture,
            color
          }),
          object = new Three.Mesh(geometry, material);
        object.position.y = datas[i].height;
        objects.push(object);
        scene.add(object);
      }
      camera.position.z = height * 1.5;
      camera.position.y = height / 2;
      //
      var animate = () => {
        requestAnimationFrame(animate);
        objects.forEach(object => {
          object.rotation.y += 0.01;
        });

        renderer.render(scene, camera);
      };
      animate();
      //
      dom.addEventListener("click", () => {
        if (objects[0].position.x === 0) {
          objects.forEach((object, index) => {
            object.position.x = 3 + index * 3 - (datas.length / 2) * 3;
          });
        } else {
          objects.forEach(object => {
            object.position.x = 0;
          });
        }
      });
      this.model3DInfo.model3DCanvas.drawed = true;
    },
    handleBack() {
      this.$router.push("/tree-list");
    }
  }
};
</script>

<style lang="less" scoped>
#growthsTotalDiameterCurve,
#growthsTotalHeightCurve,
#growthsTotalVolumeCurve,
#growthsAveSerDiameterCurve,
#growthsAveSerHeightCurve,
#growthsAveSerVolumeCurve {
  width: 100%;
  height: 240px;
}
#volumesModelCurve,
#volumesRateCurve,
#factorsCurve {
  width: 100%;
  height: 400px;
}
#model2DCanvas,
#model3DCanvas {
  width: 100%;
  height: 600px;
}
.curve {
  .title {
    text-align: center;
  }
}
</style>