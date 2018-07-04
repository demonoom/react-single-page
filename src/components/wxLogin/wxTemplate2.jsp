    <%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
        <%@ page import="com.excoord.elearning.common.OkHttpUtil"%>
        <%@ page import="com.alibaba.fastjson.JSONObject"%>
            <%
	String appid="wx181574f3ea687daf";
	//String appid="wx9d076742b77044dd";
	String secret="3016ab786f909b048a40edf5709652f5";
	//String secret="1381cd42ea0584ec81ab44c9b41593ec";
	String code=request.getParameter("code");
	System.out.println("code:"+code);
	String state=request.getParameter("state");
	System.out.println("state:"+state);
	String userinfourl="https://api.weixin.qq.com/sns/oauth2/access_token?secret="+secret+"&appid="+appid+"&code="+code+"&grant_type=authorization_code";
	String strWeixin=OkHttpUtil.getInstance().getSync(userinfourl);
	System.out.println("1:"+strWeixin);
	JSONObject jsonObject=JSONObject.parseObject(strWeixin);
	String openid="";
	if(jsonObject!=null){
		String accessToken=jsonObject.getString("access_token");
		openid=jsonObject.getString("openid");
		String userinfourls="https://api.weixin.qq.com/sns/userinfo?access_token="+accessToken+"&openid="+openid;
		System.out.println("2:"+userinfourls);
		String strWeixin1=OkHttpUtil.getInstance().getSync(userinfourls);
		System.out.println(strWeixin1);
		JSONObject jsonObject1=JSONObject.parseObject(strWeixin1);
		if(jsonObject1!=null){
			String unionid=jsonObject.getString("unionid");
			String redirectUrl=state+"?unionid="+unionid;
	    	response.sendRedirect(redirectUrl);
		}
    }


%>

        <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
        <html>
        <head>

        <title>获取微信用户openId</title>

        <meta http-equiv="pragma" content="no-cache">
        <meta http-equiv="cache-control" content="no-cache">
        <meta name="viewport" content="maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,width=device-width,initial-scale=1.0"/>

        <!--
        <link rel="stylesheet" type="text/css" href="styles.css">
        -->
        <link rel="stylesheet" type="text/css" href="css/weixin/aui.css" />
        <script type="text/javascript" src="js/jquery.js?v=3"></script>

        </head>
        <script>
        var url = window.location.href;
        console.log(url);
        </script>
        <body>
        </body>
        </html>
