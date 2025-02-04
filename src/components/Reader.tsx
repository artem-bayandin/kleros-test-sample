import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { getLastAction, getStake, getTimeout, getUser1, getUser1Hash, getUser2, getUser2Move } from '../services/rps.service'

const { log } = console

function Reader() {
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
    );
}

export default Reader;
