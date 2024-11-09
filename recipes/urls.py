from django.urls import path
from . import views

urlpatterns = [
    path("home.html", views.home, name="home"),
]
