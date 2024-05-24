# Brainstorming

## Overall Game Concept

A simple real-time multiplayer emoji guessing game.

One(?) player (the **Assassin**) has secretly hidden a **Bomb** under one of several emojis.

The other players (the **Players**) must attempt to guess all of the "safe" emojis and uncover the Assassin.

All players can communicate with each other in real-time, either through external communication channels (voice chat, being in the same room w/ the game on their phones, etc) or through in-game text chat.

Games should be organized via lobbies with a code, a la Jackbox. One player starts a game and can share the code with others, who can join.

Each individual game should be very brief, only a few minutes long.

## Possible Designs

### Timed Turns and Guessing

#### Basic Rules

In this design, each player has a short amount of time (5-15s) to guess an emoji on the screen.

Each Match is split into 5 Rounds.

Each Round is an individual instance of the game. At the beginning of a Round, an Assassin is secretly assigned, and the Assassin selects the emoji to hide the Bomb under. Every player must perform a click or tap action at this time so that the Assassin is not the only one interacting.

All non-Assassin players are shown one safe emoji. This emoji is different for every Player.

A player is randomly selected to have the first turn.

On their turn, a Player may either:
  - Select an unselected emoji (they may not select the emoji that they know is safe)
  - "Pass" their turn by allowing the timer to run out.

On their turn, an Assassin cannot guess. They can only "Pass" their turn by allowing the timer to run out.

After every player has taken a turn, there is a voting round where everyone can vote on who they think the Assassin is. A majority vote eliminates that player from the current Round.

If a Player selects the Bomb, they are eliminated from the current match. The Assassin selects a new Bomb and all players are shown a new safe emoji.

If there are ever the same number of Assassins as Players, the Assassins win the round.

#### Issues

**Problem** Repeatedly "passing" the turn is a dead giveaway for Assassins, since they have no other option on their turn.

**Potential solution**: Players gain and lose points through their actions. Points are tracked through 5 full games with the same group of players.

"Passing" your turn gains you a small number of points, and is therefore a safety option for players who are nervous about losing points.

Selecting a safe emoji gives more points than passing. The number of points increases as the number of selectable emojis decreases (i.e. as the chances of selecting the Bomb go up), to a very large number of points if you select the final safe emoji.

Selecting the Bomb loses you a significant number of points and removes you from the current round.

If you are the Assassin, you get a medium amount of points when someone selects a Bomb.