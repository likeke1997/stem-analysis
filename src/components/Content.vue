<template>
  <a-card bordered class="container">
    <!--steps-->
    <a-steps :current="steps.current" class="steps">
      <a-step v-for="(step,stepIndex) in steps.items" :key="stepIndex" :title="step" />
    </a-steps>
    <!--contents-->
    <div class="contents">
      <!--contents-part1-->
      <div v-if="steps.current===0">
        <a-form-item label="树龄" v-bind="layout.form">
          <a-input-number v-model="basicInfo.treeAge" :min="1" />
        </a-form-item>
        <a-form-item label="树高" v-bind="layout.form">
          <a-input-number v-model="basicInfo.treeHeight" :min="2.6" />
        </a-form-item>
        <a-form-item label="圆盘数量" v-bind="layout.form">
          <a-input-number v-model="basicInfo.discsCount" :min="3" />
        </a-form-item>
      </div>
      <!--contents-part2-->
      <div v-else-if="steps.current===1">
        <a-table
          :columns="discsInfo.columns"
          :dataSource="discsInfo.datas"
          :pagination="false"
          :rowKey="record => record.number"
        >
          <a-input-number
            slot="height"
            slot-scope="value,record,index"
            v-model="discsInfo.datas[index].height"
            :min="0"
            :disabled="index<3"
          />
          <a-input-number
            slot="ringCount"
            slot-scope="value,record,index"
            v-model="discsInfo.datas[index].ringCount"
            :min="1"
            :max="basicInfo.treeAge"
            :disabled="index<1"
            @change="onDiscsInfoChange(index)"
          />
          <a-input-number
            v-for="(key,keyIndex) in discsInfo.diameterKeys"
            :key="keyIndex"
            :slot="key"
            slot-scope="value,record,index"
            v-model="discsInfo.datas[index][key]"
            :min="0"
            :disabled="keyIndex>=record.ringCount"
          />
        </a-table>
      </div>
      <!--contents-part3-->
      <div v-else-if="steps.current===2">
        <a-form-item label="各圆盘" v-bind="layout.form">
          <a-checkbox v-model="checksInfo.discsYear">生长所需年数</a-checkbox>
        </a-form-item>
        <a-form-item label="树木各龄阶" v-bind="layout.form">
          <a-checkbox v-model="checksInfo.treeAgesHeight">树高</a-checkbox>
          <a-checkbox v-model="checksInfo.treeAgesVolume">材积</a-checkbox>
        </a-form-item>
        <a-form-item label="树木生长量" v-bind="layout.form">
          <a-checkbox v-model="checksInfo.treeGrowthTotal">总生长量</a-checkbox>
          <a-checkbox v-model="checksInfo.treeGrowthAverage">平均生长量</a-checkbox>
          <a-checkbox v-model="checksInfo.treeGrowthSerial">连年生长量</a-checkbox>
          <a-checkbox v-model="checksInfo.treeGrowthChart">相关统计图</a-checkbox>
        </a-form-item>
        <a-form-item label="树木模型" v-bind="layout.form">
          <a-checkbox v-model="checksInfo.treeModel2D">纵断面图</a-checkbox>
          <a-checkbox v-model="checksInfo.treeModel3D">立体模型</a-checkbox>
          <a-checkbox v-model="checksInfo.treeModelDynamic">生长过程动态演示</a-checkbox>
        </a-form-item>
      </div>
      <!--contents-part4-->
      <div v-else-if="steps.current===3">
        <a-tabs v-model="resultsInfo.current.tab">
          <!--各圆盘信息-->
          <a-tab-pane v-if="checksInfo.discsYear" key="discs" tab="各圆盘信息">
            <a-collapse v-model="resultsInfo.current.panel" :bordered="false">
              <a-collapse-panel v-if="checksInfo.discsYear" key="discsYear" header="各圆盘生长所需年数">
                <a-table
                  :columns="resultsInfo.discsYear.columns"
                  :dataSource="resultsInfo.discsYear.datas"
                  :pagination="false"
                  :rowKey="record => record.number"
                />
              </a-collapse-panel>
            </a-collapse>
          </a-tab-pane>
          <!--树木各年龄信息-->
          <a-tab-pane
            v-if="checksInfo.treeAgesHeight || checksInfo.treeAgesVolume"
            key="treeAges"
            tab="树木各龄阶信息"
          >
            <a-collapse v-model="resultsInfo.current.panel" :bordered="false">
              <a-collapse-panel
                v-if="checksInfo.treeAgesHeight"
                key="treeAgesHeight"
                header="树木各龄阶树高"
              >
                <a-table
                  :columns="resultsInfo.treeAgesHeight.columns"
                  :dataSource="resultsInfo.treeAgesHeight.datas"
                  :pagination="false"
                  :rowKey="record => record.age"
                />
              </a-collapse-panel>
              <a-collapse-panel
                v-if="checksInfo.treeAgesVolume"
                key="treeAgesVolume"
                header="树木各龄阶材积"
              >
                <a-table
                  :columns="resultsInfo.treeAgesVolume.columns"
                  :dataSource="resultsInfo.treeAgesVolume.datas"
                  :pagination="false"
                  :rowKey="record => record.age"
                >
                  <a-tag slot="method" slot-scope="value">{{methods.items[value]}}</a-tag>
                </a-table>
              </a-collapse-panel>
            </a-collapse>
          </a-tab-pane>
          <!--树木生长量信息-->
          <a-tab-pane
            v-if="checksInfo.treeGrowthTotal || checksInfo.treeGrowthAverage || checksInfo.treeGrowthSerial || checksInfo.treeGrowthChart"
            key="treeGrowth"
            tab="树木生长量信息"
          >
            <a-collapse v-model="resultsInfo.current.panel" :bordered="false">
              <a-collapse-panel
                v-if="checksInfo.treeGrowthTotal"
                key="treeGrowthTotal"
                header="树木总生长量"
              >
                <a-table
                  :columns="resultsInfo.treeGrowthTotal.columns"
                  :dataSource="resultsInfo.treeGrowthTotal.datas"
                  :pagination="false"
                  :rowKey="record => record.age"
                />
              </a-collapse-panel>
              <a-collapse-panel
                v-if="checksInfo.treeGrowthAverage"
                key="treeGrowthAverage"
                header="树木平均生长量"
              >
                <a-table
                  :columns="resultsInfo.treeGrowthAverage.columns"
                  :dataSource="resultsInfo.treeGrowthAverage.datas"
                  :pagination="false"
                  :rowKey="record => record.age"
                />
              </a-collapse-panel>
              <a-collapse-panel
                v-if="checksInfo.treeGrowthSerial"
                key="treeGrowthSerial"
                header="树木连年生长量"
              >
                <a-table
                  :columns="resultsInfo.treeGrowthSerial.columns"
                  :dataSource="resultsInfo.treeGrowthSerial.datas"
                  :pagination="false"
                  :rowKey="record => record.age"
                />
              </a-collapse-panel>
              <a-collapse-panel
                v-if="checksInfo.treeGrowthChart"
                key="treeGrowthChart"
                header="树木生长量统计图"
              >
                <div class="chart">
                  <div class="title">胸径总生长量</div>
                  <div id="ChartTreeGrowthTotalDiameter" class="plot-growth" />
                </div>
                <a-divider />
                <div class="chart">
                  <div class="title">树高总生长量</div>
                  <div id="ChartTreeGrowthTotalHeight" class="plot-growth" />
                </div>
                <a-divider />
                <div class="chart">
                  <div class="title">材积总生长量</div>
                  <div id="ChartTreeGrowthTotalVolume" class="plot-growth" />
                </div>
                <a-divider />
                <div class="chart">
                  <div class="title">胸径平均和连年生长量</div>
                  <div id="ChartTreeGrowthAverageSerialDiameter" class="plot-growth" />
                </div>
                <a-divider />
                <div class="chart">
                  <div class="title">树高平均和连年生长量</div>
                  <div id="ChartTreeGrowthAverageSerialHeight" class="plot-growth" />
                </div>
                <a-divider />
                <div class="chart">
                  <div class="title">材积平均和连年生长量</div>
                  <div id="ChartTreeGrowthAverageSerialVolume" class="plot-growth" />
                </div>
              </a-collapse-panel>
            </a-collapse>
          </a-tab-pane>
          <!--树木模型信息-->
          <a-tab-pane
            v-if="checksInfo.treeModel2D || checksInfo.treeModel3D"
            key="treeModel"
            tab="树木模型信息"
          >
            <a-collapse v-model="resultsInfo.current.panel">
              <a-collapse-panel v-if="checksInfo.treeModel2D" key="treeModel2D" header="树木纵断面图">
                <div class="chart">
                  <div id="ChartTreeModel2D" class="plot-model" />
                  <a-slider
                    v-if="checksInfo.treeModelDynamic"
                    v-model="resultsInfo.treeModel2D.dynamic.current"
                    :min="1"
                    :max="basicInfo.treeAge"
                    :disabled="true"
                  />
                  <div v-if="checksInfo.treeModelDynamic" style="text-align:center;">
                    <span style="margin-right:16px;">生长过程动态演示</span>
                    <a-switch v-model="resultsInfo.treeModel2D.dynamic.switch" />
                  </div>
                </div>
              </a-collapse-panel>
              <a-collapse-panel v-if="checksInfo.treeModel3D" key="treeModel3D" header="树木立体模型">
                <div class="chart">
                  <div id="ChartTreeModel3D" class="plot-model" />
                </div>
              </a-collapse-panel>
            </a-collapse>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <!--actions-->
    <div class="actions">
      <a-button
        type="default"
        :disabled="isPrevStepButtonDisabled"
        @click="toPrevStep"
        class="button"
      >上一步</a-button>
      <a-button
        type="primary"
        :disabled="isNextStepButtonDisabled"
        @click="toNextStep"
        class="button"
      >下一步</a-button>
    </div>
  </a-card>
</template>

<script>
import { Chart } from "@antv/g2";
import * as Three from "three";
import {
  FORM_LAYOUT,
  STEPS_ITEMS,
  METHODS_ITEMS,
  TABLES_COLUMNS,
  //MOCK_DISCS_DATA,
  CHARTS_OPTIONS
} from "@/const";
export default {
  name: "Content",
  data() {
    return {
      layout: {
        form: FORM_LAYOUT
      },
      steps: {
        items: STEPS_ITEMS,
        current: 0
      },
      methods: {
        items: METHODS_ITEMS
      },
      basicInfo: {
        treeAge: 12,
        treeHeight: 11.6,
        discsCount: 7
      },
      discsInfo: {
        columns: TABLES_COLUMNS.DISCS,
        datas: [],
        diameterKeys: []
      },
      checksInfo: {
        discsYear: true,
        treeAgesHeight: true,
        treeAgesVolume: true,
        treeGrowthTotal: true,
        treeGrowthAverage: true,
        treeGrowthSerial: true,
        treeGrowthChart: true,
        treeModel2D: true,
        treeModel3D: true,
        treeModelDynamic: true
      },
      resultsInfo: {
        current: {
          tab: "",
          panel: []
        },
        discsYear: {
          columns: TABLES_COLUMNS.DISCS_YEAR,
          datas: []
        },
        treeAgesHeight: {
          columns: TABLES_COLUMNS.TREE_AGES_HEIGHT,
          datas: []
        },
        treeAgesVolume: {
          columns: TABLES_COLUMNS.TREE_AGES_VOLUME,
          datas: [],
          volumeTotals: []
        },
        treeGrowthTotal: {
          columns: TABLES_COLUMNS.TREE_GROWTH,
          datas: []
        },
        treeGrowthAverage: {
          columns: TABLES_COLUMNS.TREE_GROWTH,
          datas: []
        },
        treeGrowthSerial: {
          columns: TABLES_COLUMNS.TREE_GROWTH,
          datas: []
        },
        treeGrowthTotalDiameter: {
          options: CHARTS_OPTIONS.TREE_GROWTH_TOTAL_DIAMETER,
          chart: null,
          datas: []
        },
        treeGrowthTotalHeight: {
          options: CHARTS_OPTIONS.TREE_GROWTH_TOTAL_HEIGHT,
          chart: null,
          datas: []
        },
        treeGrowthTotalVolume: {
          options: CHARTS_OPTIONS.TREE_GROWTH_TOTAL_VOLUME,
          chart: null,
          datas: []
        },
        treeGrowthAverageSerialDiameter: {
          options: CHARTS_OPTIONS.TREE_GROWTH_AVERAGE_SERIAL_DIAMETER,
          chart: null,
          datas: []
        },
        treeGrowthAverageSerialHeight: {
          options: CHARTS_OPTIONS.TREE_GROWTH_AVERAGE_SERIAL_HEIGHT,
          chart: null,
          datas: []
        },
        treeGrowthAverageSerialVolume: {
          options: CHARTS_OPTIONS.TREE_GROWTH_AVERAGE_SERIAL_VOLUME,
          chart: null,
          datas: []
        },
        treeModel2D: {
          options: CHARTS_OPTIONS.TREE_MODEL_2D,
          chart: null,
          datas: [],
          dynamic: {
            switch: false,
            current: 1,
            datas: []
          }
        },
        treeModel3D: {
          datas: [],
          drawed: false
        }
      }
    };
  },
  computed: {
    isPrevStepButtonDisabled() {
      return this.steps.current === 0;
    },
    isNextStepButtonDisabled() {
      return this.steps.current === this.steps.items.length - 1;
    }
  },
  watch: {
    "resultsInfo.current": {
      deep: true,
      handler(current) {
        //
        if (
          this.checksInfo.treeGrowthChart &&
          current.tab === "treeGrowth" &&
          current.panel.includes("treeGrowthChart")
        ) {
          setTimeout(() => {
            if (!this.resultsInfo.treeGrowthTotalDiameter.chart)
              this.drawTreeGrowthTotalDiameter();
            if (!this.resultsInfo.treeGrowthTotalHeight.chart)
              this.drawTreeGrowthTotalHeight();
            if (!this.resultsInfo.treeGrowthTotalVolume.chart)
              this.drawTreeGrowthTotalVolume();
            if (!this.resultsInfo.treeGrowthAverageSerialDiameter.chart)
              this.drawTreeGrowthAverageSerialDiameter();
            if (!this.resultsInfo.treeGrowthAverageSerialHeight.chart)
              this.drawTreeGrowthAverageSerialHeight();
            if (!this.resultsInfo.treeGrowthAverageSerialVolume.chart)
              this.drawTreeGrowthAverageSerialVolume();
          }, 0);
        }
        //
        else if (current.tab === "treeModel") {
          if (
            this.checksInfo.treeModel2D &&
            current.panel.includes("treeModel2D")
          ) {
            setTimeout(() => {
              if (!this.resultsInfo.treeModel2D.chart) this.drawTreeModel2D();
            }, 0);
          }
          if (
            this.checksInfo.treeModel3D &&
            current.panel.includes("treeModel3D")
          ) {
            setTimeout(() => {
              if (!this.resultsInfo.treeModel3D.drawed) this.drawTreeModel3D();
            }, 0);
          }
        }
      }
    },
    "resultsInfo.treeModel2D.dynamic.switch": {
      deep: true,
      handler(value) {
        if (value) this.drawTreeModelDynamic2D();
      }
    }
  },
  methods: {
    // toStep
    toPrevStep() {
      switch (this.steps.current) {
        case 1:
          this.resetDiscsInfo();
          break;
        case 2:
          break;
        case 3:
          this.resetResultsInfo();
          break;
      }
      this.steps.current -= 1;
    },
    toNextStep() {
      switch (this.steps.current) {
        case 0:
          if (!this.validataBasicInfo()) return;
          this.initDiscsInfo();
          break;
        case 1:
          if (!this.validateDiscsInfo()) return;
          break;
        case 2:
          this.initResultsInfo();
          break;
      }
      this.steps.current += 1;
    },
    // basicInfo
    validataBasicInfo() {
      let basicInfo = this.basicInfo,
        validated = true;
      if (!basicInfo.treeAge) validated = false;
      if (!basicInfo.treeHeight) validated = false;
      if (!basicInfo.discsCount) validated = false;
      if (!validated) this.$message.error("请完整且正确地填写信息！");
      return validated;
    },
    // discsInfo
    resetDiscsInfo() {
      this.$set(this.discsInfo.columns[3], "children", []);
      this.$set(this.discsInfo, "datas", []);
      this.$set(this.discsInfo, "diameterKeys", []);
    },
    initDiscsInfo() {
      //
      let treeAge = this.basicInfo.treeAge,
        discsCount = this.basicInfo.discsCount,
        diameters = {};
      //
      for (let i = treeAge; i >= 1; i--) {
        let key = `diameter_${i}`,
          column = {
            dataIndex: key,
            scopedSlots: { customRender: key },
            title: i,
            align: "center"
          };
        diameters[key] = null;
        this.discsInfo.columns[3].children.push(column);
        this.discsInfo.diameterKeys.push(key);
      }
      //
      for (let i = 1; i <= discsCount; i++) {
        let data = {
          number: i,
          height: null,
          ringCount: null,
          ...diameters
        };
        switch (i) {
          case 1:
            data.height = 0;
            data.ringCount = treeAge;
            break;
          case 2:
            data.height = 1.3;
            break;
          case 3:
            data.height = 2.6;
            break;
        }
        this.discsInfo.datas.push(data);
      }
    },
    onDiscsInfoChange(index) {
      let ringCount = this.discsInfo.datas[index].ringCount,
        diameterKeys = this.discsInfo.diameterKeys;
      for (let i = ringCount; i < diameterKeys.length; i++) {
        let diameterKey = diameterKeys[i];
        this.discsInfo.datas[index][diameterKey] = null;
      }
    },
    validateDiscsInfo() {
      let discsCount = this.basicInfo.discsCount,
        diameterKeys = this.discsInfo.diameterKeys,
        datasDiscs = this.discsInfo.datas,
        validated = true;
      for (let i = 0; i < discsCount; i++) {
        let data = datasDiscs[i];
        if (data.height === null) validated = false;
        if (data.ringCount === null) validated = false;
        for (let j = 0; j < data.ringCount; j++) {
          let diameterKey = diameterKeys[j];
          if (data[diameterKey] === null) validated = false;
        }
        if (!validated) {
          this.$message.error("请完整且正确地填写信息！");
          break;
        }
      }
      return validated;
    },
    // resultsInfo
    resetResultsInfo() {
      //
      this.resultsInfo.current.tab = null;
      this.resultsInfo.current.current = [];
      //
      this.$set(this.resultsInfo.treeAgesHeight, "datas", []);
      this.$set(this.resultsInfo.treeAgesVolume, "datas", []);
      this.$set(this.resultsInfo.treeAgesVolume, "volumeTotals", []);
      this.$set(this.resultsInfo.treeGrowthTotal, "datas", []);
      this.$set(this.resultsInfo.treeGrowthAverage, "datas", []);
      this.$set(this.resultsInfo.treeGrowthSerial, "datas", []);
      this.$set(this.resultsInfo.treeGrowthSerial, "datas", []);
      this.$set(this.resultsInfo.treeGrowthTotalDiameter, "chart", null);
      this.$set(this.resultsInfo.treeGrowthTotalHeight, "chart", null);
      this.$set(this.resultsInfo.treeGrowthTotalVolume, "chart", null);
      this.$set(
        this.resultsInfo.treeGrowthAverageSerialDiameter,
        "chart",
        null
      );
      this.$set(this.resultsInfo.treeGrowthAverageSerialHeight, "chart", null);
      this.$set(this.resultsInfo.treeGrowthAverageSerialVolume, "chart", null);
      this.$set(this.resultsInfo.treeGrowthTotalDiameter, "datas", []);
      this.$set(this.resultsInfo.treeGrowthTotalHeight, "datas", []);
      this.$set(this.resultsInfo.treeGrowthTotalVolume, "datas", []);
      this.$set(this.resultsInfo.treeGrowthAverageSerialDiameter, "datas", []);
      this.$set(this.resultsInfo.treeGrowthAverageSerialHeight, "datas", []);
      this.$set(this.resultsInfo.treeGrowthAverageSerialVolume, "datas", []);
      this.$set(this.resultsInfo.treeModel2D, "chart", null);
      this.$set(this.resultsInfo.treeModel2D, "datas", []);
      this.$set(this.resultsInfo.treeModel3D, "drawed", false);
      this.$set(this.resultsInfo.treeModel3D, "datas", []);
    },
    initResultsInfo() {
      this.getDiscsYear();
      this.getTreeAgesHeight();
      this.getTreeAgesVolume();
      this.getTreeGrowthTotal();
      this.getTreeGrowthAverage();
      this.getTreeGrowthSerial();
      this.getTreeGrowthChart();
      this.getTreeModel2D();
      this.getTreeModelDynamic();
      this.getTreeModel3D();
    },
    getDiscsYear() {
      let treeAge = this.basicInfo.treeAge,
        datasDiscs = this.discsInfo.datas,
        datasDiscsYear = this.resultsInfo.discsYear.datas;
      for (let i = 0; i < datasDiscs.length; i++) {
        let data = {
          number: datasDiscs[i].number,
          height: datasDiscs[i].height,
          year: i === 0 ? 0 : treeAge - datasDiscs[i].ringCount + 0.5
        };
        datasDiscsYear.push(data);
      }
    },
    getTreeAgesHeight() {
      let treeAge = this.basicInfo.treeAge,
        treeHeight = this.basicInfo.treeHeight,
        datasDiscsYear = [...this.resultsInfo.discsYear.datas],
        datasTreeAgesHeight = this.resultsInfo.treeAgesHeight.datas;
      datasDiscsYear.push({ height: treeHeight, year: treeAge });
      for (let i = 1; i <= treeAge; i++) {
        let data = {
          age: i,
          height: null
        };
        for (let j = 1; j < datasDiscsYear.length; j++) {
          let currentYear = datasDiscsYear[j].year,
            prevYear = datasDiscsYear[j - 1].year,
            currentHeight = datasDiscsYear[j].height,
            prevHeight = datasDiscsYear[j - 1].height;
          if (i <= currentYear) {
            data.height =
              prevHeight +
              ((i - prevYear) / (currentYear - prevYear)) *
                (currentHeight - prevHeight);
            break;
          }
        }
        datasTreeAgesHeight.push(data);
      }
    },
    getTreeAgesVolume() {
      let treeAge = this.basicInfo.treeAge,
        treeHeight = this.basicInfo.treeHeight,
        datasDiscs = [...this.discsInfo.datas],
        datasTreeAgesHeight = this.resultsInfo.treeAgesHeight.datas,
        datasTreeAgesVolume = this.resultsInfo.treeAgesVolume.datas,
        datasTreeAgesVolumeTotals = this.resultsInfo.treeAgesVolume
          .volumeTotals;
      datasDiscs.push({ height: treeHeight });
      //
      for (let i = 1; i <= treeAge; i++) {
        let currentTreeHeight = datasTreeAgesHeight[i - 1].height,
          currentVolumeTotal = 0;
        // <= 1.3
        if (currentTreeHeight <= 1.3) {
          let data = {
            age: i,
            section: `0.00 ~ ${currentTreeHeight}`,
            diameterBegin: datasDiscs[0][`diameter_${i}`],
            diameterEnd: 0,
            length: currentTreeHeight,
            volume: null,
            method: "cone"
          };
          currentVolumeTotal += this.calcTreeVolume(data);
          datasTreeAgesVolume.push(data);
          datasTreeAgesVolumeTotals.push(currentVolumeTotal);
        }
        // 1.3 ~ 2.6
        else if (currentTreeHeight <= 2.6) {
          let dataBottom = {
              age: i,
              section: `0.00 ~ 1.30`,
              diameterBegin: datasDiscs[0][`diameter_${i}`],
              diameterEnd: datasDiscs[1][`diameter_${i}`],
              length: 1.3,
              volume: null,
              method: "average"
            },
            dataTop = {
              age: "",
              section: `1.30 ~ ${currentTreeHeight.toFixed(2)}`,
              diameterBegin: datasDiscs[1][`diameter_${i}`],
              diameterEnd: 0,
              length: currentTreeHeight - 1.3,
              volume: null,
              method: "cone"
            };
          currentVolumeTotal += this.calcTreeVolume(dataBottom);
          currentVolumeTotal += this.calcTreeVolume(dataTop);
          datasTreeAgesVolume.push(dataBottom, dataTop);
          datasTreeAgesVolumeTotals.push(currentVolumeTotal);
        }
        // > 2.6
        else {
          //
          let dataBottom = {
            age: i,
            section: `0.00 ~ 2.60`,
            diameterBegin: datasDiscs[1][`diameter_${i}`],
            diameterEnd: datasDiscs[1][`diameter_${i}`],
            length: 2.6,
            volume: null,
            method: "center"
          };
          currentVolumeTotal += this.calcTreeVolume(dataBottom);
          datasTreeAgesVolume.push(dataBottom);
          //
          for (let j = 2; j < datasDiscs.length - 1; j++) {
            //
            if (currentTreeHeight > datasDiscs[j + 1].height) {
              let dataCenter = {
                age: "",
                section:
                  datasDiscs[j].height.toFixed(2) +
                  " ~ " +
                  datasDiscs[j + 1].height.toFixed(2),
                diameterBegin: datasDiscs[j][`diameter_${i}`],
                diameterEnd: datasDiscs[j + 1][`diameter_${i}`],
                length: datasDiscs[j + 1].height - datasDiscs[j].height,
                volume: null,
                method: "average"
              };
              currentVolumeTotal += this.calcTreeVolume(dataCenter);
              datasTreeAgesVolume.push(dataCenter);
            }
            //
            else {
              let dataTop = {
                age: "",
                section:
                  datasDiscs[j].height.toFixed(2) +
                  " ~ " +
                  currentTreeHeight.toFixed(2),
                diameterBegin: datasDiscs[j][`diameter_${i}`],
                diameterEnd: 0,
                length: currentTreeHeight - datasDiscs[j].height,
                volume: null,
                method: "cone"
              };
              currentVolumeTotal += this.calcTreeVolume(dataTop);
              datasTreeAgesVolume.push(dataTop);
              datasTreeAgesVolumeTotals.push(currentVolumeTotal);
              break;
            }
          }
        }
      }
    },
    getTreeGrowthTotal() {
      let treeAge = this.basicInfo.treeAge,
        datasDiscs = this.discsInfo.datas,
        datasTreeAgesHeight = this.resultsInfo.treeAgesHeight.datas,
        datasTreeAgesVolumeTotals = this.resultsInfo.treeAgesVolume
          .volumeTotals,
        datasTreeGrowthTotal = this.resultsInfo.treeGrowthTotal.datas;
      for (let i = 1; i <= treeAge; i++) {
        let data = {
          age: i,
          diameter: datasDiscs[1][`diameter_${i}`] || 0,
          height: datasTreeAgesHeight[i - 1].height,
          volume: datasTreeAgesVolumeTotals[i - 1]
        };
        datasTreeGrowthTotal.push(data);
      }
    },
    getTreeGrowthAverage() {
      let treeAge = this.basicInfo.treeAge,
        datasTreeGrowthTotal = this.resultsInfo.treeGrowthTotal.datas,
        datasTreeGrowthAverage = this.resultsInfo.treeGrowthAverage.datas;
      for (let i = 1; i <= treeAge; i++) {
        let data = {
          age: i,
          diameter: datasTreeGrowthTotal[i - 1].diameter / i,
          height: datasTreeGrowthTotal[i - 1].height / i,
          volume: datasTreeGrowthTotal[i - 1].volume / i
        };
        datasTreeGrowthAverage.push(data);
      }
    },
    getTreeGrowthSerial() {
      let treeAge = this.basicInfo.treeAge,
        datasTreeGrowthTotal = this.resultsInfo.treeGrowthTotal.datas,
        datasTreeGrowthSerial = this.resultsInfo.treeGrowthSerial.datas;
      for (let i = 1; i < treeAge; i++) {
        let data = {
          age: i + 0.5,
          diameter:
            datasTreeGrowthTotal[i].diameter -
            datasTreeGrowthTotal[i - 1].diameter,
          height:
            datasTreeGrowthTotal[i].height - datasTreeGrowthTotal[i - 1].height,
          volume:
            datasTreeGrowthTotal[i].volume - datasTreeGrowthTotal[i - 1].volume
        };
        datasTreeGrowthSerial.push(data);
      }
    },
    getTreeGrowthChart() {
      //
      let treeAge = this.basicInfo.treeAge,
        {
          treeGrowthTotal,
          treeGrowthAverage,
          treeGrowthSerial,
          treeGrowthTotalDiameter,
          treeGrowthTotalHeight,
          treeGrowthTotalVolume,
          treeGrowthAverageSerialDiameter,
          treeGrowthAverageSerialHeight,
          treeGrowthAverageSerialVolume
        } = this.resultsInfo;
      //
      treeGrowthTotalDiameter.datas.push({ age: 0, diameter: 0.0 });
      treeGrowthTotalHeight.datas.push({ age: 0, height: 0.0 });
      treeGrowthTotalVolume.datas.push({ age: 0, volume: 0.0 });
      for (let i = 0; i < treeAge; i++) {
        treeGrowthTotalDiameter.datas.push({
          age: treeGrowthTotal.datas[i].age,
          diameter: treeGrowthTotal.datas[i].diameter.toFixed(2)
        });
        treeGrowthTotalHeight.datas.push({
          age: treeGrowthTotal.datas[i].age,
          height: treeGrowthTotal.datas[i].height.toFixed(2)
        });
        treeGrowthTotalVolume.datas.push({
          age: treeGrowthTotal.datas[i].age,
          volume: treeGrowthTotal.datas[i].volume.toFixed(8)
        });
        treeGrowthAverageSerialDiameter.datas.push({
          type: "平均",
          age: treeGrowthAverage.datas[i].age,
          diameter: Number(treeGrowthAverage.datas[i].diameter.toFixed(2))
        });
        treeGrowthAverageSerialHeight.datas.push({
          type: "平均",
          age: treeGrowthAverage.datas[i].age,
          height: Number(treeGrowthAverage.datas[i].height.toFixed(2))
        });
        treeGrowthAverageSerialVolume.datas.push({
          type: "平均",
          age: treeGrowthAverage.datas[i].age,
          volume: Number(treeGrowthAverage.datas[i].volume.toFixed(8))
        });
      }
      //
      for (let i = 0; i < treeAge - 1; i++) {
        treeGrowthAverageSerialDiameter.datas.push({
          type: "连年",
          age: treeGrowthSerial.datas[i].age,
          diameter: Number(treeGrowthSerial.datas[i].diameter.toFixed(2))
        });
        treeGrowthAverageSerialHeight.datas.push({
          type: "连年",
          age: treeGrowthSerial.datas[i].age,
          height: Number(treeGrowthSerial.datas[i].height.toFixed(2))
        });
        treeGrowthAverageSerialVolume.datas.push({
          type: "连年",
          age: treeGrowthSerial.datas[i].age,
          volume: Number(treeGrowthSerial.datas[i].volume.toFixed(8))
        });
      }
    },
    getTreeModel2D() {
      let { treeAge, discsCount } = this.basicInfo,
        datasDiscs = this.discsInfo.datas,
        datasTreeAgesHeight = this.resultsInfo.treeAgesHeight.datas,
        datasTreeModel2D = this.resultsInfo.treeModel2D.datas;
      for (let i = 1; i <= treeAge; i++) {
        let currentTreeHeight = datasTreeAgesHeight[i - 1].height,
          currentDiameterKey = `diameter_${i}`;
        for (let j = 0; j <= discsCount; j++) {
          if (!datasDiscs[j] || !datasDiscs[j][currentDiameterKey]) {
            datasTreeModel2D.push({
              age: `树龄${i}`,
              diameter: 0.0,
              height: currentTreeHeight
            });
            break;
          }
          datasTreeModel2D.push(
            {
              age: `树龄${i}`,
              diameter: -datasDiscs[j][currentDiameterKey] / 2,
              height: datasDiscs[j].height
            },
            {
              age: `树龄${i}`,
              diameter: datasDiscs[j][currentDiameterKey] / 2,
              height: datasDiscs[j].height
            }
          );
        }
      }
    },
    getTreeModel3D() {
      let datasTreeModel2D = [...this.resultsInfo.treeModel2D.dynamic.datas],
        datasTreeModel3D = this.resultsInfo.treeModel3D.datas;
      for (let i = 0; i < datasTreeModel2D.length; i++) {
        let data2D = datasTreeModel2D[i],
          data3D = [];
        data2D.sort((a, b) => {
          return b.diameter - a.diameter;
        });
        data2D = data2D.slice(0, Math.ceil(data2D.length / 2));
        for (let j = 0; j < data2D.length - 1; j++) {
          let data = {
            diameterBegin: data2D[j].diameter,
            diameterEnd: data2D[j + 1].diameter,
            length: data2D[j + 1].height - data2D[j].height
          };
          data.height = data2D[j].height + data.length / 2;
          data3D.push(data);
        }
        datasTreeModel3D.push(data3D);
      }
    },
    getTreeModelDynamic() {
      this.getTreeModelDynamic2D();
      this.getTreeModelDynamic3D();
    },
    getTreeModelDynamic2D() {
      let { treeAge, discsCount } = this.basicInfo,
        datasDiscs = this.discsInfo.datas,
        datasTreeAgesHeight = this.resultsInfo.treeAgesHeight.datas,
        datasTreeModelDynamic2D = this.resultsInfo.treeModel2D.dynamic.datas;
      for (let i = 1; i <= treeAge; i++) {
        let currentTreeHeight = datasTreeAgesHeight[i - 1].height,
          currentDiameterKey = `diameter_${i}`,
          datas = [];
        for (let j = 0; j < discsCount; j++) {
          if (!datasDiscs[j] || !datasDiscs[j][currentDiameterKey]) break;
          let dataLeft = {
              diameter: -datasDiscs[j][currentDiameterKey] / 2,
              height: datasDiscs[j].height
            },
            dataRight = {
              diameter: datasDiscs[j][currentDiameterKey] / 2,
              height: datasDiscs[j].height
            };
          datas.push(dataLeft, dataRight);
        }
        datas.push({
          diameter: 0,
          height: currentTreeHeight
        });
        datasTreeModelDynamic2D.push(datas);
      }
    },
    getTreeModelDynamic3D() {
      //
    },
    drawTreeGrowthTotalDiameter() {
      let { options, chart, datas } = this.resultsInfo.treeGrowthTotalDiameter;
      if (!chart) {
        let chart_ = new Chart(options);
        this.$set(this.resultsInfo.treeGrowthTotalDiameter, "chart", chart_);
        chart_.data(datas);
        chart_.scale({
          age: {
            range: [0, 1],
            tickInterval: 1,
            alias: "树龄/a"
          },
          diameter: {
            min: 0,
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
        chart_
          .line()
          .position("age*diameter")
          .label("diameter");
        chart_.point().position("age*diameter");
        chart_.render();
      }
    },
    drawTreeGrowthTotalHeight() {
      let { options, chart, datas } = this.resultsInfo.treeGrowthTotalHeight;
      if (!chart) {
        let chart_ = new Chart(options);
        this.$set(this.resultsInfo.treeGrowthTotalHeight, "chart", chart_);
        chart_.data(datas);
        chart_.scale({
          age: {
            range: [0, 1],
            tickInterval: 1,
            alias: "树龄/a"
          },
          height: {
            min: 0,
            nice: true,
            alias: "高度/m"
          }
        });
        chart_.axis("age", { title: {} });
        chart_.axis("height", { title: {} });
        chart_.tooltip({
          showCrosshairs: true,
          shared: true
        });
        chart_
          .line()
          .position("age*height")
          .label("height");
        chart_.point().position("age*height");
        chart_.render();
      }
    },
    drawTreeGrowthTotalVolume() {
      let { options, chart, datas } = this.resultsInfo.treeGrowthTotalVolume;
      if (!chart) {
        let chart_ = new Chart(options);
        this.$set(this.resultsInfo.treeGrowthTotalVolume, "chart", chart_);
        chart_.data(datas);
        chart_.scale({
          age: {
            range: [0, 1],
            tickInterval: 1,
            alias: "树龄/a"
          },
          volume: {
            min: 0,
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
          .line()
          .position("age*volume")
          .label("volume");
        chart_.point().position("age*volume");
        chart_.render();
      }
    },
    drawTreeGrowthAverageSerialDiameter() {
      let {
        options,
        chart,
        datas
      } = this.resultsInfo.treeGrowthAverageSerialDiameter;
      if (!chart) {
        let chart_ = new Chart(options);
        this.$set(
          this.resultsInfo.treeGrowthAverageSerialDiameter,
          "chart",
          chart_
        );
        chart_.data(datas);
        chart_.scale({
          age: {
            range: [0, 1],
            tickInterval: 1,
            alias: "树龄/a"
          },
          diameter: {
            min: 0,
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
        chart_.legend({
          position: "top-right"
        });
        chart_
          .line()
          .position("age*diameter")
          .color("type")
          .label("diameter");
        chart_
          .point()
          .position("age*diameter")
          .color("type");
        chart_.render();
      }
    },
    drawTreeGrowthAverageSerialHeight() {
      let {
        options,
        chart,
        datas
      } = this.resultsInfo.treeGrowthAverageSerialHeight;
      if (!chart) {
        let chart_ = new Chart(options);
        this.$set(
          this.resultsInfo.treeGrowthAverageSerialHeight,
          "chart",
          chart_
        );
        chart_.data(datas);
        chart_.scale({
          age: {
            range: [0, 1],
            tickInterval: 1,
            alias: "树龄/a"
          },
          height: {
            min: 0,
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
        chart_.legend({
          position: "top-right"
        });
        chart_
          .line()
          .position("age*height")
          .color("type")
          .label("height");
        chart_
          .point()
          .position("age*height")
          .color("type");
        chart_.render();
      }
    },
    drawTreeGrowthAverageSerialVolume() {
      let {
        options,
        chart,
        datas
      } = this.resultsInfo.treeGrowthAverageSerialVolume;
      if (!chart) {
        let chart_ = new Chart(options);
        this.$set(
          this.resultsInfo.treeGrowthAverageSerialVolume,
          "chart",
          chart_
        );
        chart_.data(datas);
        chart_.scale({
          age: {
            range: [0, 1],
            tickInterval: 1,
            alias: "树龄/a"
          },
          volume: {
            min: 0,
            nice: true,
            alias: "材积/m^3)"
          }
        });
        chart_.axis("age", { title: {} });
        chart_.axis("volume", { title: {} });
        chart_.tooltip({
          showCrosshairs: true,
          shared: true
        });
        chart_.legend({
          position: "top-right"
        });
        chart_
          .line()
          .position("age*volume")
          .color("type")
          .label("volume");
        chart_
          .point()
          .position("age*volume")
          .color("type");
        chart_.render();
      }
    },
    drawTreeModel2D() {
      let treeHeight = this.basicInfo.treeHeight,
        { options, chart, datas } = this.resultsInfo.treeModel2D;
      if (!chart) {
        let chart_ = new Chart(options);
        this.$set(this.resultsInfo.treeModel2D, "chart", chart_);
        chart_.data(datas);
        chart_.scale({
          diameter: {
            min: -treeHeight * 2.5,
            max: treeHeight * 2.5,
            alias: "胸径/cm"
          },
          height: {
            min: 0,
            max: Math.ceil(treeHeight).toFixed(2),
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
          .color("age")
          .shape("smooth");
        chart_
          .line()
          .position("diameter*height")
          .color("age")
          .shape("smooth");
        chart_.render();
      }
    },
    drawTreeModelDynamic2D() {
      let treeAge = this.basicInfo.treeAge,
        { chart, datas, dynamic } = this.resultsInfo.treeModel2D,
        interval = setInterval(() => {
          if (dynamic.switch) {
            dynamic.current += 1;
            if (dynamic.current > treeAge) dynamic.current = 1;
            chart.changeData(dynamic.datas[dynamic.current - 1]);
          } else {
            dynamic.current = 1;
            chart.changeData(datas);
            clearInterval(interval);
          }
        }, 500);
    },
    drawTreeModel3D() {
      if (!this.resultsInfo.treeModel3D.drawed) {
        let treeHeight = this.basicInfo.treeHeight,
          dom = document.getElementById("ChartTreeModel3D"),
          domWidth = dom.offsetWidth,
          domHeight = dom.offsetHeight,
          renderer = new Three.WebGLRenderer(),
          scene = new Three.Scene(),
          camera = new Three.PerspectiveCamera(
            45,
            domWidth / domHeight,
            1,
            10000
          ),
          datas = this.resultsInfo.treeModel3D.datas[11];
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
              color: "saddlebrown"
            }),
            object = new Three.Mesh(geometry, material);
          object.position.y = datas[i].height;
          objects.push(object);
          scene.add(object);
        }
        camera.position.z = treeHeight * 1.5;
        camera.position.y = treeHeight / 2;
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
      }
      this.resultsInfo.treeModel3D.drawed = true;
    },
    calcTreeVolume(data) {
      let pi = Math.PI,
        { diameterBegin, diameterEnd, length, method } = data,
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
      return data.volume;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  .steps {
    height: 32px;
    margin-bottom: 32px;
  }
  .contents {
    height: calc(100% - 32px - 32px - 32px - 32px);
    border: 1px dashed rgb(232, 232, 232);
    border-radius: 4px;
    .chart {
      .plot-growth {
        width: 100%;
        height: 400px;
      }
      .plot-model {
        width: 100%;
        height: 640px;
      }
      .title {
        text-align: center;
        font-size: 1.25em;
        font-weight: 800;
      }
    }
  }
  .actions {
    margin-top: 32px;
    height: 32px;
    .button {
      width: calc(50% - 16px);
      &:nth-child(1) {
        margin-right: 32px;
      }
    }
  }
}
</style>
