
# Simple TODO

A simple todo app with chatbot using NextJS, Supabase, Flask/Python and OpenAI.


## Run Locally

Clone the project

```bash
  git clone https://github.com/paoloLigsay/next-supabase-py.git
```

Install dependencies

```bash
  npm install
```

Start the server:

1. Go to client folder and run:
```bash
  npm run dev
```

2. Go to server folder and run:
```bash
  python3 server.py
```

Open/check app

```bash
  http://localhost:3000/
```
## Overview

Kindly check the screenshot below of what the todo app currently looks like. App can currently:
- Add todo item and save it to supabase.
- Update todo item and save it to supabase.
- Delete a todo item.
- Stream GPT query and stream it back to FE from server.

![supabase-py-test](https://github.com/paoloLigsay/next-supabase-py/assets/58755638/41e6ed10-8d5a-4e3c-be5a-0bb2a3e4f716)

## Todo

- Accept input prompt from the user.
- Query new prompts to GPT.
- Throw GPT's response back to FE based on all previous chats and prompts.

