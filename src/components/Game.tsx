import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { firstPlayerTimeout, getLastAction, getStake, getTimeout, getUser1, getUser1Hash, getUser2, getUser2Move, reply, secondPlayerTimeout, solve, startGame } from '../services/rps.service'

const { log } = console

function Game() {
    const [ GAME, setGame ] = useState('')
    const initialEmptyStringArray: string[] = []
    const [ startGameErrors, setStartGameErrors ] = useState(initialEmptyStringArray)
    const [ solveErrors, setSolveErrors ] = useState(initialEmptyStringArray)
    const [ secondPlayerTimeoutErrors, setSecondPlayerTimeoutErrors ] = useState(initialEmptyStringArray)
    const [ replyErrors, setReplyErrors ] = useState(initialEmptyStringArray)
    const [ firstPlayerTimeoutErrors, setFirstPlayerTimeoutErrors ] = useState(initialEmptyStringArray)
    
    // USER 1
    
    const { register: registerStart, handleSubmit: handleSubmitStart } = useForm({
        defaultValues: {
            opponent: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
            , bet: 1000000000 + Date.now()
            , choice: 1
            , salt: 16
        }
    })
    const onSubmitStart = async (e: any) => {
        setStartGameErrors([])
        log('[GAME]', JSON.stringify({ ...e, name: 'onSubmitStart' }))
        setGame('')
        const { opponent, bet, choice, salt } = e
        const result = await startGame(opponent, bet, choice, salt)
        if (result.errors) {
            // show errors
            setStartGameErrors(result.errors)
            console.log(`FAILED startGame`, result.errors)
            return;
        }
        const contract = result.data?.contract || ''
        setGame(contract)
        console.log(`SUCCESS startGame ${contract}`)
        setStartGameErrors(['success'])
    }

    const { register: registerSolve, handleSubmit: handleSubmitSolve, setValue: setValueSubmitSolve } = useForm()
    const onSubmitSolve = async (e: any) => {
        setSolveErrors([])
        log('[GAME]', JSON.stringify({ ...e, name: 'onSubmitSolve' }))
        const { game, choice, salt } = e
        const result = await solve(game, choice, salt)
        if (result.errors) {
            // show errors
            setSolveErrors(result.errors)
            console.log(`FAILED solve`, result.errors)
            return;
        }
        console.log(`SUCCESS solve`)
        setSolveErrors(['success'])
    }

    const { register: registerTimeout2, handleSubmit: handleSubmitTimeout2, setValue: setValueSubmitTimeout2 } = useForm()
    const onSubmitTimeout2 = async (e: any) => {
        setSecondPlayerTimeoutErrors([])
        log('[GAME]', JSON.stringify({ ...e, name: 'onSubmitTimeout2' }))
        const { game } = e
        const result = await secondPlayerTimeout(game)
        if (result.errors) {
            // show errors
            setSecondPlayerTimeoutErrors(result.errors)
            console.log(`FAILED secondPlayerTimeout`, result.errors)
            return;
        }
        console.log(`SUCCESS secondPlayerTimeout`)
        setSecondPlayerTimeoutErrors(['success'])
    }

    // USER 2

    const { register: registerReply, handleSubmit: handleSubmitReply, setValue: setValueSubmitReply } = useForm()
    const onSubmitReply = async (e: any) => {
        setReplyErrors([])
        log('[GAME]', JSON.stringify({ ...e, name: 'onSubmitReply' }))
        const { game, choice } = e
        const result = await reply(game, choice)
        if (result.errors) {
            // show errors
            setReplyErrors(result.errors)
            console.log(`FAILED reply`, result.errors)
            return;
        }
        console.log(`SUCCESS reply`)
        setReplyErrors(['success'])
    }

    const { register: registerTimeout1, handleSubmit: handleSubmitTimeout1, setValue: setValueSubmitTimeout1 } = useForm()
    const onSubmitTimeout1 = async (e: any) => {
        setFirstPlayerTimeoutErrors([])
        log('[GAME]', JSON.stringify({ ...e, name: 'onSubmitTimeout1' }))
        const { game } = e
        const result = await firstPlayerTimeout(game)
        if (result.errors) {
            // show errors
            setFirstPlayerTimeoutErrors(result.errors)
            console.log(`FAILED firstPlayerTimeout`, result.errors)
            return;
        }
        console.log(`SUCCESS firstPlayerTimeout`)
        setFirstPlayerTimeoutErrors(['success'])
    }

    // end user

    // READ

    const [ user1, setUser1 ] = useState('')
    const [ user2, setUser2 ] = useState('')
    const [ user1Hash, setUser1Hash ] = useState('')
    const [ user2Move, setUser2Move ] = useState(0)
    const [ stake, setStake ] = useState(0)
    const [ timeout, setTimeout ] = useState(0)
    const [ lastAction, setLastAction ] = useState(0)

    const { register: registerReader, handleSubmit: handleReader } = useForm()
    const onReader = async (e: any) => {
        const { game } = e
        log('[GAME]', JSON.stringify({ ...e, name: 'onReader' }))
        const user1 = await getUser1(game)
        setUser1(user1)

        const user2 = await getUser2(game)
        setUser2(user2)

        const user1Hash = await getUser1Hash(game)
        setUser1Hash(user1Hash)

        const user2Move = await getUser2Move(game)
        setUser2Move(Number(user2Move))

        const stake = await getStake(game)
        setStake(Number(stake))

        const timeout = await getTimeout(game)
        setTimeout(Number(timeout))

        const lastAction = await getLastAction(game)
        setLastAction(Number(lastAction))
    }

    return (
        <>
            <h2>Game section</h2>
            <div className='section start-game'>
                <h3>user 1 : start game</h3>
                <form onSubmit={handleSubmitStart(onSubmitStart)}>
                    <input type='text' {...registerStart('opponent')} placeholder='opponent address' required />
                    <input type='number' {...registerStart('bet')} placeholder='bet' min={1} required />
                    <select {...registerStart('choice')} value="1">
                        <option value="1">rock</option>
                        <option value="2">paper</option>
                        <option value="3">scissors</option>
                        <option value="4">spock</option>
                        <option value="5">lizard</option>
                    </select>
                    <input type='number' {...registerStart('salt')} placeholder='salt' min={0} required />
                    <input type='submit' value='go' />
                </form>
                { GAME && <div>game created: {GAME}</div> }
                {startGameErrors.map((item, index) => { return <div key={index}>{item}</div>})}
            </div>

            <div className='section solve'>
                <h3>user 1 : solve</h3>
                <form onSubmit={handleSubmitSolve(onSubmitSolve)}>
                    <input type='text' {...registerSolve('game')} placeholder='game address' required />
                    <select {...registerSolve('choice')} value="1">
                        <option value="1">rock</option>
                        <option value="2">paper</option>
                        <option value="3">scissors</option>
                        <option value="4">spock</option>
                        <option value="5">lizard</option>
                    </select>
                    <input type='number' {...registerSolve('salt')} placeholder='salt' min={0} required />
                    <input type='submit' value='go' />
                </form>
                {solveErrors.map((item, index) => { return <div key={index}>{item}</div>})}
            </div>

            <div className='section timeout2'>
                <h3>user 1 : timeout2</h3>
                <form onSubmit={handleSubmitTimeout2(onSubmitTimeout2)}>
                    <input type='text' {...registerTimeout2('game')} placeholder='game address' required />
                    <input type='submit' value='go' />
                </form>
                {secondPlayerTimeoutErrors.map((item, index) => { return <div key={index}>{item}</div>})}
            </div>

            <hr />

            <div className='section reply'>
                <h3>user 2 : reply</h3>
                <form onSubmit={handleSubmitReply(onSubmitReply)}>
                    <input type='text' {...registerReply('game')} placeholder='game address' required />
                    <select {...registerReply('choice')} value="1">
                        <option value="1">rock</option>
                        <option value="2">paper</option>
                        <option value="3">scissors</option>
                        <option value="4">spock</option>
                        <option value="5">lizard</option>
                    </select>
                    <input type='submit' value='go' />
                </form>
                {replyErrors.map((item, index) => { return <div key={index}>{item}</div>})}
            </div>
            <div className='section timeout1'>
                <h3>user 2 : timeout1</h3>
                <form onSubmit={handleSubmitTimeout1(onSubmitTimeout1)}>
                    <input type='text' {...registerTimeout1('game')} placeholder='game address' required />
                    <input type='submit' value='go' />
                </form>
                {firstPlayerTimeoutErrors.map((item, index) => { return <div key={index}>{item}</div>})}
            </div>

            <hr />

            <div className='section reader'>
                <div>
                    <h3>reader</h3>
                    <form onSubmit={handleReader(onReader)}>
                        <input type='text' {...registerReader('game')} placeholder='game address' required />
                        <input type='submit' value='read' />
                    </form>
                </div>
                <div>user1 : {user1}</div>
                <div>user2 : {user2}</div>
                <div>user1Hash : {user1Hash}</div>
                <div>user2Move : {user2Move}</div>
                <div>stake : {stake}</div>
                <div>timeout : {timeout}</div>
                <div>lastAction : {lastAction}</div>
            </div>
        </>
    );
}

export default Game;
