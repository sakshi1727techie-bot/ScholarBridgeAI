from django import forms
from .models import StudentProfile


class StudentProfileForm(forms.ModelForm):

    class Meta:
        model = StudentProfile

        fields = [
            "full_name",
            "date_of_birth",
            "gender",
            "phone",
            "state",
            "city",
            "course",
            "specialization",
            "college",
            "academic_score",
            "family_income",
            "category",
        ]

        widgets = {
            "full_name": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter your full name"
                }
            ),

            "date_of_birth": forms.DateInput(
                attrs={
                    "class": "form-control",
                    "type": "date"
                }
            ),

            "gender": forms.Select(
                attrs={
                    "class": "form-control"
                }
            ),

            "phone": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter phone number"
                }
            ),

            "state": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter state"
                }
            ),

            "city": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter city"
                }
            ),

            "course": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Example: B.Sc IT"
                }
            ),

            "specialization": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Example: Information Technology"
                }
            ),

            "college": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter college name"
                }
            ),

            "academic_score": forms.NumberInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter percentage",
                    "min": "0",
                    "max": "100",
                    "step": "0.01"
                }
            ),

            "family_income": forms.NumberInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter annual family income",
                    "min": "0",
                    "step": "0.01"
                }
            ),

            "category": forms.Select(
                attrs={
                    "class": "form-control"
                }
            ),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # All profile fields are required
        required_fields = [
            "full_name",
            "date_of_birth",
            "gender",
            "phone",
            "state",
            "city",
            "course",
            "specialization",
            "college",
            "academic_score",
            "family_income",
            "category",
        ]

        for field_name in required_fields:
            self.fields[field_name].required = True

        # Validation limits
        self.fields["academic_score"].min_value = 0
        self.fields["academic_score"].max_value = 100

        self.fields["family_income"].min_value = 0