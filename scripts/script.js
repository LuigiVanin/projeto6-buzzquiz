const userQuizzesHtmlClass = document.querySelector(
    ".home_created-quizzes_list"
);
const nonUserQuizzesHtmlCLass = document.querySelector(
    ".home_non-user-quizzes"
);
// const storedUserQuizzes = JSON.parse(localStorage.getItem("userQuizz"));
const storedUserQuizzes = [{ id: -1 }, { id: -2 }, { id: -3 }]; //for testing only
const URL_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/";

let correctAnswerCount = 0;
let totalQuestions = 0;
const promise = axios.get(`${URL_API}quizzes`);
promise.then(printQuizzes);

function printQuizzes(response) {
    // printUserQuizzes();
    printNonUserQuizzes(response);
}

function printUserQuizzes() {
    if (storedUserQuizzes.length !== 0) {
        document
            .querySelector(".home_created-quizzes_list")
            .classList.toggle("hidden");
        document
            .querySelector(".home_no-quizzes-created")
            .classList.toggle("hidden");
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
}

function printNonUserQuizzes(response) {
    console.log(response.data);
    let nonUserQuizzesList = response.data.filter(filterUserQuizzes);
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
    let comparingArray = [];
    storedUserQuizzes.forEach((userQuizz) => {
        if (generalQuizz.id !== userQuizz.id) {
            comparingArray.push(true);
        } else {
            comparingArray.push(false);
        }
    });

    let resultOfComparison = comparingArray.filter(
        (element) => element === false
    );
    if (resultOfComparison.length === 0) {
        return true;
    } else {
        return false;
    }
}

function openQuizzForm() {
    document.querySelector(".home").classList.toggle("hidden");
    document.querySelector(".quizz-form").classList.toggle("hidden");
}

function openQuizzView(quizzId) {
    document.querySelector(".home").classList.toggle("hidden");
    document.querySelector(".quizz-view").classList.toggle("hidden");

    let quizz = axios.get(`${URL_API}quizzes/${quizzId}`).then(buildQuizzView);
}

function buildQuizzView(response) {
    const quizzData = response.data;
    totalQuestions = quizzData.questions.length;
    console.log(quizzData);
    renderQuizzBanner(quizzData);
    renderQuizzQuestions(quizzData.questions);
}

function renderQuizzBanner(quizz) {
    const banner = document.querySelector(".banner");
    banner.innerText = quizz.title;
    banner.innerHTML = ` <h1>${quizz.title}</h1>`;
    banner.style.setProperty("background-image", `url(${quizz.image})`);
}

function renderQuizzQuestions(questions) {
    // console.log(questions);
    const main = document.querySelector(".quizz-view_main");
    questions.forEach((element, i) => {
        main.innerHTML += `
        <div class="quizz-box">
            <h1 class="title">
            </h1>
            <div class="answers"></div>
        </div>`;
        renderQuestion(element, i);
    });
}

// TODO: reduzir o número de funções!
function renderQuestion(question, index) {
    const title = document.querySelectorAll(".quizz-box h1");
    title[index].innerHTML = question.title;
    title[index].style.setProperty("background", question.color);
    renderQuestionAnswers(question.answers, index);
}

function renderQuestionAnswers(answers, questionIndex) {
    // console.log(answers);
    const answersBox = document.querySelectorAll(".answers")[questionIndex];
    const randomAnswers = [...answers].sort(() => Math.random() - 0.5);
    randomAnswers.forEach((ans) => {
        let correctClass = "";
        if (ans.isCorrectAnswer) {
            correctClass = "correct";
        }
        answersBox.innerHTML += `
        <div class="answer" onclick="selectAnswer('${questionIndex}', ${ans.isCorrectAnswer}, this)">
            <div class="image"></div>
            <p class="${correctClass}">${ans.text}</p>
        </div>
        `;
        const image = document.querySelectorAll(".answer .image");
        image[image.length - 1].style.setProperty(
            "background-image",
            `url(${ans.image})`
        );
    });
    console.log(answersBox);
}

function selectAnswer(questionIndex, isCorrectAnswer, element) {
    const question = document.querySelectorAll(".quizz-box");
    if (question[questionIndex].classList.contains("selected")) {
        return;
    }
    element.children[0].classList.add("chosen");
    question[questionIndex].classList.add("selected");
    if (isCorrectAnswer) {
        correctAnswerCount++;
    }
    if (totalQuestions - 1 == questionIndex) {
        return;
    } else {
        setTimeout(() => {
            let index = parseInt(questionIndex) + 1;
            question[index].scrollIntoView();
        }, 1000);
    }
}
