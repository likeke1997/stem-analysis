import colors from "color-name";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

export const COLORS = colors;

export const UTILS = {
  getFormatedTime(time) {
    return moment(time).format("YYYY/MM/DD HH:mm:ss");
  },
  getFilters(datas, fields = ["user", "username"], unique = true) {
    let values = [];
    datas.forEach((data) => {
      let value = fields.reduce((data, field) => data[field], data);
      if (unique && values.includes(value)) return;
      values.push(value);
    });
    values.forEach((value, index, arr) => {
      arr[index] = {
        text: value,
        value,
      };
    });
    return values;
  },
};

export const LAYOUT = {
  form: {
    "label-col": { span: 4 },
    "wrapper-col": { span: 20 },
  },
};

export const INFO = {
  app: {
    title: "解析木信息管理系统",
  },
  author: {
    title: "作者信息",
    name: "柯小龙",
    details: [
      { key: "姓名", value: "柯小龙" },
      { key: "学校", value: "南京林业大学" },
      { key: "学院", value: "林学院" },
      { key: "专业", value: "森林经理学" },
      { key: "邮箱", value: "ke.xiaolong@qq.com" },
    ],
  },
};

export const METHOD = {
  colors: {
    center: "blue",
    average: "green",
    cone: "red",
  },
  titles: {
    center: "中央",
    average: "平均",
    cone: "圆锥",
  },
};

export const COLUMNS = {
  // 用户
  usersAsAdmin: [
    {
      dataIndex: "username",
      title: "用户名",
      align: "center",
    },
    {
      dataIndex: "password",
      title: "密码",
      align: "center",
    },
    {
      dataIndex: "description",
      title: "描述",
      align: "center",
      ellipsis: true,
    },
    {
      dataIndex: "isEnabled",
      title: "状态",
      align: "center",
      scopedSlots: { customRender: "isEnabled" },
    },
    {
      dataIndex: "actions",
      title: "操作",
      align: "center",
      scopedSlots: { customRender: "actions" },
    },
  ],
  // 消息
  messagesAsAdmin: [
    {
      dataIndex: "_created",
      title: "时间",
      align: "center",
      customRender: (value) => {
        return UTILS.getFormatedTime(value);
      },
    },
    {
      dataIndex: "title",
      title: "标题",
      align: "center",
      ellipsis: true,
    },
    {
      dataIndex: "content",
      title: "内容",
      align: "center",
      ellipsis: true,
    },
    {
      dataIndex: "actions",
      title: "操作",
      align: "center",
      scopedSlots: { customRender: "actions" },
    },
  ],
  messages: [
    {
      dataIndex: "_created",
      title: "时间",
      align: "center",
      customRender: (value) => {
        return UTILS.getFormatedTime(value);
      },
    },
    {
      dataIndex: "title",
      title: "标题",
      align: "center",
      ellipsis: true,
    },
    {
      dataIndex: "content",
      title: "内容",
      align: "center",
      ellipsis: true,
    },
    {
      dataIndex: "hasRead",
      title: "状态",
      align: "center",
      scopedSlots: { customRender: "hasRead" },
    },
    {
      dataIndex: "actions",
      title: "操作",
      align: "center",
      scopedSlots: { customRender: "actions" },
    },
  ],
  // 日志
  logsAsAdmin: [
    {
      dataIndex: "_created",
      title: "时间",
      align: "center",
      customRender: (value) => {
        return UTILS.getFormatedTime(value);
      },
    },
    {
      dataIndex: "username",
      title: "用户",
      align: "center",
      customRender: (value, record) => {
        return record.user.username;
      },
      onFilter: (value, record) => {
        return record.user.username.indexOf(value) !== -1;
      },
    },
    {
      dataIndex: "path",
      title: "API",
      align: "center",
      onFilter: (value, record) => {
        return record.path.indexOf(value) !== -1;
      },
    },
    {
      dataIndex: "description",
      title: "描述",
      align: "center",
      ellipsis: true,
    },
    {
      dataIndex: "actions",
      title: "操作",
      align: "center",
      scopedSlots: { customRender: "actions" },
    },
  ],
  logs: [
    {
      dataIndex: "_created",
      title: "时间",
      align: "center",
      customRender: (value) => {
        return UTILS.getFormatedTime(value);
      },
    },
    {
      dataIndex: "path",
      title: "API",
      align: "center",
      onFilter: (value, record) => {
        return record.path.indexOf(value) !== -1;
      },
    },
    {
      dataIndex: "description",
      title: "描述",
      align: "center",
      ellipsis: true,
    },
    {
      dataIndex: "actions",
      title: "操作",
      align: "center",
      scopedSlots: { customRender: "actions" },
    },
  ],
  // 解析木
  treesAsAdmin: [
    {
      dataIndex: "username",
      title: "用户",
      align: "center",
      customRender: (value, record) => {
        return record.user.username;
      },
      onFilter: (value, record) => {
        return record.user.username.indexOf(value) !== -1;
      },
    },
    {
      dataIndex: "species",
      title: "树种",
      align: "center",
      customRender: (value, record) => {
        return record.treeInfo.species;
      },
      onFilter: (value, record) => {
        return record.treeInfo.species.indexOf(value) !== -1;
      },
    },
    {
      dataIndex: "age",
      title: "树龄/a",
      align: "center",
      customRender: (value, record) => {
        return record.treeInfo.age;
      },
    },
    {
      dataIndex: "height",
      title: "树高/m",
      align: "center",
      customRender: (value, record) => {
        return record.treeInfo.height;
      },
    },
    {
      dataIndex: "count",
      title: "圆盘数量",
      align: "center",
      customRender: (value, record) => {
        return record.discsInfo.count;
      },
    },
    {
      dataIndex: "gradation",
      title: "龄阶/a",
      align: "center",
      customRender: (value, record) => {
        return record.discsInfo.gradation;
      },
    },
    {
      dataIndex: "bark",
      title: "带皮",
      align: "center",
      scopedSlots: { customRender: "bark" },
    },
    {
      dataIndex: "color",
      title: "颜色",
      align: "center",
      scopedSlots: { customRender: "color" },
    },
    {
      dataIndex: "remarks",
      title: "备注",
      align: "center",
      ellipsis: true,
      customRender: (value, record) => {
        return record.extraInfo.remarks;
      },
    },
    {
      dataIndex: "_created",
      title: "添加时间",
      align: "center",
      customRender: (value) => {
        return moment(value).format("YYYY/MM/DD HH:mm");
      },
    },
    {
      dataIndex: "_updated",
      title: "编辑时间",
      align: "center",
      customRender: (value) => {
        return moment(value).format("YYYY/MM/DD HH:mm");
      },
    },
    {
      dataIndex: "actions",
      title: "操作",
      align: "center",
      scopedSlots: { customRender: "actions" },
    },
  ],
  trees: [
    {
      dataIndex: "species",
      title: "树种",
      align: "center",
      customRender: (value, record) => {
        return record.treeInfo.species;
      },
      onFilter: (value, record) => {
        return record.treeInfo.species.indexOf(value) !== -1;
      },
    },
    {
      dataIndex: "age",
      title: "树龄/a",
      align: "center",
      customRender: (value, record) => {
        return record.treeInfo.age;
      },
    },
    {
      dataIndex: "height",
      title: "树高/m",
      align: "center",
      customRender: (value, record) => {
        return record.treeInfo.height;
      },
    },
    {
      dataIndex: "count",
      title: "圆盘数量",
      align: "center",
      customRender: (value, record) => {
        return record.discsInfo.count;
      },
    },
    {
      dataIndex: "gradation",
      title: "龄阶/a",
      align: "center",
      customRender: (value, record) => {
        return record.discsInfo.gradation;
      },
    },
    {
      dataIndex: "bark",
      title: "带皮",
      align: "center",
      scopedSlots: { customRender: "bark" },
    },
    {
      dataIndex: "color",
      title: "颜色",
      align: "center",
      scopedSlots: { customRender: "color" },
    },
    {
      dataIndex: "remarks",
      title: "备注",
      align: "center",
      ellipsis: true,
      customRender: (value, record) => {
        return record.extraInfo.remarks;
      },
    },
    {
      dataIndex: "_created",
      title: "添加时间",
      align: "center",
      customRender: (value) => {
        return moment(value).format("YYYY/MM/DD HH:mm");
      },
    },
    {
      dataIndex: "_updated",
      title: "编辑时间",
      align: "center",
      customRender: (value) => {
        return moment(value).format("YYYY/MM/DD HH:mm");
      },
    },
    {
      dataIndex: "actions",
      title: "操作",
      align: "center",
      scopedSlots: { customRender: "actions" },
    },
  ],
  discs: [
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
      dataIndex: "ring",
      scopedSlots: { customRender: "ring" },
      title: "年轮数量",
      align: "center",
    },
    {
      title: "各龄阶直径/cm",
      children: [],
    },
  ],
  discsYear: [
    {
      dataIndex: "number",
      title: "圆盘编号",
      align: "center",
    },
    {
      dataIndex: "height",
      title: "圆盘高度/m",
      align: "center",
    },
    {
      dataIndex: "ring",
      title: "年轮数量",
      align: "center",
    },
    {
      dataIndex: "year",
      title: "生长至圆盘高度所需年数/a",
      align: "center",
    },
  ],
  agesHeight: [
    {
      dataIndex: "age",
      title: "年龄/a",
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
  volumesValue: [
    {
      dataIndex: "age",
      title: "年龄/a",
      align: "center",
    },
    {
      dataIndex: "section",
      scopedSlots: { customRender: "section" },
      title: "分段/m",
      align: "center",
    },
    {
      dataIndex: "diameter",
      scopedSlots: { customRender: "diameter" },
      title: "直径/cm",
      align: "center",
    },
    {
      dataIndex: "length",
      scopedSlots: { customRender: "length" },
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
  agesVolume: [
    {
      dataIndex: "age",
      title: "年龄/a",
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
  volumesRate: [
    {
      dataIndex: "age",
      title: "年龄/a",
      align: "center",
    },
    {
      dataIndex: "current",
      customRender: (value) => {
        return value.toFixed(8);
      },
      title: "当前龄阶材积/m^3",
      align: "center",
    },
    {
      dataIndex: "prev",
      customRender: (value) => {
        return value.toFixed(8);
      },
      title: "上一龄阶材积/m^3",
      align: "center",
    },
    {
      dataIndex: "gradation",
      title: "龄阶/a",
      align: "center",
    },
    {
      dataIndex: "rate",
      customRender: (value) => {
        return value.toFixed(2);
      },
      title: "材积生长率/%",
      align: "center",
    },
  ],
  factors: [
    {
      dataIndex: "age",
      title: "年龄/a",
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
      dataIndex: "area",
      customRender: (value) => {
        return value.toFixed(8);
      },
      title: "胸高断面积/m^2",
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
      dataIndex: "factor",
      customRender: (value) => {
        return value.toFixed(4);
      },
      title: "胸高形数",
      align: "center",
    },
  ],
  growths: [
    {
      dataIndex: "age",
      title: "年龄/a",
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

export const FILTERS = {
  treesAsAdmin: {
    "0": ["user", "username"],
    "1": ["treeInfo", "species"],
  },
  trees: {
    "0": ["treeInfo", "species"],
  },
  logsAsAdmin: {
    "1": ["user", "username"],
    "2": ["path"],
  },
  logs: {
    "1": ["path"],
  },
};

export const OPTIONS = {
  volumesModelCurve: {
    container: "volumesModelCurve",
    autoFit: true,
    height: 300,
    padding: [32, 32, 64, 64],
  },
  volumesRateCurve: {
    container: "volumesRateCurve",
    autoFit: true,
    height: 360,
    padding: [32, 32, 64, 64],
  },
  factorsCurve: {
    container: "factorsCurve",
    autoFit: true,
    height: 360,
    padding: [32, 32, 64, 64],
  },
  growthsTotalDiameterCurve: {
    container: "growthsTotalDiameterCurve",
    autoFit: true,
    height: 240,
    padding: [32, 32, 64, 64],
  },
  growthsTotalHeightCurve: {
    container: "growthsTotalHeightCurve",
    autoFit: true,
    height: 240,
    padding: [32, 32, 64, 64],
  },
  growthsTotalVolumeCurve: {
    container: "growthsTotalVolumeCurve",
    autoFit: true,
    height: 240,
    padding: [32, 32, 64, 64],
  },
  growthsAveSerDiameterCurve: {
    container: "growthsAveSerDiameterCurve",
    autoFit: true,
    height: 240,
    padding: [32, 32, 64, 64],
  },
  growthsAveSerHeightCurve: {
    container: "growthsAveSerHeightCurve",
    autoFit: true,
    height: 240,
    padding: [32, 32, 64, 64],
  },
  growthsAveSerVolumeCurve: {
    container: "growthsAveSerVolumeCurve",
    autoFit: true,
    height: 240,
    padding: [32, 32, 64, 64],
  },
  model2DCanvas: {
    container: "model2DCanvas",
    autoFit: true,
    height: 480,
    padding: [32, 32, 64, 64],
  },
  model3DCanvas: {
    container: "model3DCanvas",
  },
};
