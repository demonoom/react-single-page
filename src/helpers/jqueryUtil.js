var isDebug = true;
var localDomain = "192.168.50.34";
//云校本地测试webService地址
var elearningWebserviceURLOfLocal = "http://" + localDomain + ":8888/elearning/elearningControl/";
//云校的远程服务器地址
var elearningWebserviceURLOfRemote = "http://www.maaee.com/elearning/elearningControl/";
var elearningWebserviceURL = isDebug ? elearningWebserviceURLOfLocal : elearningWebserviceURLOfRemote;

//小蚂蚁webService地址
const apiWebServiceURLOfLocals = "http://" + localDomain + ":9006/Excoord_ApiServer/webservice";
//const apiWebServiceURLOfRemote = "https://www.maaee.com/Excoord_For_Education/webservice";
var apiWebServiceURL = isDebug ? apiWebServiceURLOfLocal : apiWebServiceURLOfRemote;
//小蚂蚁mobile地址
//const mobileURLOfLocal = "http://" + localDomain + ":8091/#/";
//const mobileURLOfRemote = "http://jiaoxue.maaee.com:8091/#/";
//var mobileServiceURL = isDebug ? mobileURLOfLocal : mobileURLOfRemote;


function JqueryUtil() {

};

JqueryUtil.requestLittleAntApi = function (data, listener) {
    $.ajax({
        type: "post",
        url: apiWebServiceURLOfLocals,
        data: {params: data},
        dataType: "json",
        success: function (result) {
            listener.onResponse(result);
        }, error: function (error) {
            listener.onError(result);
        }
    });
}

