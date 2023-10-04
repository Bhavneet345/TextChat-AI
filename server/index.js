const express = require('express');
const config = require('dotenv').config();
const cors = require('cors');
const openai = require('openai');

const openAI = new openai({
    apiKey: process.env.OPENAI_API_KEY
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    return res.status(200).send({
        message: 'Hello from TextChat'
    });
});

app.post('/', async(req, res) => {
    try{
        console.log(req.body);
        const prompt = req.body.prompt;
        console.log(prompt);
        const response = await openAI.completions.create({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0, 
            max_tokens: 3000, 
            top_p: 1, 
            frequency_penalty: 0.5, 
            presence_penalty: 0, 
        });       
        res.status(200).send({
            bot: response.choices[0].text
        });
    }catch(err){
        console.log(err);
        res.status(500).send({err});
    }
});

app.listen(3000, () => {
    console.log('Server is running at port http://localhost:3000');
})

