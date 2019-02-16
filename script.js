'use strict';

// uppgifterna från API
// https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple
// detalierad options for quiz-request
let amount; // siffran // antal av frågor åt gången
let categoryId; // siffran
let category = `&category=${categoryId}`;
let difficultyId; // 'easy' || 'medium' || 'hard'
let difficulty = `&difficulty=${difficultyId}`;
let typeId; // 'multiple' || 'boolean'
let type = `&type=${typeId}`;

//request token

let urlToken = 'https://opentdb.com/api_token.php?command=request';
let tokenId; // coden 'cb83c8f2ed245b168136fdd16b251dee0c85d37cb132fccbe3ee303294db5330'
let token = `&token=${tokenId}`;

// questions request
let urlRequest = `https://opentdb.com/api.php?amount=${amount}${category}${category}${category}${token}`;

// reset session token
let urlResetSession = `https://opentdb.com/api_token.php?command=reset${token}`;
//