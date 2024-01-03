export default {
  state: {
    arrayDisabled: [],
  },
  mutations: {
    setArrayDisable(state, index, is_disable) {
      state.arrayDisabled[index] = is_disable;
    },
  },
};
