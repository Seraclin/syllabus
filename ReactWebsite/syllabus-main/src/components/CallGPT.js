import OpenAI from "openai";
import React from 'react';
// import Button from './Button';
import apiKey from './key';

import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from "next/server";
import { extname, join } from 'path';


class MyComponent extends React.Component {
  handleClick = () => {
    const openai = new OpenAI({
        apiKey: apiKey, // This is the default and can be omitted
    });
    
    async function main() {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: 'Say this is a test' }],
            model: 'gpt-3.5-turbo',
        });
        console.log(chatCompletion);
    }

      console.log('Button clicked!');
    console.log('Button clicked!');
  };

  render() {
    return (
      <div>
        <Button onClick={this.handleClick}>Click me</Button>
      </div>
    );
  }
}

export default CallGPT;
