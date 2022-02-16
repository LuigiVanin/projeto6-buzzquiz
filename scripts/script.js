const userQuizzesHtmlClass = document.querySelector(".home_created-quizzes");
const generalQuizzesHtmlCLass = document.querySelector(".home_general-quizzes");
// const quizzesCreatedByUser = JSON.parse(localStorage.getItem("userQuizz"));

// function getUserQuizzes(){

// }

const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes")
promise.then(printGeneralQuizzes)

function printGeneralQuizzes(response) {
    response.data.forEach(element => {
        console.log(element)
        generalQuizzesHtmlCLass.innerHTML += `
        
        <article class="home_quizz" onclick="openQuizzView()">
            <img src="${element.image}" alt="">
            <div class="home_quizz_gradient"></div>
            <p>${element.title}</p>
        </article>
        `
    });
    console.log(response);
}

function openQuizzView() {
    document.querySelector(".home").classList.toggle("hidden");
    document.querySelector(".quizz-view").classList.toggle("hidden");
}
