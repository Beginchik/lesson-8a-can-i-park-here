import type { LexicalEntry } from "../types";

export type EntrySeed = [
  headword: string,
  partOfSpeech: string,
  transcription: string,
  definition: string,
  translation: string,
  exampleOne: string,
  exampleTwo: string
];

import { supplementalSeeds } from "./supplementalLexicon";
import { lesson1bSeeds } from "./lesson1bLexicon";
import { lesson1bSourceSeeds } from "./lesson1bSourceLexicon";
import { lesson8aSeeds } from "./lesson8aLexicon";

const seeds: EntrySeed[] = [
  ["hello", "exclamation", "/həˈləʊ/", "used when you meet or call someone", "привет; здравствуйте", "Hello, I'm Helen.", "Hello, are you Tom?"],
  ["hi", "exclamation", "/haɪ/", "an informal way to say hello", "привет", "Hi, I'm Mike.", "Hi, Anna. Nice to meet you."],
  ["nice to meet you", "expression", "/ˌnaɪs tə ˈmiːt juː/", "used when you meet someone for the first time", "приятно познакомиться", "Hello, I'm Tom. Nice to meet you.", "Nice to meet you too."],
  ["goodbye", "exclamation", "/ˌɡʊdˈbaɪ/", "used when you leave someone", "до свидания", "Goodbye, Tom.", "Goodbye. See you on Friday."],
  ["bye", "exclamation", "/baɪ/", "an informal way to say goodbye", "пока", "Bye. See you tomorrow.", "Bye, Helen."],
  ["see you", "expression", "/ˈsiː juː/", "used to say that you will meet someone again", "увидимся", "See you on Friday.", "Bye. See you tomorrow."],
  ["please", "adverb", "/pliːz/", "used to make a request polite", "пожалуйста", "A cappuccino, please.", "Three teas, please."],
  ["thanks", "exclamation", "/θæŋks/", "used to show that you are grateful", "спасибо", "Thanks, Tom.", "Your tea. — Thanks."],
  ["sorry", "exclamation", "/ˈsɒri/", "used when you make a mistake or cause a problem", "извините; простите", "Sorry, your name is Helen.", "I'm sorry. Is this your tea?"],
  ["name", "noun", "/neɪm/", "the word that people use to identify you", "имя", "What's your name?", "My name is Helen."],
  ["what's your name", "question", "/ˌwɒts jə ˈneɪm/", "a question used to ask a person's name", "как вас зовут?", "What's your name? — I'm Tom.", "Hello. What's your name?"],
  ["are you", "question form", "/ə ˈjuː/", "words used to start a question with you and the verb be", "вы…?; ты…?", "Are you Helen?", "Are you in class 2?"],
  ["yes", "adverb", "/jes/", "used to give a positive answer", "да", "Yes, I am.", "Yes, you are."],
  ["no", "adverb", "/nəʊ/", "used to give a negative answer", "нет", "No, I'm not.", "No, you aren't."],
  ["I", "pronoun", "/aɪ/", "the word a speaker uses to talk about themselves", "я", "I am Helen.", "I am in class 2."],
  ["you", "pronoun", "/juː/", "the person or people someone is speaking to", "ты; вы", "You are Tom.", "Are you Helen?"],
  ["am", "verb", "/æm/", "the form of be used with I", "есть; являюсь", "I am Helen.", "Am I in room 4?"],
  ["are", "verb", "/ɑː/", "the form of be used with you", "есть; являетесь", "You are Tom.", "Are you in class 2?"],
  ["I'm", "contraction", "/aɪm/", "the short form of I am", "я…; я являюсь", "I'm Helen.", "I'm not Tom."],
  ["you're", "contraction", "/jɔː/", "the short form of you are", "ты…; вы…", "You're Tom.", "You're in room 4."],
  ["aren't", "contraction", "/ɑːnt/", "the short form of are not", "не являетесь; не находитесь", "You aren't Tom.", "No, you aren't."],
  ["not", "adverb", "/nɒt/", "used to make a word or sentence negative", "не", "I'm not Helen.", "You are not in room 3."],
  ["and", "conjunction", "/ænd/", "used to join words or ideas", "и", "Helen and Tom are students.", "Monday and Tuesday are days."],
  ["your", "determiner", "/jɔː/", "belonging to the person being spoken to", "ваш; твой", "What's your name?", "Your cappuccino is here."],
  ["my", "determiner", "/maɪ/", "belonging to the speaker", "мой; моя", "My name is Helen.", "This is my tea."],
  ["a", "article", "/ə/", "used before one non-specific thing or person", "неопределённый артикль", "A cappuccino, please.", "I'm a student."],
  ["the", "article", "/ðə/", "used before a particular person or thing", "определённый артикль", "Watch the video.", "Write the numbers."],
  ["to", "preposition", "/tə/", "used before a place, person, or verb in many expressions", "к; чтобы", "Nice to meet you.", "Listen to the audio."],
  ["in", "preposition", "/ɪn/", "inside a place or during a period of time", "в", "I'm in class 2.", "Write in the box."],
  ["on", "preposition", "/ɒn/", "used with days and dates", "в; на", "See you on Friday.", "The book is on the table."],
  ["from", "preposition", "/frɒm/", "showing the place where someone or something starts", "из", "I'm from Russia.", "Where are you from?"],
  ["cappuccino", "noun", "/ˌkæpəˈtʃiːnəʊ/", "coffee made with hot milk and milk foam", "капучино", "A cappuccino, please.", "Your cappuccino is ready."],
  ["tea", "noun", "/tiː/", "a hot drink made with tea leaves and water", "чай", "A tea, please.", "Three teas, please."],
  ["coffee", "noun", "/ˈkɒfi/", "a dark drink made from roasted beans", "кофе", "I like coffee.", "A coffee, please."],
  ["like", "verb", "/laɪk/", "to think that someone or something is good", "нравиться; любить", "I like coffee.", "What do you like?"],
  ["I like", "expression", "/aɪ ˈlaɪk/", "words used to say that something is good for you", "мне нравится; я люблю", "I like pizza.", "I like apples, too."],
  ["what do you like", "question", "/ˌwɒt də ju ˈlaɪk/", "a question used to ask what someone enjoys", "что вам нравится?", "What do you like, Betty?", "What do you like to drink?"],
  ["pizza", "noun", "/ˈpiːtsə/", "a flat round food with cheese and other food on top", "пицца", "I like pizza.", "The pizza is good."],
  ["apple", "noun", "/ˈæpəl/", "a round fruit with red, green, or yellow skin", "яблоко", "This apple is green.", "I have an apple."],
  ["apples", "plural noun", "/ˈæpəlz/", "more than one apple", "яблоки", "I like apples.", "The apples are green."],
  ["banana", "noun", "/bəˈnɑːnə/", "a long yellow fruit", "банан", "This banana is yellow.", "I have a banana."],
  ["bananas", "plural noun", "/bəˈnɑːnəz/", "more than one banana", "бананы", "I like bananas.", "The bananas are yellow."],
  ["phone number", "noun", "/ˈfəʊn ˌnʌmbə/", "the numbers you use to call someone", "номер телефона", "What's your phone number?", "My phone number is 5 673 123."],
  ["address", "noun", "/əˈdres/", "the number and street name of a place", "адрес", "My address is 10 South Street.", "Write an example address."],
  ["too", "adverb", "/tuː/", "also", "тоже; также", "Nice to meet you, too.", "I like apples, too."],
  ["coffee shop", "noun", "/ˈkɒfi ʃɒp/", "a place where people buy coffee and simple food", "кофейня", "Helen is in a coffee shop.", "We meet at the coffee shop."],
  ["student", "noun", "/ˈstjuːdənt/", "a person who is learning", "ученик; студент", "I'm a student.", "The students practise together."],
  ["teacher", "noun", "/ˈtiːtʃə/", "a person who helps people learn", "учитель; преподаватель", "You're my teacher.", "Ask your teacher a question."],
  ["class", "noun", "/klɑːs/", "a lesson or a group of students who learn together", "занятие; класс", "I'm in class 2.", "What days are your English classes?"],
  ["room", "noun", "/ruːm/", "a part of a building with walls and a door", "комната; аудитория", "I'm in room 4.", "Are you in room 7?"],
  ["minute", "noun", "/ˈmɪnɪt/", "a period of sixty seconds", "минута", "Just a minute.", "The video is one minute long."],
  ["just a minute", "expression", "/ˌdʒʌst ə ˈmɪnɪt/", "used to ask someone to wait for a short time", "одну минуту", "Just a minute, please.", "Your coffee? Just a minute."],
  ["watch", "verb", "/wɒtʃ/", "to look at something for a period of time", "смотреть", "Watch the video.", "Watch the conversation again."],
  ["listen", "verb", "/ˈlɪsən/", "to pay attention to a sound", "слушать", "Listen and repeat.", "Listen to the numbers."],
  ["read", "verb", "/riːd/", "to look at and understand written words", "читать", "Read the conversations.", "Read the question again."],
  ["write", "verb", "/raɪt/", "to make letters or words on a surface", "писать", "Write the numbers.", "Write your name."],
  ["repeat", "verb", "/rɪˈpiːt/", "to say or do something again", "повторять", "Listen and repeat.", "Repeat the conversation."],
  ["practise", "verb", "/ˈpræktɪs/", "to do something again to improve your skill", "практиковаться", "Practise the conversation.", "Practise with another student."],
  ["choose", "verb", "/tʃuːz/", "to decide which person or thing you want", "выбирать", "Choose the correct answer.", "Choose a number."],
  ["match", "verb", "/mætʃ/", "to connect things that belong together", "сопоставлять", "Match the conversations to the photos.", "Match each word to a number."],
  ["complete", "verb", "/kəmˈpliːt/", "to add what is missing and finish something", "дополнять; завершать", "Complete the conversation.", "Complete your homework."],
  ["question", "noun", "/ˈkwestʃən/", "a sentence used to ask for information", "вопрос", "Ask a question.", "Read the question carefully."],
  ["answer", "noun", "/ˈɑːnsə/", "what you say or write in response to a question", "ответ", "Choose the correct answer.", "Check your answer."],
  ["correct", "adjective", "/kəˈrekt/", "right and without mistakes", "правильный", "Choose the correct photo.", "Your answer is correct."],
  ["conversation", "noun", "/ˌkɒnvəˈseɪʃən/", "a talk between two or more people", "разговор; диалог", "Read the conversation.", "Practise the conversation in pairs."],
  ["photo", "noun", "/ˈfəʊtəʊ/", "a picture made with a camera", "фотография", "Match the dialogue to the photo.", "Look at photo 2."],
  ["video", "noun", "/ˈvɪdiəʊ/", "moving pictures with sound", "видео", "Watch the video.", "Play the video again."],
  ["number", "noun", "/ˈnʌmbə/", "a word or symbol used for counting", "число; номер", "Write the number.", "Choose the next number."],
  ["next", "adjective", "/nekst/", "coming immediately after something", "следующий", "Say the next number.", "Open the next section."],
  ["day", "noun", "/deɪ/", "a period of twenty-four hours", "день", "Monday is a day of the week.", "What day is it today?"],
  ["week", "noun", "/wiːk/", "a period of seven days", "неделя", "There are seven days in a week.", "See you next week."],
  ["today", "adverb", "/təˈdeɪ/", "on this day", "сегодня", "What day is it today?", "Our class is today."],
  ["tomorrow", "adverb", "/təˈmɒrəʊ/", "on the day after today", "завтра", "See you tomorrow.", "Our class is tomorrow."],
  ["weekend", "noun", "/ˌwiːkˈend/", "Saturday and Sunday", "выходные", "Saturday and Sunday are the weekend.", "See you at the weekend."],
  ["Monday", "noun", "/ˈmʌndeɪ/", "the day after Sunday", "понедельник", "English class is on Monday.", "Monday is the first class day."],
  ["Tuesday", "noun", "/ˈtjuːzdeɪ/", "the day after Monday", "вторник", "See you on Tuesday.", "Tuesday is a class day."],
  ["Wednesday", "noun", "/ˈwenzdeɪ/", "the day after Tuesday", "среда", "Our class is on Wednesday.", "Wednesday is in the middle of the week."],
  ["Thursday", "noun", "/ˈθɜːzdeɪ/", "the day after Wednesday", "четверг", "See you on Thursday.", "Thursday comes before Friday."],
  ["Friday", "noun", "/ˈfraɪdeɪ/", "the day after Thursday", "пятница", "See you on Friday.", "Our class is on Friday."],
  ["Saturday", "noun", "/ˈsætədeɪ/", "the day after Friday", "суббота", "Saturday is at the weekend.", "See you on Saturday."],
  ["Sunday", "noun", "/ˈsʌndeɪ/", "the day after Saturday", "воскресенье", "Sunday is at the weekend.", "The week starts on Sunday in some calendars."]
];

export const lexicon = new Map<string, LexicalEntry>(
  [...seeds, ...lesson1bSeeds, ...lesson1bSourceSeeds, ...lesson8aSeeds, ...supplementalSeeds].map(([headword, partOfSpeech, transcription, definition, translation, exampleOne, exampleTwo]) => [
    headword.toLocaleLowerCase("en"),
    {
      headword,
      display: headword,
      partOfSpeech,
      transcription,
      definition,
      translation,
      examples: [exampleOne, exampleTwo],
      reviewed: true
    }
  ])
);

export const phraseKeys = [...lexicon.keys()]
  .filter((key) => key.includes(" "))
  .sort((a, b) => b.length - a.length);

export function fallbackEntry(word: string, context: string): LexicalEntry {
  return {
    headword: word.toLocaleLowerCase("en"),
    display: word,
    partOfSpeech: "word",
    transcription: "—",
    definition: "A word used in this lesson. Its reviewed dictionary entry is not ready yet.",
    translation: "перевод уточняется",
    examples: [context, `Ask your teacher about “${word}”.`],
    reviewed: false
  };
}
