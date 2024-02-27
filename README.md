# Simple Todo app

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
General: Row level security is off since I don't have any auth in this app, turned it off so I can get and insert data/rows.

### Todo Related
1. Maybe the approach as I am refetching all todos after updating, can get only the returned data of added/updated item so I won't need to grab the whole list/rows, say if in case it'll have thousands of rows.
2. Fix updateTodoModal and addTodoModal UI and the said issue in item 1.

### Chatbot Related
1. Accept input prompt from the user.
2. Throw GPT's response back to FE based on all previous chats and prompts.
3. Save everything to supabase. 

