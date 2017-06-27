<div id="sidebar" class="mini-menu">
    <ul class="sidebar-menu" id="nav-accordion">
        <li class="<g:if test="${pageProperty(name: 'meta.pageActive') == 'home'}"> active</g:if>">
            <g:link controller="index" action="index">
                <i class="icon-home"></i>
                <span class="menu-text breadcrump">Home</span>
            </g:link>
        </li>
        <li class="<g:if test="${pageProperty(name: 'meta.navActive') == 'usersAccounts'}"> active</g:if>">
            <g:link controller="administrator" action="userAccounts">
                <i class="icon-people"></i>
                 <span class="menu-text"><g:message code="home.h1.users" /></span>
            </g:link>
        </li>
        <li class="<g:if test="${pageProperty(name: 'meta.navActive') == 'companyProfile'}"> active</g:if>">
            <g:link controller="administrator" action="companyProfile">
                <i class="icon-film"></i>
                 <span class="menu-text"><g:message code="home.h1.company" /></span>
            </g:link>
        </li>
        <li class="<g:if test="${pageProperty(name: 'meta.navActive') == 'billing'}"> active</g:if>">
            <g:link controller="administrator" action="billing">
                <i class="icon-credit-card"></i> 
                <span class="menu-text"><g:message code="home.h1.billing" /></span>
            </g:link>
        </li>
    </ul>
</div>