let $movieTitle = $("#movie_title");
let $movieRating = $("#movie_rating");
let $moviesList = $("#movies_list");
let $addMovieBtn = $("#add-movie-btn");
let $saveMovieBtn = $("#save-movie-btn");
let $sortBtn = $(".fa-sort");

function sortByKeyDescending(array, key) {
    return array.sort(function (a, b) {
        let x = a[key];
        let y = b[key];
        return ((x > y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function sortByKeyAscending(array, key) {
    return array.sort(function (a, b) {
        let x = a[key];
        let y = b[key];
        return ((x < y) ? -1 : ((x < y) ? 1 : 0));
    });
}

function getMovieData() {
    let rating_value = [];
    let $allRows = $(".accordion-toggler.tr")
    for (let i = 0; i < $allRows.length; i++) {
        rating_value.push({
            "rating": parseFloat($allRows[i].getAttribute("value")),
            "title": $allRows[i].children[0].innerText,
            "posterURL": $allRows[i].children[1].children[0].getAttribute("src"),
            "year": parseInt($allRows[i].children[4].children[0].innerText.split("(")[1]),
            "duration":  $allRows[i].children[4].children[1].children[1].innerText,
            "genre": $allRows[i].children[4].children[2].innerText.split(":")[1],
            "plot": $allRows[i].children[4].children[3].innerText.split(":")[1],
            "director": $allRows[i].children[4].children[4].innerText.split(":")[1],
            "actors": $allRows[i].children[4].children[5].innerText.split(":")[1],
            "imdbLink": $allRows[i].children[4].children[0].children[0].getAttribute("href") 
        })
    }
    console.log(rating_value)
    return rating_value;
}

function updateDOM(data) {
    $moviesListCopy = $moviesList.children();
    $moviesList.children().remove()
    let regexURL = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
    for (let j = 0; j < data.length; j++) {
        if (regexURL.test(data[j]["posterURL"])) {
            $moviesList.append(`
            <div class="accordion-toggler tr" value="${data[j]["rating"]}">
            <div class="col-md-3 col-sm-4 text-center">
                    <div class="display-4 d-flex align-items-center">
                        <i class="fa fa-chevron-down"></i> 
                        <span class="movie-title">${data[j]["title"]}<span>
                    </div>
            </div>
            <div class="col-md-3 col-sm-3 text-center">
                 <img class="img-thumbnail img-responsive" src="${encodeURI(data[j]["posterURL"])}"/>
            </div>
            <div class="col-md-3 col-sm-1 text-center">
                <div class="rating_value display-4">${data[j]["rating"]}</div>
            </div>  
            <div class="col-md-3 col-sm-4 text-center">
                <div><button class="btn btn-danger delete_movie_btn">Delete</button></div>
            </div>
            <div class="movie-info-accordion bg-light">
            <h4><a class="text-info" href="${data[j]["imdbLink"]}">${data[j]["title"]}</a> (${data[j]["year"]})</h4>
                <div class="text-muted">
                    <i class="far fa-clock"></i>
                    <span>${data[j]["duration"]}</span>
                </div>
                <p><span class="text-info">Genre:</span>${data[j]["genre"]}</p>      
                <p><span class="text-info">Plot:</span>${data[j]["plot"]}</p>
                <p><span class="text-info">Director:</span>${data[j]["director"]}</p>
                <p><span class="text-info">Actors:</span>${data[j]["actors"]}</p>
             </div> 
        </div>
           `)
        } else {
            $moviesList.append(`
            <div class="accordion-toggler tr" value="${data[j]["rating"]}">
            <div class="col-md-3 col-sm-4 text-center">
                    <div class="display-4 d-flex align-items-center">
                        <i class="fa fa-chevron-down"></i> 
                        <span class="movie-title">${data[j]["title"]}<span>
                    </div>
            </div>
            <div class="col-md-3 col-sm-3 text-center">
            <img class="img-thumbnail img-responsive" src="https://www.theprintworks.com/wp-content/themes/psBella/assets/img/film-poster-placeholder.png"/>
            </div>
            <div class="col-md-3 col-sm-1 text-center">
                <div class="rating_value display-4">${data[j]["rating"]}</div>
            </div>  
            <div class="col-md-3 col-sm-4 text-center">
                <div><button class="btn btn-danger delete_movie_btn">Delete</button></div>
            </div>
        </div>
            `)
        }
    }
    return $moviesList;
}

$(document).ready(function () {
    $addMovieBtn.click(function (e) {
        e.preventDefault();
        if ($movieTitle.val() && $movieRating.val()) {
            $.ajax({
                method: "GET",
                url: "https://www.omdbapi.com/?apikey=e2a7836d&",
                data: {
                    t: `${$movieTitle.val().toLowerCase()}`
                },
                dataType: "json",
                success: function (response) {
                    let regexURL = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
                    if (regexURL.test(response["Poster"])) {
                        let $newMovie = $(`
                                <div class="accordion-toggler tr" value="${$movieRating.val()}">
                                    <div class="col-md-3 col-sm-4 text-center">
                                            <div class="display-4 d-flex align-items-center">
                                                <i class="fa fa-chevron-down"></i> 
                                                <span class="movie-title">${$movieTitle.val()}<span>
                                            </div>
                                    </div>
                                    <div class="col-md-3 col-sm-3 text-center">
                                         <img class="img-thumbnail img-responsive" src="${encodeURI(response["Poster"])}"/>
                                    </div>
                                    <div class="col-md-3 col-sm-1 text-center">
                                        <div class="rating_value display-4">${$movieRating.val()}</div>
                                    </div>  
                                    <div class="col-md-3 col-sm-4 text-center">
                                        <div><button class="btn btn-danger delete_movie_btn">Delete</button></div>
                                    </div>
                                    <div class="movie-info-accordion bg-light">
                                    <h4><a class="text-info" href="https://www.imdb.com/title/${response["imdbID"]}/">${response["Title"]}</a> (${response["Year"]})</h4>
                                        <div class="text-muted">
                                            <i class="far fa-clock"></i>
                                            <span>${response["Runtime"]}</span>
                                        </div>
                                        <p><span class="text-info">Genre:</span>${response["Genre"]}</p>      
                                        <p><span class="text-info">Plot:</span>${response["Plot"]}</p>
                                        <p><span class="text-info">Director:</span>${response["Director"]}</p>
                                        <p><span class="text-info">Actors:</span>${response["Actors"]}</p>
                                     </div> 
                                </div>
                            `)
                        $moviesList.append($newMovie);
                    } else {
                        let $newMovie = $(`
                        <div class="accordion-toggler tr" value="${$movieRating.val()}">
                                    <div class="col-md-3 col-sm-4 text-center">
                                            <div class="display-4 d-flex align-items-center">
                                                <i class="fa fa-chevron-down"></i> 
                                                <span class="movie-title">${$movieTitle.val()}<span>
                                            </div>
                                    </div>
                                    <div class="col-md-3 col-sm-3 text-center">
                                    <img class="img-thumbnail img-responsive" src="https://www.theprintworks.com/wp-content/themes/psBella/assets/img/film-poster-placeholder.png"/>
                                    </div>
                                    <div class="col-md-3 col-sm-1 text-center">
                                        <div class="rating_value display-4">${$movieRating.val()}</div>
                                    </div>  
                                    <div class="col-md-3 col-sm-4 text-center">
                                        <div><button class="btn btn-danger delete_movie_btn">Delete</button></div>
                                    </div>
                                </div>
                            `)
                        $moviesList.append($newMovie);
                    }

                },
                error: function (error) {
                    console.log(error);
                }
            })
        }
    })

    $moviesList.on("click", ".delete_movie_btn", function (e) {
        e.preventDefault();
        $(e.target).parent().parent().parent().remove();
    })

    $sortBtn.click(function (e) {
        e.preventDefault();
        if ($(e.target).hasClass("descending")) {
            let rating_value = getMovieData();
            console.log(rating_value)
            let $sortedRatingValues = sortByKeyDescending(rating_value, "rating");
            updateDOM($sortedRatingValues);
            $(e.target).removeClass("descending");
        } else {
            let rating_value = getMovieData();
            let $sortedRatingValuesAscending = sortByKeyAscending(rating_value, "rating");
            updateDOM($sortedRatingValuesAscending);
            $(e.target).addClass("descending");
        }
    })

    $saveMovieBtn.click(function (e) {
        e.preventDefault()
        let data = getMovieData();
        localStorage.setItem("favourite_movies", JSON.stringify(data))
    })

    $moviesList.on('click', '.accordion-toggler', function(e) {
        $(this).toggleClass("active");
        $(this).find(".movie-info-accordion").toggleClass("collapsed");

        // $(".movie-info-accordion").toggleClass("collapsed");
        
        // $(".movie-info-accordion").slideToggle(300);
    });
});