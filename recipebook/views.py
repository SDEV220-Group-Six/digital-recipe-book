from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from recipes.models import Note


class RecipeBookLoginView(LoginView):
    template_name = "account/login.html"


class RecipeBookLogoutView(LogoutView):
    template_name = "account/logout.html"


@login_required
def profile(request):
    note = Note.objects.get_or_create(user=request.user)[0]

    if request.method == "POST":
        note.content = request.POST.get("notes", "")
        note.save()
        return redirect("profile")
    return render(request, "account/profile.html", {"note": note})
