import { isNil } from 'lodash'

export default {
  isUserLoggedIn: state => !isNil(state.user),
  getCurrentUser: state => state.user
}
