
export const onClickReducer = (state = {}, action) => {
    switch (action.type) {
        case 'NAV_CLICK':
            return {
                isClick:true,
                clickData : action.payload
            }
        case 'RESET_DATA':
            return {
                clickData:action.payload,
                isClick:false
            }
        case 'RESET_ALL':
            return {
                isLogoClick:true,
            }
        case 'RESET_LOGO':
            return {
                isLogoClick:false
            }
        default:
            return state
    }
}