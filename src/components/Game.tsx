import Start from './Start'
import Solve from './Solve'
import Timeout2 from './Timeout2'
import Reply from './Reply'
import Timeout1 from './Timeout1'
import Reader from './Reader'

function Game() {
    return (
        <>
            <h2>Game section</h2>

            <Start />
            <Solve />
            <Timeout2 />

            <hr />

            <Reply />
            <Timeout1 />

            <hr />

            <Reader />
        </>
    );
}

export default Game;
