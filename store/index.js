export const state = () => ({
    userID: "",
    incomeData: {}
  })
  
  export const getters = {
    getUserID(state) {
      return state.userID
    },

    getIncomeData(state){
      return state.incomeData
    }
  }
  
  export const mutations = {
    changeUserID(state, payload) {
        state.userID = payload
    },

    storeIncomeData(state, payload){
      state.incomeData = payload
    }
  }
