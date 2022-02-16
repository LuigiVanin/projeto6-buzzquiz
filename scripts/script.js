const userQuizzesHtmlClass = document.querySelector(".home_created-quizzes");
const nonUserQuizzesHtmlCLass = document.querySelector(".home_non-user-quizzes");
// const storedUserQuizzes = JSON.parse(localStorage.getItem("userQuizz"));
const storedUserQuizzes = [{ id: -1 }, { id: -2 }, { id: -3 }]; //for testing only

const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes")
promise.then(printQuizzes);

function printQuizzes(response) {
    // printUserQuizzes();
    printNonUserQuizzes(response);
}

function printUserQuizzes() {
    storedUserQuizzes.forEach(element => {
        userQuizzesHtmlClass += `

        <article class="home_quizz" onclick="openQuizzView()">
            <img src="${element.image}" alt="">
            <div class="home_quizz_gradient"></div>
            <p>${element.title}</p>
        </article>
        `
    });
}

function printNonUserQuizzes(response) {
    let nonUserQuizzesList = response.data.filter(filterUserQuizzes);
    // console.log(nonUserQuizzesList)
    nonUserQuizzesList.forEach(element => {
        nonUserQuizzesHtmlCLass.innerHTML += `

        <article class="home_quizz" onclick = "openQuizzView()" >
            <img src="${element.image}" alt="">
            <div class="home_quizz_gradient"></div>
            <p>${element.title}</p>
        </article>
        `
    });
}

function filterUserQuizzes(generalQuizz) {
    // if (1 === 1) {
    //     return true;
    // }

    let comparingArray = [];
    storedUserQuizzes.forEach(userQuizz => {
        // console.log("user quizz id: " + userQuizz.id)
        if (generalQuizz.id !== userQuizz.id) {
            comparingArray.push(true);
        }
        console.log(comparingArray)
    });
    
    if(){
        
    }
}


function openQuizzView() {
    document.querySelector(".home").classList.toggle("hidden");
    document.querySelector(".quizz-view").classList.toggle("hidden");
}
