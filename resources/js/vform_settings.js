
/**
 * Import VForm Pckg
 */
import { Form, HasError, AlertError } from 'vform'
  
/**
 * Register Vindow form as gloablly
 * tha can be accessed from components
 */  
window.Form = Form;

/** 
 * Register globel Component
 * accessable in evry place of application
 */
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)



