<%@ tag import="com.alibaba.dubbo.common.json.JSON" %>
<%@ tag import="org.soul.commons.data.json.JsonTool" %>
<%@ tag import="org.soul.commons.lang.string.I18nTool" %>
<%@ tag import="org.soul.model.sys.po.SysDict" %>
<%@ tag import="so.wwb.creditbox.web.tools.SessionManagerCommon" %>
<%@ tag import="so.wwb.creditbox.web.cache.Cache" %>
<%@ tag import="so.wwb.creditbox.model.manager.lottery.po.Lottery" %>
<%@ tag import="java.util.*" %>
<%@ tag import="org.soul.commons.collections.CollectionTool" %>
<%@ tag import="org.soul.commons.collections.MapTool" %>
<%@ tag import="sun.rmi.runtime.Log" %>
<%@ tag import="so.wwb.creditbox.model.common.TopMenuJson" %>


<%@ tag language="java" pageEncoding="UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@taglib uri="http://shiro.apache.org/tags" prefix="shiro"%>
<jsp:doBody var="bodyRes" />

<%@attribute name="params" type="java.util.Map" required="true" description="数据 key是name，值是value" %>

<c:forEach items="${params}" var="oneMap" varStatus="status">
    <input type="hidden" class="link-search-params" name="${oneMap.key}" value="${oneMap.value}" data-value="${oneMap.value}">
</c:forEach>

