from django import forms
from .models import (
    Scholarship,
    ScholarshipEligibility,
    ScholarshipRequiredDocument,
)
class ScholarshipForm(forms.ModelForm):

    class Meta:
        model = Scholarship
        fields = [
            "title",
            "description",
            "amount",
            "application_start",
            "deadline",
        ]

        widgets = {
            "title": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter scholarship title"
                }
            ),

            "description": forms.Textarea(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter scholarship description",
                    "rows": 5
                }
            ),

            "amount": forms.NumberInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter scholarship amount"
                }
            ),

            "application_start": forms.DateInput(
                attrs={
                    "class": "form-control",
                    "type": "date"
                }
            ),

            "deadline": forms.DateInput(
                attrs={
                    "class": "form-control",
                    "type": "date"
                }
            ),
        }

class ScholarshipEligibilityForm(forms.ModelForm):

    class Meta:
        model = ScholarshipEligibility

        fields = [
            "eligible_courses",
            "specialization",
            "minimum_percentage",
            "maximum_income",
            "category",
            "gender",
            "state",
            "other_criteria",
        ]

        widgets = {
            "eligible_courses": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Example: B.Sc., B.Com., B.A."
                }
            ),

            "specialization": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Example: Information Technology"
                }
            ),

            "minimum_percentage": forms.NumberInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Example: 60",
                    "step": "0.01"
                }
            ),

            "maximum_income": forms.NumberInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Example: 500000",
                    "step": "0.01"
                }
            ),

            "category": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Example: General, OBC, SC, ST"
                }
            ),

            "gender": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Example: Any"
                }
            ),

            "state": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Example: Maharashtra"
                }
            ),

            "other_criteria": forms.Textarea(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter any other eligibility criteria",
                    "rows": 4
                }
            ),
        }

class ScholarshipRequiredDocumentForm(forms.ModelForm):
    class Meta:
        model = ScholarshipRequiredDocument
        fields = [
            "document_type",
            "is_mandatory",
            "description",
        ]
        widgets = {
            "document_type": forms.Select(
                attrs={"class": "form-control"}
            ),
            "is_mandatory": forms.CheckboxInput(
                attrs={"class": "form-check-input"}
            ),
            "description": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter document details"
                }
            ),
        }