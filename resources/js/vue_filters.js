
import moment from 'moment';

/**
 * Globale Filters
 */

 Vue.filter('upText',function(text){
    return text.charAt(0).toUpperCase() + text.slice(1);
 });     
 
 Vue.filter('myDate',function(created){
     return moment(created).format('MMMM Do YYYY');
 });