import { useState } from 'react'
import { useForm } from 'react-hook-form'

const { log } = console

function Game() {

    // USER 1

    const { register: registerStart, handleSubmit: handleSubmitStart, setValue: setValueSubmitStart } = useForm()
    const onSubmitStart = (e: any) => {
        log('[GAME]', JSON.stringify({ ...e, name: 'onSubmitStart' }))
    }

    const { register: registerSolve, handleSubmit: handleSubmitSolve, setValue: setValueSubmitSolve } = useForm()
    const onSubmitSolve = (e: any) => {
        log('[GAME]', JSON.stringify({ ...e, name: 'onSubmitSolve' }))
    }

    const { register: registerTimeout2, handleSubmit: handleSubmitTimeout2, setValue: setValueSubmitTimeout2 } = useForm()
    const onSubmitTimeout2 = (e: any) => {
        log('[GAME]', JSON.stringify({ ...e, name: 'onSubmitTimeout2' }))
    }

    // USER 2

    const { register: registerReply, handleSubmit: handleSubmitReply, setValue: setValueSubmitReply } = useForm()
    const onSubmitReply = (e: any) => {
        log('[GAME]', JSON.stringify({ ...e, name: 'onSubmitReply' }))
    }

    const { register: registerTimeout1, handleSubmit: handleSubmitTimeout1, setValue: setValueSubmitTimeout1 } = useForm()
    const onSubmitTimeout1 = (e: any) => {
        log('[GAME]', JSON.stringify({ ...e, name: 'onSubmitTimeout1' }))
    }

    // end user

    // READ

    const [ user1, setUser1 ] = useState()
    const [ user2, setUser2 ] = useState()
    const [ user1Hash, setUser1Hash ] = useState()
    const [ user2Move, setUser2Move ] = useState()
    const [ stake, setStake ] = useState()
    const [ timeout, setTimeout ] = useState()
    const [ lastAction, setLastAction ] = useState()

    const { register: registerReader, handleSubmit: handleReader } = useForm()
    const onReader = (e: any) => {
        log('[GAME]', JSON.stringify({ ...e, name: 'onReader' }))
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
            </div>

            <div className='section timeout2'>
                <h3>user 1 : timeout2</h3>
                <form onSubmit={handleSubmitTimeout2(onSubmitTimeout2)}>
                    <input type='text' {...registerTimeout2('game')} placeholder='game address' required />
                    <input type='submit' value='go' />
                </form>
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
            </div>
            <div className='section timeout1'>
                <h3>user 2 : timeout1</h3>
                <form onSubmit={handleSubmitTimeout1(onSubmitTimeout1)}>
                    <input type='text' {...registerTimeout1('game')} placeholder='game address' required />
                    <input type='submit' value='go' />
                </form>
            </div>

            <hr />

            <div className='section reader'>
                <div>
                    <h3>reader</h3>
                    <form onSubmit={handleReader(onReader)}>
                        <input type='text' {...registerTimeout1('game')} placeholder='game address' required />
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
