## Description

Task `D. Rock Paper Scissors Lizard Spock`.

Due to the fact, that the RPS contract is being deployed for every game, there is no need to give you the name of any specific network. When `User_1` starts the game, it "chooses" a network to play, so that `User_2` should reply on the same network.

## How to run it

1. clone repo to your local folder
2. `cd kleros-test-sample`
3. `yarn` (or `npm install`, I will continue with `yarn` commands)
4. `yarn hardhat compile --force`
5. now you need 2 terminals to run a) hardhat node; b) project
6. terminal 1: `yarn hardhat node`
7. this will also give you a list of pre-configured users. be precise when adding them to Metamask: the first transaction should have `0` as `nonce` (when you re-start node several times, `nonce` will get zeroed, but MM remembers the last used nonce). feel free to add 2 addresses to your wallet.
7. terminal 2: `yarn start`
8. have fun

## Game logic (for me as The Dev)

user 1:
    - [start_game]
        - input address of another user
        - input eth value
        - choose radio hand
        - input salt
        - clicks `create game`
            - receives contract address, salt, hand played
    - [solve]
        - input contract address of a game
        - choose radio hand
        - input salt
        - clicks `solve`
    - [j2_timeout]
        - input contract address of a game
        - clicks `j2 timeout`

user 2:
    - [reply]
        - input contract address of a game
        - choose radio hand
        - clicks `play`
    - [j1_timeout]                              // this might take all the stakes even if player_1 wins
        - input contract address of a game
        - clicks `j1 timeout`