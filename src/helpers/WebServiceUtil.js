var isDebug = false;
var localDomain = "192.168.50.230";
//云校本地测试webService地址
var elearningWebserviceURLOfLocal = "http://" + localDomain + ":8888/elearning/elearningControl/";
//云校的远程服务器地址
var elearningWebserviceURLOfRemote = "http://www.maaee.com/elearning/elearningControl/";
var elearningWebserviceURL = isDebug ? elearningWebserviceURLOfLocal : elearningWebserviceURLOfRemote;

//小蚂蚁webService地址
const apiWebServiceURLOfLocal = "http://" + localDomain + ":9006/Excoord_ApiServer/webservice";
const apiWebServiceURLOfRemote = "https://www.maaee.com/Excoord_For_Education/webservice";
var apiWebServiceURL = isDebug ? apiWebServiceURLOfLocal : apiWebServiceURLOfRemote;
//小蚂蚁mobile地址
const mobileURLOfLocal = "http://" + localDomain + ":8091/#/";
const mobileURLOfRemote = "http://jiaoxue.maaee.com:8091/#/";
var mobileServiceURL = isDebug ? mobileURLOfLocal : mobileURLOfRemote;

function WebServiceUtil() {

};

WebServiceUtil.parseJSON = function (response) {
    return response.json();
};

WebServiceUtil.checkStatus = function (response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
};

WebServiceUtil.creatObj = function (response) {
    var data = {
        data: response
    }
    return data
};

WebServiceUtil.error = function (response) {
    var err = {
        err: response
    }
    return err
};

/**
 * 网络请求
 * @param options
 * @returns {Promise|Function|any|Promise.<T>|*}
 */
WebServiceUtil.requestLittleAntApi = function (options) {
    return fetch(apiWebServiceURL, options)
        .then(WebServiceUtil.checkStatus)
        .then(WebServiceUtil.parseJSON)
        .then(WebServiceUtil.creatObj)
        .catch(WebServiceUtil.error)
};

/**
 * 系统非空判断
 * @param content
 * @returns {boolean}
 */
WebServiceUtil.isEmpty = function (content) {
    if (content == null || content == "null" || content == "" || typeof(content) == "undefined") {
        return true;
    } else {
        return false;
    }
};

/**
 * 时间戳转年月日
 * @param nS
 * @returns {string}
 */
WebServiceUtil.formatYMD = function (nS) {
    var da = new Date(parseInt(nS));
    var year = da.getFullYear();
    var month = da.getMonth() + 1;
    var date = da.getDate();
    var ymdStr = [year, month, date].join('-');
    return ymdStr;
};

/**
 * 时间戳转时分
 * @param nS
 * @returns {string}
 */
WebServiceUtil.formatHM = function (nS) {
    var da = new Date(parseInt(nS));
    var hour = da.getHours() + ":";
    var minutes = da.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    var hmStr = hour + minutes;
    return hmStr;
};

