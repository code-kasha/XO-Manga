import json
import requests

from django.contrib import messages


CODES = [204, 301, 302, 307, 400, 404, 500]


def fetch(request, url):
    """
    Fetches data from a URL.
    """
    try:
        response = requests.get(url, allow_redirects=False)
        if response.status_code not in CODES:
            response.raise_for_status()
            data = response.json()
            return data

    except requests.exceptions.Timeout:
        messages.error(
            request, "The request took too long to complete. Please try again later."
        )
        return None

    except requests.exceptions.HTTPError as e:
        status_code = e.response.status_code
        messages.error(
            request,
            f"The server returned an error: HTTP {status_code}. Please check the URL and try again.",
        )
        return None

    except requests.exceptions.RequestException:
        messages.error(
            request,
            "There was a problem with the network connection. Please check your internet connection and try again.",
        )
        return None

    except json.JSONDecodeError:
        messages.error(
            request,
            "The response data could not be processed. Please try again after sometime.",
        )
        return None

    except Exception as e:
        messages.error(
            request,
            "An unexpected error occurred while fetching the data. Please try again after sometime.",
        )
        return None
