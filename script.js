const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NTliOTk2Yjg0YjRkMWUyMDQxOTdhNmY5YTBlODEyYSIsIm5iZiI6MTczMzg0NTUzOC4xMiwic3ViIjoiNjc1ODYyMjI3YWNmZDI3OGM2ZGQ5ZTg3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xBP3pB4pABqt20E8AUr3cmU0IjQl6TK94bVuvwX25BM",
  },
};

const searchInput = document.getElementById("search");
const suggestionsContainer = document.getElementById("suggestions");
const postersContainer = document.getElementById("posters");

searchInput.addEventListener("input", () => {
  const query = searchInput.value;
  if (query.length > 2) {
    fetch(`https://api.themoviedb.org/3/search/movie?query=${query}`, options)
      .then((res) => res.json())
      .then((data) => {
        suggestionsContainer.innerHTML = "";
        data.results.forEach((movie) => {
          const suggestion = document.createElement("div");
          suggestion.textContent = movie.title;
          suggestion.className = "p-2 cursor-pointer hover:bg-gray-200";
          suggestion.onclick = () => {
            displayPoster(movie.id);
            suggestionsContainer.innerHTML = "";
            searchInput.value = "";
          };
          suggestionsContainer.appendChild(suggestion);
        });
      })
      .catch((err) => console.error(err));
  } else {
    suggestionsContainer.innerHTML = "";
  }
});

const languageSelect = document.getElementById("languageSelect");

function displayPoster(movieId) {
  fetch(`https://api.themoviedb.org/3/movie/${movieId}/images`, options)
    .then((res) => res.json())
    .then((data) => {
      const availableLanguages = new Set(
        data.posters.map((poster) => poster.iso_639_1)
      );
      languageSelect.innerHTML =
        '<option value="all">Todos los idiomas</option>';
      availableLanguages.forEach((lang) => {
        if (lang) {
          const option = document.createElement("option");
          option.value = lang;
          option.textContent = lang.toUpperCase();
          languageSelect.appendChild(option);
        }
      });

      updatePosters(data.posters);
    })
    .catch((err) => console.error(err));
}

function updatePosters(posters) {
  postersContainer.innerHTML = "";
  const selectedLanguage = languageSelect.value;

  const filteredPosters =
    selectedLanguage === "all"
      ? posters
      : posters.filter((poster) => poster.iso_639_1 === selectedLanguage);

  if (filteredPosters.length > 0) {
    filteredPosters.forEach((poster) => {
      const posterDiv = document.createElement("div");
      posterDiv.className =
        "transition-transform transform hover:scale-110 hover:shadow-lg";

      const img = document.createElement("img");
      img.src = `https://image.tmdb.org/t/p/w500${poster.file_path}`;
      img.alt = `Poster en ${poster.iso_639_1}`;
      img.className = "w-full h-auto rounded-lg";

      posterDiv.appendChild(img);
      postersContainer.appendChild(posterDiv);
    });
  } else {
    postersContainer.innerHTML =
      "<p>No hay pósters disponibles en el idioma seleccionado.</p>";
  }
}

languageSelect.addEventListener("change", () => {
  const movieId = searchInput.dataset.selectedMovieId;
  if (movieId) displayPoster(movieId);
});

function displayPoster(movieId) {
  fetch(`https://api.themoviedb.org/3/movie/${movieId}/images`, options)
    .then((res) => res.json())
    .then((data) => {
      postersContainer.innerHTML = "";
      if (data.posters.length > 0) {
        data.posters.forEach((poster) => {
          const posterDiv = document.createElement("div");
          posterDiv.className =
            "transition-transform transform hover:scale-110 hover:shadow-lg";

          const img = document.createElement("img");
          img.src = `https://image.tmdb.org/t/p/w500${poster.file_path}`;
          img.alt = "Poster de película";
          img.className = "w-full h-auto rounded-lg";

          posterDiv.appendChild(img);
          postersContainer.appendChild(posterDiv);
        });
      } else {
        postersContainer.innerHTML = "No hay posters disponibles";
      }
    })
    .catch((err) => console.error(err));
}
