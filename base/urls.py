from django.contrib import admin
from django.urls import path

from base import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("clear", views.clear, name="clear"),
    path("", views.index, name="index"),
    path("search", views.search, name="search"),
    path("details", views.details, name="details"),
    path("read", views.read, name="read"),
]
