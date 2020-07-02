
export default {
    /**
     * Get users
     */
    users: state => {
        return state.users;
    },
    isUserActionPending: state =>
        state.userOperationPending

}
