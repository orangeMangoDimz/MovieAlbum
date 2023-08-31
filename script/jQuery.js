const urlSearchMovies = `http://www.omdbapi.com/?apikey=5af51598&s=`
const urlDetailMovie = `http://www.omdbapi.com/?apikey=5af51598&i=`
const searchInput = document.querySelector(`.searchInput`)


searchInput.addEventListener(`keyup`, () => {
    $.ajax({
        url: urlSearchMovies + searchInput.value,
        success: displayAllMovies,
        error: errorHandle
    })
})

const displayAllMovies = async (data) => {
    if (data.Search === undefined || data === null) return
    let movieList = ``
    const movieDetailPromises = data.Search.map((movie) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: urlDetailMovie + movie.imdbID,
                success: (movieDetail) => resolve(displayAllMoviesElement(movie, movieDetail)),
                error: reject
            });
        });
    });

    // Wait for all promises to resolve
    const movieDetails = await Promise.all(movieDetailPromises);
    movieList = movieDetails.join(''); // Combine the HTML elements
    $(`.movies-list`).html(movieList)

    $(`.movieDetailBtn`).on(`click`, function () {
        $.ajax({
            url: urlDetailMovie + $(this).data(`imdbid`),
            success: (data) => {
                const detailMovieModal = displaySpecificMovie(data)
                $(`.modal-body`).html(detailMovieModal)
            },
            error: errorHandle
        })
    })
}

const displayAllMoviesElement = (movie, movieDetail) => {
    return (
        `<div class="col">
            <div class="card shadow-sm">
                <img class="width="225" height="225" src="${movie.Poster}">
                <div class="card-body">
                    <div class="title mb-2">
                        <h4 class="card-text ms-3 mt-3 me-3">${movie.Title}</h4>
                    </div>
                    <div class="content ms-3 me-3">
                        <p> 
                            ${movieDetail.Plot.length > 150 ? movieDetail.Plot.slice(0, 150) + `...` : movieDetail.Plot}
                        </p>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-3 ms-3">
                        <div class="d-flex justify-content-end">
                            <p class="badge text-bg-primary me-2 p-2">${movie.Type}</p>
                            <p class="badge text-bg-warning p-2 me-3">${movie.Year}</p>
                        </div>
                    </div>
                </div>
                <div class="card-footer d-flex justify-content-center align-items-center fw-bold btn btn-primary bg-primary">
                <button type="button" class="movieDetailBtn btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#movieDetail" data-imdbID=${movie.imdbID}>
                    View Movie Detail
                </button>
            </div>
            </div>
        </div>`
    )
}

const displaySpecificMovie = (data) => {
    return (
        `<div class="container-fluid p-5">
            <div class="row">
                <div class="col-md-3">
                    <img src="${data.Poster}" alt="moviePoster" class="img-fluid">
                </div>
                <div class="col-md">
                    <ul class="list-group">
                        <li class="list-group-item"><strong>${data.Title}</strong></li>
                        <li class="list-group-item"><strong>Directors:</strong> ${data.Director}</li>
                        <li class="list-group-item"><strong>Actors:</strong> ${data.Actors}</li>
                        <li class="list-group-item"><strong>Writers:</strong> ${data.Writter}</li>
                        <li class="list-group-item"><strong>Plot:</strong> ${data.Plot}</li>
                    </ul>
                </div>
            </div>
        </div>`
    )
}

const errorHandle = () => {
    console.log(`Woops! Something's wrong!`);
}