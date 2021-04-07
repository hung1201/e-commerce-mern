export const navClick = (data) => dispatch => {
    dispatch({
        type:'NAV_CLICK',
        payload: data
    })
}