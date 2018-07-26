<!DOCTYPE HTML>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
<head>
    <%@ include file="/common/common.jsp" %>
    <link rel="stylesheet" type="text/css" href="${basePath}/resources/upload/iframeUpload.css"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
<div id="uploadFile" class="upload">

</div>
<a href="javascript:void(0);" id="submit">提交</a>
<div class="pic-upload fl">
    <div id="imgPreview">
        <img class="picIcon" id="picIcon" src="${basePath}/resources/theme/images/user_default.jpg">
    </div>
    <input type="hidden" id="iconUrl" value="${basePath}/resources/theme/images/user_default.jpg">
</div>
<script src="${basePath}/resources/others/jquery/jquery-1.8.3.min.js"></script>
<script src="${basePath}/resources/upload/iframeUpload.js"></script>
<script language="javaScript">
    $(function () {
        var localPath = 'http://'+document.domain + ":" +
                window.location.port + basePath+"/result";
        var submitForm = IframeUpload.create({
            id: "1",
            url: ICON_SERVER_ADDRESSS + "/upload",
            progressUrl: ICON_SERVER_ADDRESSS + "/progress",
            interval:300,
            containerId: 'uploadFile',
            resultPath:localPath,
            success: function (res) {
            	if (res.result == 'success') {
                    $("#iconUrl").val(res.msg);
                    $(".picIcon").attr('src', res.msg);
                } else {
                	alert("上传失败！！！");
                }
            },
        });

        $('a#submit').click(function(){
            submitForm.submit();
        });
    });
 </script>
    
 <script language="javaScript">
 		//预览图片
//     $(function(){
//         $('input[name=files]').change(function () {
//             var fileImg = $("img#picIcon");
//             var explorer = navigator.userAgent;
//             var imgSrc = $(this)[0].value;
//             if (explorer.indexOf('MSIE') >= 0) {
//                 var browser = getBrowserInfo();
//                 var verinfo = (browser + "").replace(/[^0-9.]/ig, "");

//                 if (verinfo == "8.0" || verinfo == "9.0") {
//                     //得到真实的图片路径
//                     var realPath = $(this).val();

//                     if(realPath.indexOf('fakepath') >= 0){
//                         $(this).get(0).select();
//                         $(this).get(0).blur();
//                         realPath = document.selection.createRange().text;
//                     }

//                     var imgItem = document.getElementById('imgPreview');
//                     fileImg.hide();
//                     imgItem.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)'
//                     imgItem.filters.item(
//                         'DXImageTransform.Microsoft.AlphaImageLoader').src = realPath;
//                     imgItem.style.width = '100px';
//                     imgItem.style.height = '100px';
//                 }
//                 else {
//                 	fileImg.attr('src', getObjectURL(this.files[0]));
//                 }
//             } else {
//                 $("img#picIcon").attr('src', getObjectURL(this.files[0]))
//             }
//         });
        
//         /**
//          * 获取预览图片路径
//          * 返回值 url
//          */
//         function getObjectURL(file) {
//             if (file == undefined) {
//                 editIconFlag = false;
//                 return;
//             }
//             var url = null;
//             if (window.createObjectURL != undefined) {
//                 url = window.createObjectURL(file)
//             } else if (window.URL != undefined) {
//                 url = window.URL.createObjectURL(file)
//             } else if (window.webkitURL != undefined) {
//                 url = window.webkitURL.createObjectURL(file)
//             }
//             return url
//         };
//     });
</script>
</body>

</html>

