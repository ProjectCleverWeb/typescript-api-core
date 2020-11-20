import 'source-map-support/register'

// Bootstrap the environment and api core
import { application } from './core/bootstrap'

// "and the monkey flips the switch" (Launch!)
// noinspection JSUnusedGlobalSymbols
export default application.api
