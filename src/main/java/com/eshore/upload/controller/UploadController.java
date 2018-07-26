package com.eshore.upload.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import com.eshore.upload.util.FileUploadUtil;

@Controller
public class UploadController {
	
	@Autowired
    private FileUploadUtil fileUploadUtil;
	
	@RequestMapping("/hello")
	public String hello() {
		return "hello";
	}
	
	@RequestMapping("/systemIcon")
    public RedirectView uploadSystemIcon(HttpServletRequest request,
                                         HttpServletResponse response, RedirectAttributes ra) {
        String url = null; //这个URL是最终跳转返回的URL,本实例中，为/upload/result
        String newUrl = request.getParameter("org");
        try {

            //重命名文件名称
            String filename = fileUploadUtil.renameFile(request);
            //获取返回的URL
            url = fileUploadUtil.getUrlFromRequest(request, filename);
            /**
             * 如果需要保存图片信息，这里可以将url存入到数据库
             */
        } catch (NullPointerException | IOException e) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            ra.addAttribute("result", "fail");
            ra.addAttribute("msg", "exception happened");
            return new RedirectView(newUrl);
        }

        ra.addAttribute("result", "success");
        ra.addAttribute("msg", url);
        
        return new RedirectView(newUrl);
    }

    @RequestMapping("/result")
    public ModelAndView result(HttpServletRequest request) throws IOException {
        ModelAndView view = new ModelAndView("upload/result");
        return view;
    }
    
    @RequestMapping("/file")
    public ModelAndView file(HttpServletRequest request) throws IOException {
        ModelAndView view = new ModelAndView("upload/upload");
        return view;
    }

}
