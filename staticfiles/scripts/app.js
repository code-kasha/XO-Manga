document.addEventListener("DOMContentLoaded", () => {
  closeDialog()
  handleTruncations()
  initChapterDetailsSidebar()
  initChapterSelectSidebar()
  initNavbar()
  initChapterSearch()
  loadMangaPages()
  readerSpacing()
  scrollIntoView()
  setupCache()
  setupSpinner()
  widthSettings()

  function closeDialog() {
    document.querySelectorAll("[data-type=close]").forEach((button) => {
      if (button) {
        button.addEventListener("click", () => {
          const dialog = button.closest(".dialog")
          if (dialog) {
            dialog.classList.add("hidden")
          }
        })
      }
    })
  }

  function handleImageError() {
    this.src = imagePlaceholder
  }

  function handleTruncations() {
    headings = document.querySelectorAll("[data-type=heading]")
    headings.forEach((heading) => {
      if (heading) {
        heading.addEventListener("click", () => {
          heading.classList.toggle("truncate")
        })
      }
    })
  }

  function loadImageAndCache(imageId, imageSrc) {
    const img = new Image()
    img.onload = () => {
      localStorage.setItem(imageId, imageSrc)
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          action: "cache-image",
          imageId: imageId,
          imageSrc: imageSrc,
        })
      }
    }
    img.onerror = handleImageError()
    img.src = imageSrc
  }

  function loadMangaPages() {
    let images = document.querySelectorAll("[data-type='image']")
    images.forEach(function (image) {
      let spinnerId = image.id.replace("img", "spinner")
      let spinner = document.getElementById(spinnerId)
      spinner.style.display = "none"
      image.addEventListener("load", function () {
        spinner.style.display = "none"
      })
      image.addEventListener("error", function () {
        spinner.style.display = "none"
      })
    })
  }

  function initNavbar() {
    buttons = document.querySelectorAll("[data-toggle-type=navbar-search]")

    if (buttons) {
      buttons.forEach((button) => {
        if (button) {
          button.addEventListener("click", () => {
            container = document.getElementById("navbar-search")
            container.classList.toggle("hidden")
          })
        }
      })
    }
  }

  function initChapterDetailsSidebar() {
    sidebar = document.getElementById("sidebar")
    toggleSidebar = document.getElementById("toggle-sidebar")

    if (sidebar && toggleSidebar) {
      toggleSidebar.addEventListener("click", () => {
        sidebar.classList.toggle("invisible")
      })
    }
  }

  function initChapterSelectSidebar() {
    chapters = document.getElementById("chapters")
    toggleChapters = document.getElementById("toggle-chapters")

    if (chapters && toggleChapters) {
      toggleChapters.addEventListener("click", () => {
        chapters.classList.toggle("invisible")
      })
    }
  }

  function initChapterSearch() {
    const searchInput = document.getElementById("searchInput")
    const chapterLinks = Array.from(
      document.querySelectorAll("[data-type=link]")
    )

    const chapterNumbers = chapterLinks.map((link) =>
      link.innerText.toLowerCase()
    )
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase()
        chapterLinks.forEach((link, index) => {
          const chapterNumber = chapterNumbers[index]
          if (chapterNumber.includes(searchTerm)) {
            link.classList.remove("hidden")
          } else {
            link.classList.add("hidden")
          }
        })
      })
    }
  }

  function readerSpacing() {
    const reader = document.getElementById("reader")
    const button = document.getElementById("modeChange")

    const openSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
					stroke="currentColor" class="w-6 h-6 mx-auto">
					<path stroke-linecap="round" stroke-linejoin="round"
						d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
				</svg>`
    const closeSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="w-6 h-6 mx-auto">
          <path stroke-linecap="round" stroke-linejoin="round" 
          d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
        </svg>`

    if (button && reader) {
      button.addEventListener("click", () => {
        reader.classList.toggle("space-y-3")

        if (reader.classList.contains("space-y-3")) {
          button.innerHTML = closeSVG
          button.title = "Shrink"
        } else {
          button.innerHTML = openSVG
          button.title = "Expand"
        }
      })
    }
  }

  function scrollIntoView() {
    let selectedElement = document.getElementById(nowReading)
    if (selectedElement) {
      selectedElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  function setupCache() {
    const images = document.querySelectorAll("[data-type=image]")
    if (images.length > 0) {
      images.forEach((image) => {
        const imageId = image.alt
        const imageSrc = image.src
        const storedData = localStorage.getItem(imageId)

        if (!storedData) {
          loadImageAndCache(imageId, imageSrc)
        }
      })
    }
  }

  function setupSpinner() {
    const links = document.querySelectorAll("[data-action=fetch]")
    links.forEach((link) => {
      link.addEventListener("click", () => {
        document.getElementById("spinner-container").style.display = "flex"
      })
    })
  }

  function widthSettings() {
    const images = document.querySelectorAll("[data-type=image]")
    const button = document.getElementById("widthChange")

    if (button && images) {
      button.addEventListener("click", () => {
        images.forEach((image) => {
          image.classList.toggle("w-full")

          if (image.classList.contains("w-full")) {
            button.title = "3:4"
          } else {
            button.title = "1:1"
          }
        })
      })
    }
  }
})
