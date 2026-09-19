from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from .forms import ProviderProfileForm
from applications.models import Application

@login_required
def provider_profile(request):

    profile = getattr(request.user, "provider_profile", None)

    if request.method == "POST":
        form = ProviderProfileForm(
            request.POST,
            instance=profile
        )

        if form.is_valid():
            provider_profile = form.save(commit=False)
            provider_profile.user = request.user
            provider_profile.save()

            return redirect("provider_profile")

    else:
        form = ProviderProfileForm(
            instance=profile
        )

    return render(
        request,
        "providers/provider_profile.html",
        {"form": form}
    )

from django.contrib.auth import login
from django.shortcuts import render, redirect

from .forms import ProviderRegistrationForm


def provider_register(request):

    if request.method == "POST":

        form = ProviderRegistrationForm(request.POST)

        if form.is_valid():

            user = form.save()

            user.role = "PROVIDER"
            user.save()

            login(request, user)

            return redirect("provider_profile")

    else:

        form = ProviderRegistrationForm()

    return render(
        request,
        "providers/provider_register.html",
        {"form": form}
    )

@login_required
def provider_dashboard(request):

    provider = request.user.provider_profile

    scholarships = provider.scholarships.all().order_by("-created_at")

    total_scholarships = scholarships.count()

    approved_scholarships = scholarships.filter(
        status="APPROVED"
    ).count()

    pending_scholarships = scholarships.filter(
        status="PENDING"
    ).count()

    rejected_scholarships = scholarships.filter(
        status="REJECTED"
    ).count()

    total_applications = Application.objects.filter(
        scholarship__provider=provider
    ).count()

    pending_applications = Application.objects.filter(
        scholarship__provider=provider,
        status="PENDING"
    ).count()

    under_review_applications = Application.objects.filter(
        scholarship__provider=provider,
        status="UNDER_REVIEW"
    ).count()

    approved_applications = Application.objects.filter(
        scholarship__provider=provider,
        status="APPROVED"
    ).count()

    context = {
        "provider": provider,
        "scholarships": scholarships,

        "total_scholarships": total_scholarships,
        "approved_scholarships": approved_scholarships,
        "pending_scholarships": pending_scholarships,
        "rejected_scholarships": rejected_scholarships,

        "total_applications": total_applications,
        "pending_applications": pending_applications,
        "under_review_applications": under_review_applications,
        "approved_applications": approved_applications,
    }

    return render(
        request,
        "providers/dashboard.html",
        context
    )