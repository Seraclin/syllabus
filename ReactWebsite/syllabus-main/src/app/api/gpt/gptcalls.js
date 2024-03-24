import OpenAI from "openai";
import apiKey from './key.js';

const openai = new OpenAI({
    organization: apiKey,
});
