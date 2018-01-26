/**
 * Created by 邹长亮 on 18-1-25.
 */
//导出常量
//分页规则中的每页记录数
export const PAGE_SIZE = 30;
export const isDebug = false;
var domain = isDebug ? "172.16.2.95" : "jiaoxue.maaee.com";
//成绩解析结果对应的url
export const RESULT_ANALYSIS_URL = "http://"+domain+":8091/#/resultAnalysis";
export const CLASS_RESULT_ANALYSIS_URL = "http://"+domain+":8091/#/classReaultAnalysis";
export const QUESTION_DETAIL_URL = "http://"+domain+":8091/#/questionDetil";

