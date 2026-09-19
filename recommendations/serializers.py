from rest_framework import serializers

from .models import ScholarshipRecommendation


class ScholarshipRecommendationSerializer(
    serializers.ModelSerializer
):

    scholarship_title = serializers.CharField(
        source="scholarship.title",
        read_only=True
    )

    scholarship_amount = serializers.DecimalField(
        source="scholarship.amount",
        max_digits=12,
        decimal_places=2,
        read_only=True
    )

    deadline = serializers.DateField(
        source="scholarship.deadline",
        read_only=True
    )

    class Meta:
        model = ScholarshipRecommendation

        fields = [
            "id",
            "scholarship",
            "scholarship_title",
            "scholarship_amount",
            "match_score",
            "reason",
            "deadline",
        ]