"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path


from banking.views import login_view, log_attack_view, admin_stats_view, fake_accounts_view, ban_ip_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', login_view, name='login_api'),
    path('api/log-attack/', log_attack_view, name='log_attack_api'),
    path('api/admin-stats/', admin_stats_view, name='admin_stats_api'),
    path('api/fake-accounts/', fake_accounts_view, name='fake_accounts_api'), 
    path('api/ban-ip/',ban_ip_view,name='ban_ip_api'),
]