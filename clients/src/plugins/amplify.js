import Amplify from 'aws-amplify'
import { Auth, API, Storage } from '../../config'

Amplify.configure({ Auth, API, Storage })
export default Amplify
