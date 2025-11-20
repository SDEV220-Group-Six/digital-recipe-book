from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from recipes.models import Note
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
# from django.http import JsonResponse
# from django.middleware.csrf import get_token


@method_decorator(csrf_exempt, name="dispatch")
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


# def get_csrf_token(request):
#     """Ensure Django returns the existing CSRF cookie value and sets it properly."""
#     csrf_token = request.COOKIES.get("csrftoken") or get_token(request)

#     response = JsonResponse({"csrftoken": csrf_token})
#     response.set_cookie(
#         "csrftoken",
#         csrf_token,
#         samesite="None",  # Required for cross-origin requests in iframe
#         secure=False,  # False for local testing
#         httponly=False,  # Allow JavaScript to access the cookie
#     )
#     return response
