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

let quizzLevels = null;
let correctAnswerCount = 0;
let questionsAnswered = 0;
let totalQuestions = 0;
let selectedQuizzId = null;

let numberOfQuestions;
let numberOfLevels = 0;
let inputValidation = [];
let wrongAnswersList = [];
let wrongImagesList = [];

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
    selectedQuizzId = quizzId;
    document.querySelector(".home").classList.add("hidden");
    document.querySelector(".quizz-view").classList.remove("hidden");

    let quizz = axios.get(`${URL_API}quizzes/${quizzId}`).then(buildQuizzView);
}

function buildQuizzView(response) {
    const quizzData = response.data;
    totalQuestions = quizzData.questions.length;
    console.log(quizzData);
    quizzLevels = [...quizzData.levels];
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
            <h1 class="title"></h1>
            <div class="answers"></div>
        </div>`;
        renderQuestion(element, i);
    });

    main.innerHTML += `
    <div class="quizz-result">
    </div>
    `;
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
    questionsAnswered++;
    element.children[0].classList.add("chosen");
    question[questionIndex].classList.add("selected");
    if (isCorrectAnswer) {
        correctAnswerCount++;
    }
    if (questionsAnswered === totalQuestions) {
        setTimeout(renderResult, 1000);

        // FIX: scrol into view error
    } else {
        setTimeout(() => {
            let index = parseInt(questionIndex) + 1;
            question[index].scrollIntoView();
        }, 1000);
    }
}

function objectLevelCompare(a, b) {
    if (a.minValue < b.minValue) {
        return -1;
    }
    if (a.minValue > b.minValue) {
        return 1;
    }
    return 0;
}

function restartData() {
    questionsAnswered = 0;
    correctAnswerCount = 0;
    totalQuestions = 0;
    quizzLevels = null;
}

function backToHome() {
    restartData();
    document.querySelector(".quizz-view_main").remove();
    document.querySelector(
        ".quizz-view"
    ).innerHTML += `<div class="quizz-view_main"></div>`;
    document.querySelector(".quizz-view").classList.toggle("hidden");
    document.querySelector(".home").classList.toggle("hidden");
    document.querySelector(".home_quizz").scrollIntoView();
}

function restartQuizz() {
    document.querySelector(".quizz-view_main").remove();
    document.querySelector(
        ".quizz-view"
    ).innerHTML += `<div class="quizz-view_main"></div>`;
    restartData();
    openQuizzView(selectedQuizzId);
}

function renderResult() {
    const result = Math.round((correctAnswerCount / totalQuestions) * 100);
    const mainColumn = document.querySelector(".quizz-view_main");
    const resultArea = document.querySelector(".quizz-result");
    resultArea.classList.add("show");

    let myLevel = quizzLevels[0];
    quizzLevels = quizzLevels.sort(objectLevelCompare);

    for (let i = 0; i < quizzLevels.length; i++) {
        if (result < quizzLevels[i].minValue) {
            break;
        }
        myLevel = quizzLevels[i];
    }
    console.log(myLevel);

    resultArea.innerHTML = `
    <h1 class="title">${result}% de acerto: ${myLevel.title}</h1>
    <img src="${myLevel.image}">
    <p>${myLevel.text}</p>
    `;

    mainColumn.innerHTML += `
    <div class="nav-box">
        <button onclick="restartQuizz()" class="restart">Reiniciar Quizz</button>
        <button onclick="backToHome()">Voltar para a home</button>
    </div>
    `;

    // FIX: scroll not working
    resultArea.scrollIntoView();
}

function openQuestionsScreen() {
    let quizzvalidation = [];
    testBasicInfos();
    resultOfTestingQuizzInfos = inputValidation;
    quizzvalidation = resultOfTestingQuizzInfos.filter(
        (element) => element === false
    );

    if (quizzvalidation.length === 0) {
        document
            .querySelector(".quizz-form_basic-info-screen")
            .classList.toggle("hidden");
        document
            .querySelector(".quizz-form_questions-screen")
            .classList.toggle("hidden");

        saveNumberOfQuestionsInfo();
        loadQuestionScreen();
    } else {
        alert(
            "Parece que algo deu errado! Por favor,verifique se todos os campos estão preenchidos corretamente."
        );
    }
}

function testBasicInfos() {
    inputValidation = [];
    quizzInformation.title = document.querySelector(
        ".quizz-form_basic-info-screen_quizz-title"
    ).value;
    quizzInformation.image = document.querySelector(
        ".quizz-form_basic-info-screen_url-image"
    ).value;
    numberOfQuestions = parseInt(
        document.querySelector(
            ".quizz-form_basic-info-screen_number-of-questions"
        ).value
    );
    numberOfLevels = parseInt(
        document.querySelector(".quizz-form_basic-info-screen_number-of-levels")
            .value
    );

    testQuizzTitle(quizzInformation.title);
    testUrlImage(quizzInformation.image);
    testNumberOfQuestions(numberOfQuestions);
    testNumberOfLevels(numberOfLevels);
}

function testQuizzTitle(quizzTitle) {
    if (quizzTitle.length >= 20 && quizzTitle.length <= 65) {
        inputValidation.push(true);
    } else {
        inputValidation.push(false);
    }
}

function testUrlImage(urlImage) {
    if (typeof urlImage !== "string") {
        urlImage = urlImage.value;
    }

    if (
        urlImage.slice(0, 8) === "https://" &&
        (urlImage.slice(-4) === ".png" ||
            urlImage.slice(-4) === ".jpg" ||
            urlImage.slice(-5) === ".jpeg" ||
            urlImage.slice(-4) === ".gif")
    ) {
        inputValidation.push(true);
    } else {
        inputValidation.push(false);
    }
}

function testNumberOfQuestions(numberOfQuestions) {
    if (numberOfQuestions >= 3) {
        inputValidation.push(true);
    } else {
        inputValidation.push(false);
    }
}

function testNumberOfLevels(numberOfLevels) {
    if (numberOfLevels >= 2) {
        inputValidation.push(true);
    } else {
        inputValidation.push(false);
    }
}

function saveNumberOfQuestionsInfo() {
    quizzInformation.questions = [];
    for (let i = 0; i < numberOfQuestions; i++) {
        quizzInformation.questions.push({ ...quizzQuestion });
        quizzInformation.questions[i].answers.push({ ...quizzAnswer });

        //Por algum motivo que ainda não consigo entender estão sendo feitos 4 pushs ao mesmo
        //tempo ou algo assim na linha 380.

        // Vanin: por alguma razão quando vc faz o push com ...obj duas vezes, um dentro de outro objeto, como vc tá fzendo,
        // aquele bug que a gente tava tendo volta a acontecer 😔, por isso que vc tá experienciando isso, de novo... testei pelo console
        // também não sei como resolver 😔
    }
}

function loadQuestionScreen() {
    const questionListHtmlClass = document.querySelector(
        ".quizz-form_questions-screen_question-list"
    );
    for (let i = 1; i <= numberOfQuestions; i++) {
        questionListHtmlClass.innerHTML += `
        
        <div class="quizz-form_questions-screen_question-num">
            <p>Pergunta ${i}</p>
            <input type="text" placeholder="Texto da pergunta" class="question-text">
            <input type="text" placeholder="Cor de fundo da pergunta" class="question-color">
            <p>Resposta correta</p>
            <input type="text" placeholder="Resposta correta" class="question-right-answer-text">
            <input type="text" placeholder="URL da imagem" class="question-right-answer-image">
            <p>Respostas incorretas</p>
            <div class="quizz-form_questions-screen_wrong-answer1">
                <input type="text" placeholder="Resposta incorreta 1" class="question-wrong-answer1-text">
                <input type="text" placeholder="URL da imagem 1" class="question-wrong-answer1-image">
            </div>
            <div class="quizz-form_questions-screen_wrong-answer2">
                <input type="text" placeholder="Resposta incorreta 2" class="question-wrong-answer2-text">
                <input type="text" placeholder="URL da imagem 2" class="question-wrong-answer2-image">
            </div>
            <div class="quizz-form_questions-screen_wrong-answer3">
                <input type="text" placeholder="Resposta incorreta 3" class="question-wrong-answer3-text">
                <input type="text" placeholder="URL da imagem 3" class="question-wrong-answer3-image">
            </div>
        </div>
        `;
    }
}

function renderEndScreen() {
    document.querySelector(".quizz-form_end-screen").classList.remove("hidden");
}

function openLevelsScreen() {
    let questionsValidation = [];
    testQuestionsInfos();
    resultOfTestingQuizzInfos = inputValidation;
    questionsValidation = resultOfTestingQuizzInfos.filter(
        (element) => element === false
    );
    console.log(questionsValidation);
    if (questionsValidation.length === 0) {
        document
            .querySelector(".quizz-form_questions-screen")
            .classList.toggle("hidden");
        document
            .querySelector(".quizz-form_levels-screen")
            .classList.toggle("hidden");
        renderLevelsScreen();
    } else {
        alert(
            "Parece que algo deu errado! Por favor,verifique se todos os campos estão preenchidos corretamente."
        );
    }
}

function saveLevelsInformation() {
    quizzInformation.levels = [];
    let validationError = false;
    let levels = [...document.querySelectorAll(".inputs-field")];
    const levelsForm = { ...quizzLevel };
    levels.forEach((level) => {
        let inputs = [...level.querySelectorAll("input, textarea")];
        inputs.forEach((input, idx) => {
            if (input.value === "") {
                validationError = true;
            }
        });
        if (!validationError) {
            levelsForm.title = inputs[0].value;
            levelsForm.image = inputs[1].value;
            levelsForm.minValue = inputs[2].value;
            levelsForm.text = inputs[3].value;
            quizzInformation.levels.push({ ...levelsForm });
        }
    });
    if (validationError) {
        alert(
            "Parece que algo deu errado! Por favor,verifique se todos os campos estão preenchidos corretamente."
        );
        return;
    }
    document.querySelector(".quizz-form_levels-screen").classList.add("hidden");
    renderEndScreen();
}

function toggleLevelForm(idx) {
    const element = document.querySelectorAll(".level-form")[idx];
    const inputField = element.querySelector(".inputs-field");
    element.querySelector("ion-icon").classList.toggle("hidden");
    inputField.classList.toggle("hidden");
}

function renderLevelsScreen() {
    let levelScreen = document.querySelector(".quizz-form_levels-screen_main");
    if (numberOfLevels === 0) {
        numberOfLevels = 3;
    }
    levelScreen.innerHTML += ``;
    for (let i = 0; i < numberOfLevels; i++) {
        levelScreen.innerHTML += `
        <div class="level-form">
        <h1 onclick="toggleLevelForm(${i})"><span>Nível ${
            i + 1
        }</span><ion-icon name="create-sharp"></ion-icon></h1>
        <div class="inputs-field hidden">
            <input type="text" placeholder="Título do nível">
            <input type="number" placeholder="% mínima de acertos">
            <input type="url" placeholder="URL da imagem do nível">
            <textarea placeholder="Describe yourself here..."></textarea>
        </div>
        `;
    }

    levelScreen.innerHTML += `
    <div class="nav-box">
        <button onclick="saveLevelsInformation()" class="restart">Finalizar Quizz</button>
    </div>
    `;
}

function testQuestionsInfos() {
    inputValidation = [];
    let questionsText = [...document.querySelectorAll(".question-text")];
    let questionsColors = [...document.querySelectorAll(".question-color")];
    let rigthAnswerText = [
        ...document.querySelectorAll(".question-right-answer-text"),
    ];
    let rigthAnswerImage = [
        ...document.querySelectorAll(".question-right-answer-image"),
    ];

    let wrongAnswer1Text = [
        ...document.querySelectorAll(".question-wrong-answer1-text"),
    ];
    let wrongAnswer1Image = [
        ...document.querySelectorAll(".question-wrong-answer1-image"),
    ];

    let wrongAnswer2Text = [
        ...document.querySelectorAll(".question-wrong-answer2-text"),
    ];
    let wrongAnswer2Image = [
        ...document.querySelectorAll(".question-wrong-answer2-image"),
    ];

    let wrongAnswer3Text = [
        ...document.querySelectorAll(".question-wrong-answer3-text"),
    ];
    let wrongAnswer3Image = [
        ...document.querySelectorAll(".question-wrong-answer3-image"),
    ];

    let wrongAnswerText = [
        wrongAnswer1Text,
        wrongAnswer2Text,
        wrongAnswer3Text,
    ];
    let wrongAnswerImage = [
        wrongAnswer1Image,
        wrongAnswer2Image,
        wrongAnswer3Image,
    ];

    testQuestionText(questionsText);
    testQuestionColors(questionsColors);
    rigthAnswerText.forEach(testRigthAnswerText);
    rigthAnswerImage.forEach(testUrlImage);
    testWrongAnswers(wrongAnswerText, wrongAnswerImage);
    rigthAnswerImage.forEach(testUrlImage);

    saveQuestionsInformation(questionsText, questionsColors);
}

function testQuestionText(questionsText) {
    questionsText.forEach((input) => {
        if (input.value.length >= 20) {
            inputValidation.push(true);
        } else {
            inputValidation.push(false);
        }
    });
}

function testQuestionColors(questionsColors) {
    const regex = /[0-9a-f]/;
    questionsColors.forEach((input) => {
        let resultOfColorFormat = regex.exec(input.value.slice(1));
        if (
            input.value[0] === "#" &&
            resultOfColorFormat.input.length === 6 &&
            input.value.length === 7
        ) {
            inputValidation.push(true);
        } else {
            inputValidation.push(false);
        }
    });
}

function testRigthAnswerText(answerText) {
    if (answerText.value !== "") {
        inputValidation.push(true);
    } else {
        inputValidation.push(false);
    }
}

function testWrongAnswers(wrongAnswerText, wrongAnswerImage) {
    let answerComparison = [];
    let imageComparison = [];
    let wrongAnswerValidation = [];

    for (let i = 0; i < numberOfQuestions; i++) {
        wrongAnswerText.forEach((answer) => {
            answerComparison.push(answer[i]);
        });

        wrongAnswerImage.forEach((image) => {
            imageComparison.push(image[i]);
            if (image[i].value !== "") {
                testUrlImage(image[i]);
            }
        });

        answerComparison.forEach((answerText) => {
            if (answerText.value !== "") {
                wrongAnswerValidation.push(true);
            } else {
                wrongAnswerValidation.push(false);
            }
        });

        for (let j = 0; j < 3; j++) {
            if (
                (imageComparison[j].value === "" &&
                    answerComparison[j].value !== "") ||
                (imageComparison[j].value !== "" &&
                    answerComparison[j].value === "")
            ) {
                inputValidation.push(false);
            }
        }

        let answerValidation = wrongAnswerValidation.filter(
            (element) => element === true
        );

        if (answerValidation.length !== 0) {
            inputValidation.push(true);
        } else {
            inputValidation.push(false);
        }

        wrongAnswersList.push([...answerComparison]);
        wrongImagesList.push([...imageComparison]);
        for (let i = 0; i < wrongAnswersList.length; i++) {
            wrongAnswersList[i] = wrongAnswersList[i].filter(filterEmptyInputs);
            wrongImagesList[i] = wrongImagesList[i].filter(filterEmptyInputs);
        }
        answerComparison = [];
        imageComparison = [];
    }
}

function filterEmptyInputs(wrongInput) {
    if (wrongInput.value !== "") {
        return wrongInput;
    }
}

function saveQuestionsInformation(questionsText, questionsColors) {
    for (let i = 0; i < numberOfQuestions; i++) {
        quizzInformation.questions[i].title = questionsText[i].value;
        quizzInformation.questions[i].color = questionsColors[i].value;

        saveWrongAnswersInformation(i);
    }
}

function saveWrongAnswersInformation(i) {
    for (let j = 0; j < wrongAnswersList[i].length; j++) {
        quizzInformation.questions[i].answers.push({ ...quizzAnswer });
    }

    for (let j = 0; j < wrongAnswersList[i].length; j++) {
        console.log(wrongAnswersList[i].length);
        console.log(quizzInformation.questions[i].answers[j + 1]);
        console.log(wrongAnswersList[j]);

        quizzInformation.questions[i].answers[j + 1].text =
            wrongAnswersList[j][0].value;
        quizzInformation.questions[i].answers[j + 1].image =
            wrongImagesList[j][0].value;
    }
}
