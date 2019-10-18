
<%@ tag import="org.soul.commons.data.json.JsonTool" %>
<%@ tag import="org.soul.commons.lang.string.I18nTool" %>
<%@ tag import="org.soul.model.sys.po.SysDict" %>
<%@ tag import="so.wwb.lotterybox.web.tools.SessionManagerCommon" %>
<%@ tag import="so.wwb.lotterybox.web.cache.Cache" %>
<%@ tag import="so.wwb.lotterybox.model.manager.lottery.po.Lottery" %>
<%@ tag import="java.util.*" %>
<%@ tag import="org.soul.commons.collections.CollectionTool" %>
<%@ tag import="org.soul.commons.collections.MapTool" %>
<%@ tag import="sun.rmi.runtime.Log" %>
<%@ tag import="so.wwb.lotterybox.model.common.TopMenuJson" %>


<%@ tag language="java" pageEncoding="UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@taglib uri="http://shiro.apache.org/tags" prefix="shiro"%>
<jsp:doBody var="bodyRes" />

<%@attribute name="name" type="java.lang.String" required="true" description="名字"%>
<%@attribute name="title" type="java.lang.String" required="false" description="title"%>
<%@attribute name="url" type="java.lang.String" required="false" description="路径;default:取默认路径" %>
<%@attribute name="param" type="java.lang.String" required="true" description="id或者username" %>
<%@attribute name="permission" type="java.lang.String" required="false" description="权限名称" %>
<%@attribute name="isManage" type="java.lang.Boolean" required="false" description="是否管理账号" %>

<%
    String _url = "";
    if (url == null || url.equals("") || url.equals("default")){
        _url += "/merchant/account/membercenter/view.html";
    }else {
        _url = url;
    }
    if (param != null && !param.equals("")){
        _url += "?" + param;
    }
    String _permission = "";
    if (permission != null && !permission.equals("")){
        _permission = permission.trim();
    }
    int permissionLength = _permission.length();

    String _title = "";
    if (title == null || title.equals("")){
        _title = "点击查看玩家详情";
    }
    String _name;
    if (isManage != null && isManage && name.contains("@")){
        _name = name.substring(0, name.indexOf("@"));
    }else {
        _name = name;
    }
%>

<c:set var="_url" value="<%= _url%>"/>
<c:set var="_permission" value="<%= _permission%>"/>
<c:set var="permissionLength" value="<%= permissionLength%>"/>
<c:set var="_title" value="<%= _title%>"/>
<c:set var="_name" value="<%= _name%>"/>


<c:if test="${permissionLength == 0}">
    <a href="${_url}" nav-target="mainFrame" title="${_title}">${_name}</a>
</c:if>
<c:if test="${permissionLength > 0}">
    <shiro:hasPermission name="${_permission}"><a href="${_url}" nav-target="mainFrame" title="${_title}"></shiro:hasPermission>
    ${_name}
    <shiro:hasPermission name="${_permission}"></a></shiro:hasPermission>
</c:if>