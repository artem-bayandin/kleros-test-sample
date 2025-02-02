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