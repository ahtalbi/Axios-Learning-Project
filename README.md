# YouCode Recipes — Learning Axios

A small recipe app built to practice making HTTP requests with **Axios**. The interface is in French and lets you browse, search, add, and delete recipes.

## Goal of the project

The goal is to learn how a frontend talks to an API: send a request, read the response, update the page, and show useful feedback when something goes wrong.

The app uses the [DummyJSON Recipes API](https://dummyjson.com/docs/recipes). Its add and delete endpoints are examples: changes are simulated by the API and are not permanently saved.

## What I learned with Axios

- Create a reusable Axios instance with `axios.create()` and set a `baseURL` and timeout.
- Send a **GET** request to read recipes.
- Send search terms as query parameters with `params`.
- Send a **POST** request with recipe data.
- Send a **DELETE** request using a recipe ID in the URL.
- Use `async` / `await` and `try` / `catch` to handle requests and errors.
- Read response data from `response.data`.
- Use an interceptor to log outgoing requests.
- Show loading, success, empty, and error states in the interface.

## Features

- Load and display recipes.
- Search recipes by keyword.
- Add a recipe after validating the form.
- Delete a recipe after confirmation.
- Show loading feedback and error messages, with a retry button.

## Project structure

```text
.
├── index.html          # Page structure and forms
├── src/
│   ├── main.js         # App behavior and page updates
│   ├── appelsApi.js    # Axios setup and API requests
│   ├── components.js   # Recipe card creation
│   ├── validation.js   # Add-recipe form validation
│   └── style.css       # Tailwind CSS entry point
├── package.json        # Dependencies and scripts
└── vite.config.js      # Vite and Tailwind configuration
```

## API requests used

| Action | Method | Endpoint |
| --- | --- | --- |
| Get recipes | `GET` | `/recipes?limit=12` |
| Search recipes | `GET` | `/recipes/search?q=keyword` |
| Add a recipe | `POST` | `/recipes/add` |
| Delete a recipe | `DELETE` | `/recipes/{id}` |

All requests use `https://dummyjson.com/` as the base URL, configured once in `src/appelsApi.js`.

## Run the project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```
