import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('#user_query_form');
const chatBox = document.querySelector('#chat_box');

let loadInterval;

function loadMessages(element){
    element.textContent = '';
    loadInterval = setInterval(() => {
        element.textContent += '.'
        if(element.textContent === '....'){
            element.textContent = '';
        }
    }, 300) 
}

function typeText(element, text){
    let index = 0;
    let interval = setInterval(() => {
        if(index < text.length){
            element.innerHTML += text.charAt(index);
            index++;
        }
        else{
            clearInterval(interval);
        }
    }, 20);
}

function generateUniqueId(){
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}`;
}

function currentChatHolder(isAI, value, uniqueId){
    return (
        `
        <div class="wrapper ${isAI && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAI ? bot : user} 
                      alt="${isAI ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const submit = async function(e) {
    e.preventDefault();
    const data = new FormData(form);

    // user's chat 
    chatBox.innerHTML += currentChatHolder(false, data.get('prompt_area'));
    form.reset();

    // bot's chat
    const uniqueId = generateUniqueId();
    chatBox.innerHTML += currentChatHolder(true, " ", uniqueId);
    
    chatBox.scrollTop = chatBox.scrollHeight;

    const messagediv = document.getElementById(uniqueId);

    loadMessages(messagediv);

    const response = await fetch('https://text-chat-ai.vercel.app/', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
            prompt: data.get('prompt_area')
        })
    });
    clearInterval(loadInterval);
    messagediv.innerHTML = '';
    if(response.ok){
        const data = await response.json();
        // console.log(data);
        const parsed = data.bot.trim();
        typeText(messagediv, parsed);
    }
    else{
        const err = await response.text();
        messagediv.innerHTML = "Something went wrong";
        alert(err);
    }
}

document.addEventListener('submit', submit);
form.addEventListener('keyup', (e) => {
    if(e.keyCode == 13){
        submit(e);
    }
})