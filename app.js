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
            "title": $allRows[i].childNodes[1].innerText
        })
    }
    return rating_value;
}

function updateDOM(data) {
    $moviesListCopy = $moviesList.children();
    $moviesList.children().remove()
    for (let j = 0; j < data.length; j++) {
        $moviesList.append(`<tr value="${data[j]["rating"]}">
    <td>${data[j]["title"]}</td>
    <td class="rating_value">${data[j]["rating"]}</td>  
    <td><button class="btn btn-danger delete_movie_btn">Delete</button></td>  
    </tr>`)
    }
    return $moviesList;
}

$(document).ready(function () {
    $addMovieBtn.click(function (e) {
        e.preventDefault();
        let $newMovie = $(`<tr value="${$movieRating.val()}">
                            <td>${$movieTitle.val()}</td>
                            <td class="rating_value">${$movieRating.val()}</td>  
                            <td><button class="btn btn-danger delete_movie_btn">Delete</button></td>  
                           </tr>`)
        $moviesList.append($newMovie);
    })

    $moviesList.on("click", ".delete_movie_btn", function (e) {
        e.preventDefault();
        $(e.target).parent().parent().remove();
    })

    $sortBtn.click(function (e) {
        e.preventDefault();
        if ($(e.target).hasClass("descending")) {
            let rating_value = getMovieData();
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

    $saveMovieBtn.click(function (e){
        e.preventDefault()
        let data = getMovieData();
        localStorage.setItem("favourite_movies", JSON.stringify(data))
    })

});