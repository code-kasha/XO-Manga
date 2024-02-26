from django import template

from django.utils.dateparse import parse_datetime

register = template.Library()


@register.filter(name="last_part")
def last_part(value, delimiter="-"):
    """
    Custom template filter to get the last part of a string.
    """
    parts = value.split(delimiter)
    return parts[-1] if len(parts) > 1 else value


@register.filter(name="date_to_str")
def date_to_str(value):
    """
    Formats Date String
    """
    return parse_datetime(value)
