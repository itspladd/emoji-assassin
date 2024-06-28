# 💣🕵️ Emoji Assassin 🕵️💣

Emoji Assassin (working title) is a multiplayer hidden-role guessing game built with React, Node, Socket.io, Express, and Vite.

## Local Setup

To run Emoji Assassin locally, you'll need `yarn` or `npm`. The server and the client both run through Vite, so you only need to run a single command to start the app.

1. Clone this repo and navigate into the repo folder.
2. Set up development env variables in a a `.env.development` file using the `.env.development.sample` file as a template.
3. Install dependencies with `yarn` or `npm install`.
4. Run the `dev` script with `yarn dev` or `npm run dev`.
5. In your browser, navigate to `localhost:3000`.

That's it!

## Auto-Joining in Development Mode

When run locally in development mode (the default), the server will automatically create a "debug" room. You can configure the client to automatically join this room when on startup by setting the `VITE_AUTO_JOIN_DEBUG_ROOM` environment variable to `true`.

(Make sure to restart the server afterwards!)