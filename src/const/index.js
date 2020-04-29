// infos
export const SYSTEM_INFO = [
  {
    title: "系统说明",
    value:
      "该系统为即开即用的在线树干解析系统，支持自动化地计算树木胸径、树高、材积生长量，以及绘制生长量图表、树干纵断面图和3D模型图等。",
  },
  {
    title: "操作步骤",
    value:
      "按照页面中所示步骤，依次输入(1)树龄、树高、圆盘数量(2)各圆盘信息(3)需要解析的类别，即可查看(4)解析结果。",
  },
];

export const AUTHOR_INFO = [
  { title: "姓名", value: "柯小龙" },
  { title: "学校", value: "南京林业大学" },
  { title: "学院", value: "林学院" },
  { title: "专业", value: "森林经理学" },
  { title: "邮箱", value: "ke.xiaolong@qq.com" },
];

//
export const FORM_LAYOUT = {
  "label-col": { span: 2 },
  "wrapper-col": { span: 22 },
};

export const STEPS_ITEMS = [
  "填写树龄、树高、圆盘数量",
  "填写各圆盘信息",
  "选择解析类别",
  "输出解析结果",
];

export const METHODS_ITEMS = {
  cone: "圆锥",
  average: "平均",
  center: "中央",
};

export const TABLES_COLUMNS = {
  DISCS: [
    {
      dataIndex: "number",
      title: "编号",
      align: "center",
    },
    {
      dataIndex: "height",
      scopedSlots: { customRender: "height" },
      title: "高度/m",
      align: "center",
    },
    {
      dataIndex: "ringCount",
      scopedSlots: { customRender: "ringCount" },
      title: "年轮数",
      align: "center",
    },
    {
      title: "各龄阶直径/cm",
      children: [],
    },
  ],
  DISCS_YEAR: [
    {
      dataIndex: "number",
      title: "编号",
      align: "center",
    },
    {
      dataIndex: "height",
      customRender: (value) => {
        return value.toFixed(2);
      },
      title: "高度/m",
      align: "center",
    },
    {
      dataIndex: "year",
      customRender: (value) => {
        return value.toFixed(1);
      },
      title: "生长所需年数/a",
      align: "center",
    },
  ],
  TREE_AGES_HEIGHT: [
    {
      dataIndex: "age",
      title: "树龄/a",
      align: "center",
    },
    {
      dataIndex: "height",
      customRender: (value) => {
        return value.toFixed(2);
      },
      title: "树高/m",
      align: "center",
    },
  ],
  TREE_AGES_VOLUME: [
    {
      dataIndex: "age",
      title: "树龄/a",
      align: "center",
    },
    {
      dataIndex: "section",
      title: "分段/m",
      align: "center",
    },
    {
      dataIndex: "diameterBegin",
      customRender: (value) => {
        return value.toFixed(2);
      },
      title: "大头直径/cm",
      align: "center",
    },
    {
      dataIndex: "diameterEnd",
      customRender: (value) => {
        return value.toFixed(2);
      },
      title: "小头直径/cm",
      align: "center",
    },
    {
      dataIndex: "length",
      customRender: (value) => {
        return value.toFixed(2);
      },
      title: "长度/m",
      align: "center",
    },
    {
      dataIndex: "volume",
      customRender: (value) => {
        return value.toFixed(8);
      },
      title: "材积/m^3",
      align: "center",
    },
    {
      dataIndex: "method",
      scopedSlots: { customRender: "method" },
      title: "求积方式",
      align: "center",
    },
  ],
  TREE_GROWTH: [
    {
      dataIndex: "age",
      title: "树龄/a",
      align: "center",
    },
    {
      dataIndex: "diameter",
      customRender: (value) => {
        return value.toFixed(2);
      },
      title: "胸径/cm",
      align: "center",
    },
    {
      dataIndex: "height",
      customRender: (value) => {
        return value.toFixed(2);
      },
      title: "树高/m",
      align: "center",
    },
    {
      dataIndex: "volume",
      customRender: (value) => {
        return value.toFixed(8);
      },
      title: "材积/m^3",
      align: "center",
    },
  ],
};

// mocks
export const MOCK_DISCS_DATA = [
  {
    number: 1,
    height: 0,
    ringCount: 12,
    diameter_12: 17.3,
    diameter_11: 16.4,
    diameter_10: 15.3,
    diameter_9: 14.0,
    diameter_8: 12.6,
    diameter_7: 10.9,
    diameter_6: 9.2,
    diameter_5: 7.1,
    diameter_4: 5.3,
    diameter_3: 3.4,
    diameter_2: 1.8,
    diameter_1: 0.6,
  },
  {
    number: 2,
    height: 1.3,
    ringCount: 10,
    diameter_12: 12.9,
    diameter_11: 12.2,
    diameter_10: 11.4,
    diameter_9: 10.4,
    diameter_8: 9.4,
    diameter_7: 8.3,
    diameter_6: 7.0,
    diameter_5: 5.6,
    diameter_4: 3.6,
    diameter_3: 1.4,
  },
  {
    number: 3,
    height: 2.6,
    ringCount: 9,
    diameter_12: 11.8,
    diameter_11: 11.1,
    diameter_10: 10.4,
    diameter_9: 9.4,
    diameter_8: 8.6,
    diameter_7: 7.3,
    diameter_6: 6.1,
    diameter_5: 4.3,
    diameter_4: 1.7,
  },
  {
    number: 4,
    height: 4.6,
    ringCount: 8,
    diameter_12: 9.8,
    diameter_11: 9.0,
    diameter_10: 8.3,
    diameter_9: 7.3,
    diameter_8: 6.5,
    diameter_7: 5.0,
    diameter_6: 3.4,
    diameter_5: 1.4,
  },
  {
    number: 5,
    height: 6.6,
    ringCount: 7,
    diameter_12: 8.1,
    diameter_11: 7.2,
    diameter_10: 6.5,
    diameter_9: 5.1,
    diameter_8: 3.9,
    diameter_7: 2.6,
    diameter_6: 1.0,
  },
  {
    number: 6,
    height: 8.6,
    ringCount: 5,
    diameter_12: 6.0,
    diameter_11: 5.0,
    diameter_10: 4.1,
    diameter_9: 2.6,
    diameter_8: 1.5,
  },
  {
    number: 7,
    height: 10.6,
    ringCount: 3,
    diameter_12: 1.8,
    diameter_11: 1.3,
    diameter_10: 0.8,
  },
];

// charts
export const CHARTS_OPTIONS = {
  TREE_GROWTH_TOTAL_DIAMETER: {
    container: "ChartTreeGrowthTotalDiameter",
    autoFit: true,
    height: 400,
    padding: [32, 32, 64, 64],
  },
  TREE_GROWTH_TOTAL_HEIGHT: {
    container: "ChartTreeGrowthTotalHeight",
    autoFit: true,
    height: 400,
    padding: [32, 32, 64, 64],
  },
  TREE_GROWTH_TOTAL_VOLUME: {
    container: "ChartTreeGrowthTotalVolume",
    autoFit: true,
    height: 400,
    padding: [32, 32, 64, 64],
  },
  TREE_GROWTH_AVERAGE_SERIAL_DIAMETER: {
    container: "ChartTreeGrowthAverageSerialDiameter",
    autoFit: true,
    height: 400,
    padding: [32, 32, 64, 64],
  },
  TREE_GROWTH_AVERAGE_SERIAL_HEIGHT: {
    container: "ChartTreeGrowthAverageSerialHeight",
    autoFit: true,
    height: 400,
    padding: [32, 32, 64, 64],
  },
  TREE_GROWTH_AVERAGE_SERIAL_VOLUME: {
    container: "ChartTreeGrowthAverageSerialVolume",
    autoFit: true,
    height: 400,
    padding: [32, 32, 64, 64],
  },
  TREE_MODEL_2D: {
    container: "ChartTreeModel2D",
    autoFit: true,
    height: 640,
    padding: [32, 32, 64, 64],
  },
};
