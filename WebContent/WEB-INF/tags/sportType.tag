<%@ tag language="java" pageEncoding="UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ tag import="org.soul.commons.lang.string.I18nTool" %>
<%@ tag import="SessionManagerCommon" %>
<%--体育类注单方式--%>
<%@attribute name="apiId" type="java.lang.Integer" required="true" description="apiId" %>
<%@attribute name="betType" type="java.lang.String" required="false" description="下注方式" %>
<%@attribute name="oddsType" type="java.lang.String" required="false" description="盘口类型" %>

<c:set var="views" value='<%=I18nTool.getI18nMap(SessionManagerCommon.getLocale().toString()).get("views") %>'/>

<c:set var="key" value="betType.${apiId}.${fn:replace(betType, ' ', '')}"/>
${views.sportsbook[key]}
<br/>
<c:set var="key" value="oddsType.${oddsType}"/>
<c:if test="${!empty oddsType}">
    (${views.sportsbook[key]})
</c:if>