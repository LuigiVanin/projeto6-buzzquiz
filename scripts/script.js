let quizzInformation = {
    title: "",
    image: "",
    questions: [],
    levels: [],
};

let quizzQuestion = {
    title: "",
    color: "",
    answers: [],
};

let quizzAnswer = {
    text: "",
    image: "",
    isCorrectAnswer: false,
};

let quizzLevel = {
    title: "",
    image: "",
    text: "",
    minValue: 0,
};

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
let numberOfQuestions;
let numberOfLevels;

const promise = axios.get(`${URL_API}quizzes`);
promise.then(printQuizzes);

function printQuizzes(response) {
    // printUserQuizzes();
    printNonUserQuizzes(response);
}

function printUserQuizzes() {
    if (storedUserQuizzes.length !== 0) {
        document.querySelector(".home_created-quizzes_list").classList.toggle("hidden");
        document.querySelector(".home_no-quizzes-created").classList.toggle("hidden");
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
    console.log("aqui");
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

function openQuestionsScreen() {
    let quizzvalidation = [];
    let resultOfTestingQuizzInfos = testBasicInfos();
    quizzvalidation = resultOfTestingQuizzInfos.filter(
        (element) => element === false
    );

    if (quizzvalidation.length === 0) {
        document.querySelector(".quizz-form_basic-info-screen").classList.toggle("hidden");
        document.querySelector(".quizz-form_questions-screen").classList.toggle("hidden");

        console.log(numberOfQuestions)
        loadQuestionScreen();
    } else {
        alert("Parece que algo deu errado! Por favor,verifique se todos os campos estão preenchidos corretamente.");
    }
}

function testBasicInfos() {
    let inputValidation = [];
    quizzInformation.title = document.querySelector(".quizz-form_basic-info-screen_quizz-title").value;
    quizzInformation.image = document.querySelector(".quizz-form_basic-info-screen_url-image").value;
    numberOfQuestions = parseInt(document.querySelector(".quizz-form_basic-info-screen_number-of-questions").value);
    numberOfLevels = parseInt(document.querySelector(".quizz-form_basic-info-screen_number-of-levels").value);

    testQuizzTitle(inputValidation, quizzInformation.title);
    testUrlImage(inputValidation, quizzInformation.image);
    testNumberOfQuestions(inputValidation, numberOfQuestions);
    testNumberOfLevels(inputValidation, numberOfLevels);

    return inputValidation;
}

function testQuizzTitle(inputValidation, quizzTitle) {
    if (quizzTitle.length >= 20 && quizzTitle.length <= 65) {
        inputValidation.push(true);
    } else {
        inputValidation.push(false);
    }
}

function testUrlImage(inputValidation, urlImage) {
    if (urlImage.slice(0, 8) === "https://" && (urlImage.slice(-4) === ".png" || urlImage.slice(-4) === ".jpg" || urlImage.slice(-5) === ".jpeg" || urlImage.slice(-4) === ".gif")
    ) {
        inputValidation.push(true);
    } else {
        inputValidation.push(false);
    }
}

function testNumberOfQuestions(inputValidation, numberOfQuestions) {
    if (numberOfQuestions >= 3) {
        inputValidation.push(true);
    } else {
        inputValidation.push(false);
    }
}

function testNumberOfLevels(inputValidation, numberOfLevels) {
    if (numberOfLevels >= 2) {
        inputValidation.push(true);
    } else {
        inputValidation.push(false);
    }
}

function loadQuestionScreen(){
    const questionListHtmlClass = document.querySelector(".quizz-form_questions-screen_question-list");
    console.log(questionListHtmlClass)
    for (let i = 1; i <= numberOfQuestions; i++){
        console.log("Entrei")
        questionListHtmlClass.innerHTML +=`
        
        <div class="quizz-form_questions-screen_question-num">
            <p>Pergunta ${i}</p>
            <input type="text" placeholder="Texto da pergunta">
            <input type="text" placeholder="Cor de fundo da pergunta">
            <p>Resposta correta</p>
            <input type="text" placeholder="Resposta correta">
            <input type="text" placeholder="URL da imagem">
            <p>Respostas incorretas</p>
            <div class="quizz-form_questions-screen_wrong-answer">
                <input type="text" placeholder="Resposta incorreta 1">
                <input type="text" placeholder="URL da imagem 1">
            </div>
            <div class="quizz-form_questions-screen_wrong-answer">
                <input type="text" placeholder="Resposta incorreta 2">
                <input type="text" placeholder="URL da imagem 2">
            </div>
            <div class="quizz-form_questions-screen_wrong-answer">
                <input type="text" placeholder="Resposta incorreta 3">
                <input type="text" placeholder="URL da imagem 3">
            </div>
        </div>
        `
    }
}
