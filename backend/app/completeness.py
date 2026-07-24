CRITICAL_FIELDS = [
    "customer_name",
    "product_name",
    "complaint_type",
    "detailed_complaint_description",
]

RECOMMENDED_FIELDS = [
    "batch_lot_number",
    "manufacturing_date",
    "quantity_affected",
]


def check_completeness(form_state: dict) -> dict:
    missing_critical = [
        field for field in CRITICAL_FIELDS if not form_state.get(field, "").strip()
    ]
    missing_recommended = [
        field for field in RECOMMENDED_FIELDS if not form_state.get(field, "").strip()
    ]

    return {
        "is_complete": len(missing_critical) == 0,
        "missing_critical": missing_critical,
        "missing_recommended": missing_recommended,
    }
