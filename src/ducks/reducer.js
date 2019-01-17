const initialState = {
    name: '',
    username: '',
    email: '',
    profilePic: ''
}

// const declarations
const GET_USER_DATA = 'GET_USER_DATA'

// action builder functions
export function getUser(userInfo) {
    return {
        type: GET_USER_DATA,
        payload: userInfo
    }
}

// reducer
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER_DATA:
            const { username, profilePic, email, name } = action.payload
            return { ...state, username, profilePic, email, name }
        default: return state
    }
}