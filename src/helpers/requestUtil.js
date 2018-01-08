import fetch from 'dva/fetch';


var isDebug = false;
var domain = isDebug ? "192.168.1.140" : "www.maaee.com";
//云校webService地址
var elearningWebserviceURL = "http://" + domain + ":8888/elearning/elearningControl/";
//小蚂蚁webService地址
// var apiWebServiceURL = "http://"+domain+":9006/Excoord_ApiServer/webservice";
var apiWebServiceURL = "http://www.maaee.com/Excoord_For_Education/webservice";

class requestUtil{

    constructor() {

    }

    parseJSON(response) {
        return response.json();
    }

    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }

        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }

    /**
     * 请求云校基础API
     *
     * @param  {string} url       The URL we want to request
     * @param  {object} [options] The options we want to pass to "fetch"
     * @return {object}           An object containing either "data" or "err"
     */
    requestElearning(options) {
        return fetch(elearningWebserviceURL, options)
            .then(this.checkStatus)
            .then(this.parseJSON)
            .then(data => ({data}))
            .catch(err => ({err}));
    }

    /**
     * 请求小蚂蚁基础API
     *
     * @param  {string} url       The URL we want to request
     * @param  {object} [options] The options we want to pass to "fetch"
     * @return {object}           An object containing either "data" or "err"
     */
    requestLittleAntApi(options) {
        return fetch(apiWebServiceURL, options)
            .then(this.checkStatus)
            .then(this.parseJSON)
            .then(data => ({data}))
            .catch(err => ({err}));
    }
}

export default new requestUtil();
