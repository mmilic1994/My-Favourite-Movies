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
    let $allRows = $("tr")
    for (let i = 1; i < $allRows.length; i++) {
        rating_value.push({
            "rating": parseFloat($allRows[i].getAttribute("value")),
            "title": $allRows[i].children[0].innerText,
            "posterURL": $allRows[i].children[1].children[0].getAttribute("src")
        })
    }
    return rating_value;
}

function updateDOM(data) {
    $moviesListCopy = $moviesList.children();
    $moviesList.children().remove()
    let regexURL = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
    for (let j = 0; j < data.length; j++) {
        if (regexURL.test(data[j]["posterURL"])) {
            $moviesList.append(`<tr value="${data[j]["rating"]}">
                                    <td class="display-4">${data[j]["title"]}</td>
                                    <td> <img class="img-thumbnail img-responsive" src="${encodeURI(data[j]["posterURL"])}"/> </td>
                                    <td class="rating_value display-4">${data[j]["rating"]}</td>  
                                    <td><button class="btn btn-danger delete_movie_btn">Delete</button></td>  
                                </tr>`)
        } else {
            $moviesList.append(`<tr value="${data[j]["rating"]}">
                                    <td class="display-4">${data[j]["title"]}</td>
                                    <td> <img class="img-thumbnail img-responsive" src="https://www.theprintworks.com/wp-content/themes/psBella/assets/img/film-poster-placeholder.png"/></td>
                                    <td class="rating_value display-4">${data[j]["rating"]}</td>  
                                    <td><button class="btn btn-danger delete_movie_btn">Delete</button></td>  
                                </tr>`)
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
                        let $newMovie = $(`<tr value="${$movieRating.val()}">
                                <td class="display-4">${$movieTitle.val()}</td>
                                <td> <img class="img-thumbnail img-responsive" src="${encodeURI(response["Poster"])}"/> </td>
                                <td class="rating_value display-4">${$movieRating.val()}</td>  
                                <td><button class="btn btn-danger delete_movie_btn">Delete</button></td>  
                                </tr>`)
                        $moviesList.append($newMovie);
                    } else {
                        let $newMovie = $(`<tr value="${$movieRating.val()}">
                                <td class="display-4">${$movieTitle.val()}</td>
                                <td> <img class="img-thumbnail img-responsive" src="https://www.theprintworks.com/wp-content/themes/psBella/assets/img/film-poster-placeholder.png"/></td>
                                <td class="rating_value display-4">${$movieRating.val()}</td>  
                                <td><button class="btn btn-danger delete_movie_btn">Delete</button></td>  
                                </tr>`)
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
        $(e.target).parent().parent().remove();
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

});