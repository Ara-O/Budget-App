export const state = () => ({
    userID: ""
  })
  
  export const getter = {
    getUserID(state) {
      return state.userID
    }
  }
  
  export const mutations = {
    changeUserID(state, payload) {
        state.userID = payload
    }
  }
  
 