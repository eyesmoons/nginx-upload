/**
 * Created by wangqian on 2017/10/30.
 */

/*
 * 使用隐藏的iframe发送表单提交
 * options参数说明：
 id:唯一标识id
 url: api接口地址
 progressUrl: 获取进度的Url
 progress:获取进度结果的函数
 interval:获取进度的时间间隔（非必须，默认300毫秒）
 resultPath: 用于返回结果的与本站域名相同的URL
 containerId: 放置上传组件的容器
 success:  表单提交成功后的回调函数，参数为返回的data数据
 uploadBtnName:上传按钮自定义名称
 */

(function () {
    if (document.all && !window.setTimeout.isPolyfill) {
        var __nativeST__ = window.setTimeout;
        window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
            var aArgs = Array.prototype.slice.call(arguments, 2);
            return __nativeST__(vCallback instanceof Function ? function () {
                vCallback.apply(null, aArgs);
            } : vCallback, nDelay);
        };
        window.setTimeout.isPolyfill = true;
    }

    if (document.all && !window.setInterval.isPolyfill) {
        var __nativeSI__ = window.setInterval;
        window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
            var aArgs = Array.prototype.slice.call(arguments, 2);
            return __nativeSI__(vCallback instanceof Function ? function () {
                vCallback.apply(null, aArgs);
            } : vCallback, nDelay);
        };
        window.setInterval.isPolyfill = true;
    }
})();

!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
    WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
        var target = this;

        registry.unshift([target, type, listener, function (event) {
            event.currentTarget = target;
            event.preventDefault = function () {
                event.returnValue = false
            };
            event.stopPropagation = function () {
                event.cancelBubble = true
            };
            event.target = event.srcElement || target;

            listener.call(target, event);
        }]);

        this.attachEvent("on" + type, registry[0][3]);
    };

    WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
        for (var index = 0, register; register = registry[index]; ++index) {
            if (register[0] == this && register[1] == type && register[2] == listener) {
                return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
            }
        }
    };

    WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
        return this.fireEvent("on" + eventObject.type, eventObject);
    };
})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);

var IframeUpload = function (options) {
    this.options = options;
    this.id = options.id;
    this.url = options.url;
    this.type = 'POST';
    this.contentType = 'multipart/form-data';
    this.success = options.success;
    this.progress = options.progress;
    this.progressUrl = options.progressUrl;
    this.interval = options.interval === 'undefined' ? 300 : options.interval;

    this.formId = 'form_' + options.id;
    this.iframeId = 'iframe_' + options.id;
    this.containerId = options.containerId;
    this.resultPath = options.resultPath;
    this.startCount = 0;
    this.uploadBtnName = options.uploadBtnName;
};

IframeUpload.prototype = {
    init: function () {
        var self = this;
        // 创建并插入隐藏的根据id定义的iframe和form
        var iframe = $('<iframe id="' + self.iframeId + '" name="' + self.iframeId + '" style="display:none"></iframe>');
        var container = $('#' + self.containerId);

        var form, input;
        if (self.isIE8()) {
            form = $('<form></form>');
            input = $('<input type = "file" name="files" style="position:absolute;left:0;top:0;width:100%;height:30px;z-index:999;opacity:0;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0);""/>');
        }
        else {
            form = $('<form style="display: none;"></form>');
            input = $('<input type = "file" name="files" style="display:none"/>');
        }

        var chooseFileBth = undefined;
        if (!!!self.uploadBtnName) {
            if (!self.isIE8) {
                chooseFileBth = $('<a name="chooseFile" class="chooseFile chooseFile-blue" >选择文件</a>')
            }
            else {
                chooseFileBth = $('<a name="chooseFile" class="chooseFile-IE8 chooseFile-blue">浏览</a>')
            }
        } else {
            if (!self.isIE8()) {
                chooseFileBth = $('<a name="chooseFile" class="chooseFile chooseFile-blue" >' + self.uploadBtnName + '</a>')
            }
            else {
                chooseFileBth = $('<a name="chooseFile" class="chooseFile-IE8 chooseFile-blue" >浏览</a>')
            }
        }
        var hiddenUrlInput = $('<input type="hidden" name="org"/>');
        hiddenUrlInput.val(self.resultPath);

        form.attr({
            target: self.iframeId,
            enctype: self.contentType,
            id: self.formId,
            method: self.type,
            name: "upload"
        });

        iframe.insertAfter(container);
        if (!self.isIE8()) {
            container.append(chooseFileBth);
        }
        container.append(form);
        form.append(input);

        if (self.isIE8()) {
            form.append(chooseFileBth);
        }

        form.append(hiddenUrlInput);
        //form.append(hiddenProgress);
    },

    getUrlValue: function (s) {
        if (s.search(/#/) > 0) {
            s = s.slice(0, s.search(/#/));
        }
        var r = {};
        if (s.search(/\?/) < 0) {
            return r;
        }
        var p = s.slice(s.search(/\?/) + 1).split('&');
        for (var i = 0, j = p.length; i < j; i++) {
            var tmp = p[i].split('=');
            r[tmp[0]] = decodeURIComponent(tmp[1]);
        }
        return r;
    },

    updateUuid: function () {
        //生成监控进度的随机UUID
        var uuid = "";
        for (var i = 0; i < 32; i++) {
            uuid += Math.floor(Math.random() * 16).toString(16);
        }
        this.uuid = uuid;
    },

    bindSubmit: function () {
        var self = this;
        var iframe = document.getElementById(self.iframeId);
        iframe.addEventListener('load', function () {
            //iframe加载完成后你需要进行的操作
            var myFrame = this;

            if (self.isIE8()) {
                var domain = self.extractDomain(self.url);
                //document.domain = domain;
            }

            var result = self.getUrlValue(myFrame.contentWindow.document.URL);
            self.success(result);
        });
    },
    bindChooseFileBtn: function () {
        var self = this;
        if (!self.isIE8()) {
            $("#" + self.containerId).find("a[name='chooseFile']").unbind("click").bind("click", function () {
                $("#" + self.containerId).find("input[name='files']").trigger("click");
            })
        }
    },
    update: function () {
        var self = arguments[0];
        $.ajax({
            url: self.progressUrl + '?X-Progress-ID=' + self.uuid,
            type: 'GET',
            dataType: 'jsonp',
            success: function (data) {
                if (data.state === 'starting') {
                    self.startCount++;
                }

                if (data.state === 'uploading' && data.received === data.size) {
                    data.state = 'done';
                }

                if (data.state === 'done' || self.startCount > 3 || data.state === 'error') { //上传结束或有错误
                    clearInterval(self.timeHandler);
                    self.startCount = 0;
                }
            },
            error: function () {
                clearInterval(self.timeHandler);
                self.startCount = 0
            }
        });
    },
    submit: function () {
        var self = this;
        var form = $('#' + self.formId);
        self.bindSubmit();
        self.updateUuid();
        form.attr({
            action: self.url + '?X-Progress-ID=' + self.uuid
        });
        form.submit();

        if (self.progressUrl) {
            self.startCount = 0;
            self.timeHandler = window.setInterval(self.update, self.interval, self);
        }
    },

    getBrowserInfo: function () {
        var agent = navigator.userAgent.toLowerCase();

        var regStr_ie = /msie [\d.]+;/gi;
        var regStr_ff = /firefox\/[\d.]+/gi
        var regStr_chrome = /chrome\/[\d.]+/gi;
        var regStr_saf = /safari\/[\d.]+/gi;
        //IE
        if (agent.indexOf("msie") > 0) {
            return agent.match(regStr_ie);
        }

        //firefox
        if (agent.indexOf("firefox") > 0) {
            return agent.match(regStr_ff);
        }

        //Chrome
        if (agent.indexOf("chrome") > 0) {
            return agent.match(regStr_chrome);
        }

        //Safari
        if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
            return agent.match(regStr_saf);
        }
    },

    extractDomain: function (url) {
        var domain;
        //find & remove protocol (http, ftp, etc.) and get domain
        if (url.indexOf("://") > -1) {
            domain = url.split('/')[2];
        }
        else {
            domain = url.split('/')[0];
        }

        //find & remove port number
        domain = domain.split(':')[0];

        return domain;
    },

    isIE8: function () {
        var explorer = navigator.userAgent;
        var self = this;
        if (explorer.indexOf('MSIE') >= 0) {
            var browser = self.getBrowserInfo();
            var verinfo = (browser + "").replace(/[^0-9.]/ig, "");

            if (verinfo == "8.0" || verinfo == "9.0") {
                return true;
            }

            return false;
        }
    },

    render: function () {
        this.init();
        this.bindChooseFileBtn();
    }
};

IframeUpload.create = function (options) {
    var formSubmit = new IframeUpload(options);
    formSubmit.render();
    return formSubmit;
};
