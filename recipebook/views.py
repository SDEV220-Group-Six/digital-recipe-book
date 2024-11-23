from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.decorators import login_required
from django.shortcuts import render

class RecipeBookLoginView(LoginView):
    template_name = 'account/login.html'

class RecipeBookLogoutView(LogoutView):
    template_name = 'account/logout.html'

@login_required
def profile(request):
    return render(request, 'account/profile.html')
