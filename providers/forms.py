from django import forms
from .models import ProviderProfile


class ProviderProfileForm(forms.ModelForm):

    class Meta:
        model = ProviderProfile

        fields = [
            "organization_name",
            "organization_type",
            "contact_person",
            "phone",
            "address",
        ]

        widgets = {
            "organization_name": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter organization name"
                }
            ),

            "organization_type": forms.Select(
                attrs={
                    "class": "form-control"
                }
            ),

            "contact_person": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter contact person name"
                }
            ),

            "phone": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter phone number"
                }
            ),

            "address": forms.Textarea(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter organization address",
                    "rows": 4
                }
            ),
        }

from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm


User = get_user_model()


class ProviderRegistrationForm(UserCreationForm):

    class Meta:
        model = User

        fields = [
            "email",
        ]

        labels = {
            "email": "Email Address",
        }