
export default {
    /**
     * Get clients
     */
    clients: state => {
        return state.clients;
    },
    isClientActionPending: state =>
        state.clientOperationPending

}
