import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { solve } from '../services/rps.service'

const { log } = console

function Solve() {
    const initialEmptyStringArray: string[] = []
    const [ solveErrors, setSolveErrors ] = useState(initialEmptyStringArray)

    const { register: registerSolve, handleSubmit: handleSubmitSolve, setValue: setValueSubmitSolve } = useForm()
    const onSubmitSolve = async (e: any) => {
        setSolveErrors([])
        log('[GAME]', JSON.stringify({ ...e, name: 'onSubmitSolve' }))
        const { game, choice, salt } = e
        const result = await solve(game, choice, salt)
        if (result.errors) {
            // show errors
            setSolveErrors(result.errors)
            log(`FAILED solve`, result.errors)
            return;
        }
        log(`SUCCESS solve`)
        setSolveErrors(['success'])
    }

    return (
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
    );
}

export default Solve;
