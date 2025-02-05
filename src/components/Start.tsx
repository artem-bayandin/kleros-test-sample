import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { startGame } from '../services/rps.service'

const { log } = console

function Start() {
    const [ GAME, setGame ] = useState('')
    const initialEmptyStringArray: string[] = []
    const [ startGameErrors, setStartGameErrors ] = useState(initialEmptyStringArray)
    
    // USER 1
    
    const { register: registerStart, handleSubmit: handleSubmitStart } = useForm()
    const onSubmitStart = async (e: any) => {
        setStartGameErrors([])
        log('[GAME]', JSON.stringify({ ...e, name: 'onSubmitStart' }))
        setGame('')
        const { opponent, bet, choice, salt } = e
        const result = await startGame(opponent, bet, choice, salt)
        if (result.errors) {
            // show errors
            setStartGameErrors(result.errors)
            log(`FAILED startGame`, result.errors)
            return;
        }
        const contract = result.data?.contract || ''
        setGame(contract)
        log(`SUCCESS startGame ${contract}`)
        setStartGameErrors(['success'])
    }

    // end user

    return (
        <div className='section start-game'>
            <h3>user 1 : start game</h3>
            <form onSubmit={handleSubmitStart(onSubmitStart)}>
                <input type='text' {...registerStart('opponent')} placeholder='opponent address' required />
                <input type='number' {...registerStart('bet')} placeholder='bet' min={1} required />
                <select {...registerStart('choice')}>
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
    );
}

export default Start;
