'use strict';
//
// INITIAL CONDITIONS //
//debugger;
let vBody = document.body;
let vHeader = document.querySelector('header');
vBody.appendChild(vHeader);
let vMain = document.createElement('div');
vMain.className = ('main');
vBody.appendChild(vMain);
let startButton = document.createElement('button');


let checkButton = document.createElement('button');

let correctAnswer = [];
let checkedAnswer = [];
let score = 0;
// url Request variables settings
let amountInput = 9; // förbered för om usr kontrollera antal av frågor
let amount; // siffran // antal av frågor åt gången
let categoryId; // siffran
let category;
let difficultyId;// 'easy' || 'medium' || 'hard'
let difficulty;
let typeId; // 'multiple' || 'boolean'
let type;
//url for request token
const urlToken = 'https://opentdb.com/api_token.php?command=request'; 
let tokenId; // coden exempel 'cb83c8f2ed245b168136fdd16b251dee0c85d37cb132fccbe3ee303294db5330'
let token;
// url for reset session token
let urlResetSession = `https://opentdb.com/api_token.php?command=reset${token}`; 
// main url request questions variable
let urlRequest;
//
//MAIN PROGRAM EXECUTION//
createStartButton();
//transitionToStart();

//
function ajaxGet (url,myFunction,asyncBool){
 console.log(url);
 let req = new XMLHttpRequest();
 req.open('GET',url,asyncBool);
 req.addEventListener('load',()=>{
  if (req.status >= 200 && req.status < 400) {
   //console.log(req.responseText);
   myFunction(req.responseText);
  }else{
   console.log(req.status +" "+ req.statusText);
  }
 });
 req.addEventListener('error',()=>{console.log('Förfrågan lyckades inte nå serven');});
 req.send(null);
};
//
//
function getTokenId (dataIn){
 console.log(dataIn);
 let data = JSON.parse(dataIn);
 tokenId = data.token;
 token = `&token=${tokenId}`;
};
//
//
function setupUrlApiReqQuiz () {
 //debugger;
 if(!!amountInput === false){
  amount = 10// default 10 questions
 }else{
   amount = amountInput;
 };
 //
 if (!!categoryId === false) {
  category = '';
 }else {
   category = `&category=${categoryId}`;
 };
 //
 if (!!difficultyId === false) {
  difficulty ='';
 }else{
   difficulty = `&difficulty=${difficultyId}`;
 };
 //
 if (!!typeId === false) {
  type ='';
 }else{
   type = `&type=${typeId}`;
 };
 //
 urlRequest = `https://opentdb.com/api.php?amount=${amount}${category}${difficulty}${type}${token}`;
 console.log(urlRequest);
};
//
function renderQuiz (dataIn){
 console.log(dataIn);
 let data = JSON.parse(dataIn);
 console.log(data);
 let numQuestion = 1;
 let score = 0;
 correctAnswer = [];
 //
 //console.log(`API server have returned code ${data.response_code}`);
 serverResponseCodes(data.response_code);
 //
 //
 for (let i of data.results) {
  //
  let vForm = document.createElement('div');
  vForm.className = 'mdc-form-field';
  vMain.appendChild(vForm);
  console.log(i.question);
  let vP = document.createElement('p');
  vP.setAttribute('id',`question${numQuestion}`);
  vP.innerHTML = i.question;
  vForm.appendChild(vP);
  let numAnswer = 1;
  //vi ska läga till alla optioner på en array, senare man ska använda arrayen för undvika att korrekta svar ska ligga på samman plats.
  let answersArr = [];
  answersArr.push(i.correct_answer); // för att rendera
  correctAnswer.push(i.correct_answer); // för kontrollera resultatet
  for (let j of i.incorrect_answers) {
   answersArr.push(j);
  };
  //
  console.log(answersArr);// här har vi alla svar.
  shuffle(answersArr);// blanda svar optioner
  console.log(answersArr);// visa nya svar position 
  //
  for (let answ of answersArr) {
   let vMdcRadio = document.createElement('div');
   vMdcRadio.className = 'mdc-radio';
   let vInput = document.createElement('input');
   vInput.className = 'mdc-radio__native-control';
   vInput.setAttribute('type','radio');
   vInput.setAttribute('id', `answer${numQuestion}-${numAnswer}`);
   vInput.setAttribute('name', `radio${numQuestion}`);
   vInput.setAttribute('value', answ);
   let vDivRadioBak = document.createElement('div');
   vDivRadioBak.className = 'mdc-radio__background';
   let vDivRadioOuter = document.createElement('div');
   vDivRadioOuter.className = 'mdc-radio__outer-circle';
   let vDivRadioInner = document.createElement('div');
   vDivRadioInner.className = 'mdc-radio__inner-circle';
   let vLabel = document.createElement('label');
   vLabel.setAttribute('for',`answer${numQuestion}-${numAnswer}`);
   vLabel.innerHTML = answ;
   vForm.appendChild(vMdcRadio);
   vMdcRadio.appendChild(vInput);
   vMdcRadio.appendChild(vDivRadioBak);
   vDivRadioBak.appendChild(vDivRadioOuter);
   vDivRadioBak.appendChild(vDivRadioInner);
   vForm.appendChild(vLabel);
   numAnswer++;
  };
  numQuestion++;
 };
 createSubmitButton();
 vMain.appendChild(checkButton);
};
//
//
function serverResponseCodes (code){
 switch (code) {
  case 1:
   console.error("Code 1: No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)");
  break;
  case 2:
   console.error("Code 2: Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)");
  break;
  case 3:
   console.error("Code 3: Token Not Found Session Token does not exist.");
  break;
  case 4:
   console.error("Code 4: Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.");
  break;
  default:
   console.log("Code 0: Success Returned results successfully.");
   break;
 }
};
//
//
function shuffle(array){
  let currentIndex = array.length, temporaryValue, randomIndex;
  // Om det finns elemet att blanda..
  while (0 !== currentIndex) {
    // Seleccionar un elemento sin mezclar...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // E intercambiarlo con el elemento actual
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};
//
//
function createStartButton(){
 startButton.setAttribute('id','startButton');
 startButton.innerHTML = 'START';
 vMain.appendChild(startButton);
 startButton.addEventListener('click',mainProgram);
};

function mainProgram () {
  //e.stopPropagation();
  //e.preventDefault();
  // Get new Session Spel 'Token' Not Assync for garantera Token innan börjar spel.
  ajaxGet(urlToken,getTokenId,false);
  //
  //Controlled request with usr specifications
  setupUrlApiReqQuiz();
  //
  console.log(token);
  //
  // View Questions
  ajaxGet(urlRequest,renderQuiz,true);
  //
  
  transitionToQuiz();

  // body... 

}
//
function createSubmitButton(){
 checkButton.setAttribute('id','checkButton');
 checkButton.innerHTML = 'Submit Answers';
 checkButton.addEventListener('click',resultTest);
};

function resultTest () {
  getAnswers();
  controlResultat(correctAnswer,checkedAnswer);
  //transitionToStart(); 
};
//
function getAnswers (){
  let vAllInputNode = document.querySelectorAll("input");
  let inputArr = Array.from(vAllInputNode);
  checkedAnswer = [];

  //controlar si el numero de checked es igual al amount de questions
  for (let i  of inputArr) {
   console.log("aaaa");
   if(i.checked === true){
    console.log(i.value);
    checkedAnswer.push(i.value);

   }else{
    continue;
   }
  };
};
//
function transitionToQuiz () {
 startButton.removeEventListener('click',mainProgram);
 vMain.removeChild(startButton);
}

//
function transitionToStart () {
 checkButton.removeEventListener('click',resultTest);  
 let clsElements = document.querySelectorAll('.mdc-form-field, #checkButton');
 for (let i of clsElements){
  vMain.removeChild(i);
 };
 //correctAnswer = [];
 createStartButton();
};

//
function controlResultat (correctAnswer,checkedAnswer) {
 console.log(checkedAnswer);
 console.log(correctAnswer);
 score = 0;
 //debugger;
 if(correctAnswer.length === checkedAnswer.length){
  for(let i = 0 ; i < checkedAnswer.length; i++){
   console.log(checkedAnswer[i]);
   console.log(correctAnswer[i]);
   if(checkedAnswer[i] === correctAnswer[i] ){
    score++;
   }else{
    continue;
   }
  };
  console.log(`du har fåt ${score} bra svar av ${correctAnswer.length}`);
  
  
  //aqui ocurirrira el modal dialog !!!!******************
  transitionToStart();
 }else{
  //debugger;
  alert('chek att all frågor har ensvar och trycka submit igen');
 };
 
 
 
 //transitionToStart();
};
//

