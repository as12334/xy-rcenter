<%@ tag language="java" body-content="scriptless" dynamic-attributes="dynattrs" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<div id="validateRule" style="display: none">
    <c:choose>
        <c:when test="${command != null && command.validateRule != null}">
            ${command.validateRule}
        </c:when>
        <c:when test="${validateRule != null}">
            ${validateRule}
        </c:when>
    </c:choose>
</div>