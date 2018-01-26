// import fetch from 'dva/fetch';
// import {isDebug} from './Const';

var isDebug = true;
var localDomain = "172.16.2.95";
//云校本地测试webService地址
var elearningWebserviceURLOfLocal = "http://"+localDomain+":8888/elearning/elearningControl/";
//云校的远程服务器地址
var elearningWebserviceURLOfRemote = "http://www.maaee.com/elearning/elearningControl/";
var elearningWebserviceURL = isDebug?elearningWebserviceURLOfLocal:elearningWebserviceURLOfRemote;

//小蚂蚁webService地址
const apiWebServiceURLOfLocal = "http://"+localDomain+":9006/Excoord_ApiServer/webservice";
const apiWebServiceURLOfRemote = "https://www.maaee.com/Excoord_For_Education/webservice";
var apiWebServiceURL = isDebug?apiWebServiceURLOfLocal:apiWebServiceURLOfRemote;


function WebServiceUtil() {
};

WebServiceUtil.parseJSON = function (response) {
    return response.json();
}

WebServiceUtil.checkStatus = function (response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

WebServiceUtil.requestLittleAntApi = function(options){//定义静态方法
    console.log(' This is a static method ');
    return fetch(apiWebServiceURL, options)
        .then(WebServiceUtil.checkStatus)
        .then(WebServiceUtil.parseJSON)
        .then(data => ({data}))
        .catch(err => ({err}));
}

/**
 * 请求云校基础API
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
/*export function requestElearningApi(options) {
    return fetch(elearningWebserviceURL, options)
        .then(this.checkStatus)
        .then(this.parseJSON)
        .then(data => ({data}))
        .catch(err => ({err}));
}*/

/**
 * 请求小蚂蚁基础API
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
/*
export default function requestLittleAntApi(options) {
    return fetch(apiWebServiceURL, options)
        .then(checkStatus)
        .then(parseJSON)
        .then(data => ({data}))
        .catch(err => ({err}));
}*/
