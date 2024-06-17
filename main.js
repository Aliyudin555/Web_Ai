import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import Base64 from 'base64-js';
import MarkdownIt from 'markdown-it';
import { maybeShowApiKeyBanner } from './gemini-api-banner';
import './style.css';

// 🔥 FILL THIS OUT FIRST! 🔥
// 🔥 GET YOUR GEMINI API KEY AT 🔥
// 🔥 https://g.co/ai/idxGetGeminiKey 🔥
let API_KEY = 'AIzaSyCfO12vnB4VDi_T4RJSZH145GjGA_KrWaI';

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');

const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });
const chat = model.startChat({
  history:[],
  generationConfig: {
    maxOutputTokens: 100
  }
});

form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Tunggu Sebentar...';

  try {
    // Load the image as a base64 string
    // let imageUrl = form.elements.namedItem('chosen-image').value;
    // let imageBase64 = await fetch(imageUrl)
    //   .then(r => r.arrayBuffer())
    //   .then(a => Base64.fromByteArray(new Uint8Array(a)));

    // Assemble the prompt by combining the text with the chosen image
    // let contents = [
    //   {
    //     role: 'user',
    //     parts: [
    //       // { inline_data: { mime_type: 'image/jpeg', data: imageBase64, } },
    //       { text: promptInput.value }
    //     ]
    //   }
    // ];

    // Call the gemini-pro-vision model, and get a stream of results
    // const genAI = new GoogleGenerativeAI(API_KEY);
    // const model = genAI.getGenerativeModel({
    //   model: "gemini-pro",
    //   safetySettings: [
    //     {
    //       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    //       threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    //     },
    //   ],
    // });
    const prompt = promptInput.value;
    const result = await chat.sendMessageStream(prompt);

    // const result = await model.generateContentStream({ contents });

    // Read from the stream and interpret the output as markdown
    let buffer = [];
    let md = new MarkdownIt();
    for await (let response of result.stream) {
      buffer.push(response.text());
      output.innerHTML = md.render(buffer.join(''));
    }
  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }
};

// You can delete this once you've filled out an API key
maybeShowApiKeyBanner(API_KEY);