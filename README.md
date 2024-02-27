![supabase-py-test](https://github.com/paoloLigsay/todo-wt-chatbot/assets/58755638/0124d7d7-0db8-4706-9e0c-a67855293cbd)![supabase-py-test](https://github.com/paoloLigsay/todo-wt-chatbot/assets/58755638/19661e1b-eb8a-42bd-bad4-be88a7055f0c)
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

1. For client side, run:
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

![supabase-py-test](https://github.com/paoloLigsay/todo-wt-chatbot/assets/58755638/fe75ddea-5cac-49b2-b101-a3004f998ac1)


## Todo

### Todo Related
- Maybe the approach as I am refetching all todos after updating, can get only the returned data of added/updated item so I won't need to grab the whole list/rows, say if in case it'll have thousands of rows.

### Chatbot Related
- Accept input prompt from the user.
- Query new prompts to GPT.
- Throw GPT's response back to FE based on all previous chats and prompts.

