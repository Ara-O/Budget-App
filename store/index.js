export const state = () => ({
    userID: ""
  })
  
  export const getters  2 = {
    getUserID(state) {
      return state.userID
    }
  }
  
  export const mutations = {
    changeUserID(state, payload) {
        state.userID = payload
    }
  }
  
 