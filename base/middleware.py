from django.contrib.sessions.middleware import SessionMiddleware


class XOSessionMiddleware(SessionMiddleware):
    def __init__(self, get_response):
        super().__init__(get_response)

        self.session_objects = {
            "search_query": "",
            "search_results": {},
            "data": {
                "id": "",
                "details": {},
                "chapter": {},
                "chapters": [],
                "pages": {},
                "now_reading": "",
            },
            "previous": {},
            "next": {},
        }

    def __call__(self, request):
        for key, value in self.session_objects.items():
            if key not in request.session:
                self.fetch_data(request, key, value)

        # Search Query
        request.get_search_query = lambda: self.get_session_value(
            request, "search_query"
        )
        request.set_search_query = lambda value: self.set_session_value(
            request, "search_query", value
        )

        # Search Results
        request.get_search_results = lambda: self.get_session_value(
            request, "search_results"
        )
        request.set_search_results = lambda value: self.set_session_value(
            request, "search_results", value
        )

        # ID
        request.get_id = lambda: self.get_data(request, "id")
        request.set_id = lambda value: self.set_data(request, "id", value)

        # Details
        request.get_details = lambda: self.get_data(request, "details")
        request.set_details = lambda value: self.set_data(request, "details", value)

        # chapters
        request.get_chapters = lambda: self.get_data(request, "chapters")
        request.set_chapters = lambda value: self.set_data(request, "chapters", value)

        # Chapter
        request.get_chapter = lambda: self.get_data(request, "chapter")
        request.set_chapter = lambda value: self.set_data(request, "chapter", value)

        # Now Reading
        request.get_now_reading = lambda: self.get_data(request, "now_reading")
        request.set_now_reading = lambda value: self.set_data(
            request, "now_reading", value
        )

        # Pages
        request.get_pages = lambda: self.get_data(request, "pages")
        request.set_pages = lambda value: self.set_data(request, "pages", value)

        # Previous
        request.get_previous = lambda: self.get_session_value(request, "previous")
        request.set_previous = lambda value: self.set_session_value(
            request, "previous", value
        )

        # Next
        request.get_next = lambda: self.get_session_value(request, "next")
        request.set_next = lambda value: self.set_session_value(request, "next", value)

        return super().__call__(request)

    def fetch_data(self, request, key, value):
        if key in self.session_objects:
            request.session[key] = value

    def get_session_value(self, request, key):
        return request.session.get(key, None)

    def set_session_value(self, request, key, value):
        request.session[key] = value

    def get_data(self, request, key):
        data = request.session.get("data", {})
        return data.get(key, None)

    def set_data(self, request, key, value):
        data = request.session.get("data", {})
        data[key] = value
        request.session["data"] = data
