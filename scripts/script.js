const userQuizzesHtmlClass = document.querySelector(".home_created-quizzes");
const nonUserQuizzesHtmlCLass = document.querySelector(
    ".home_non-user-quizzes"
);
// const storedUserQuizzes = JSON.parse(localStorage.getItem("userQuizz"));
const storedUserQuizzes = [{ id: -1 }, { id: -2 }, { id: -3 }]; //for testing only
const URL_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/";

const promise = axios.get(
    "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
);
promise.then(printQuizzes);

function printQuizzes(response) {
    // printUserQuizzes();
    printNonUserQuizzes(response);
}

function printUserQuizzes() {
    storedUserQuizzes.forEach((element) => {
        userQuizzesHtmlClass += `

        <article class="home_quizz" onclick="openQuizzView()">
            <img src="${element.image}" alt="">
            <div class="home_quizz_gradient"></div>
            <p>${element.title}</p>
        </article>
        `;
    });
}

function printNonUserQuizzes(response) {
    let nonUserQuizzesList = response.data.filter(filterUserQuizzes);
    // console.log(nonUserQuizzesList)
    nonUserQuizzesList.forEach((element) => {
        nonUserQuizzesHtmlCLass.innerHTML += `

        <article class="home_quizz" onclick = "openQuizzView('${element.id}')" >
            <img src="${element.image}" alt="">
            <div class="home_quizz_gradient"></div>
            <p>${element.title}</p>
        </article>
        `;
    });
}

function filterUserQuizzes(generalQuizz) {
    if (1 === 1) {
        return true;
    }

    // let comparingArray = [];
    // storedUserQuizzes.forEach(userQuizz => {
    //     // console.log("user quizz id: " + userQuizz.id)
    //     if (generalQuizz.id !== userQuizz.id) {
    //         comparingArray.push(true);
    //     }
    //     console.log(comparingArray)
    // });

    // if(){

    // }
}

function openQuizzView(quizzId) {
    document.querySelector(".home").classList.toggle("hidden");
    document.querySelector(".quizz-view").classList.toggle("hidden");

    let quizz = axios.get(`${URL_API}quizzes/${quizzId}`).then(buildQuizzView);
}

function buildQuizzView(response) {
    const quizzData = response.data;
    console.log(quizzData);
    renderQuizBanner(quizzData);
}

function renderQuizBanner(quizz) {
    const banner = document.querySelector(".banner");
    banner.innerText = quizz.title;
    banner.style.setProperty("background-image", `url(${quizz.image})`);
}
