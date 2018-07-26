package com.eshore.upload.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.jcabi.ssh.SSHByPassword;
import com.jcabi.ssh.Shell;

@Component
public class FileUploadUtil {
    @Value("${remote.host}")
    private String remoteHost;

    @Value("${remote.port}")
    private String remotePort;

    @Value("${remote.user}")
    private String remoteUser;

    @Value("${remote.password}")
    private String remotePassword;

    @Value("${remote.dir}")
    private String remoteDir;

    @Value("${nginx.port}")
    private String nginxPort;

    @Value("${nginx.fileuri}")
    private String nginxFileUri;

    public String getUrlFromRequest(HttpServletRequest request,String filename) throws NullPointerException{
        StringBuilder builder = new StringBuilder("http://");
        builder.append(remoteHost);
        builder.append(":");
        builder.append(nginxPort);
        builder.append(nginxFileUri);
        builder.append("/");
        builder.append(filename);
        return builder.toString();
    }

    public String renameFile(HttpServletRequest request) throws IOException,NullPointerException{
		Shell shell = new SSHByPassword(remoteHost, Integer.valueOf(remotePort), remoteUser, remotePassword);

		Shell.Plain plain = new Shell.Plain(shell);

		String orgFile = request.getParameter("file_name");

		if (orgFile == null) {
			throw new NullPointerException("文件名不存在");
		}
		orgFile.replaceAll(" ", "");
		String hostFile = request.getParameter("file_path");
		if (hostFile == null) {
			throw new NullPointerException("文件路径不存在");
		}

		String timestamp = new SimpleDateFormat("YYYY-MM-dd-HH-mm-ss").format(new Date()).toString();
		String filename = new StringBuilder(timestamp).append("-").append(orgFile).toString().replaceAll(" ", "").replaceAll("/", "");

		String hostFilePath = remoteDir.concat(hostFile.substring(hostFile.lastIndexOf("/") + 1));
		String orgFilePath = remoteDir.concat(filename);

		String renameCmd = new StringBuilder("mv ").append("\'").append(hostFilePath).append("\'").append(" ")
				.append("\'").append(orgFilePath).append("\'").toString();

		String result = plain.exec(renameCmd);

		if (!result.isEmpty()) {
			throw new NullPointerException("命令运行失败，请检查文件名是否有特殊符号,如()");
		}

		return filename;
    }
}
