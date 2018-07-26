<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
<head>
    <title></title>
</head>
<%@ include file="/common/common.jsp"%>
<script src="${basePath}/resources/others/jquery/jquery-1.8.3.min.js"></script>
<script>
    $(function(){
        var systemId = $("#systemId").text();
        var parentResultId = "result_" + systemId;
        var parentMsgId = "msg_" + systemId;
        $(parent.document).find('p#'+parentResultId).text($('p#result').text());
        $(parent.document).find('p#'+parentMsgId).text($('p#msg').text());
    });
</script>
<body>
<p id="result">${result}</p>
<p id="msg">${msg}</p>
<p id="systemId">${systemId}</p>
</body>
</html>
