export default {
  // 登录
  login(state, payload) {
    state.user = payload;
  },
  logout(state) {
    state.user = {};
  },
};
