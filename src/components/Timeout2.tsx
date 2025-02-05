import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { secondPlayerTimeout } from '../services/rps.service'

const { log } = console

function Timeout2() {
    const initialEmptyStringArray: string[] = []
    const [ secondPlayerTimeoutErrors, setSecondPlayerTimeoutErrors ] = useState(initialEmptyStringArray)

    const { register: registerTimeout2, handleSubmit: handleSubmitTimeout2, setValue: setValueSubmitTimeout2 } = useForm()
    const onSubmitTimeout2 = async (e: any) => {
        setSecondPlayerTimeoutErrors([])
        log('[GAME]', JSON.stringify({ ...e, name: 'onSubmitTimeout2' }))
        const { game } = e
        const result = await secondPlayerTimeout(game)
        if (result.errors) {
            // show errors
            setSecondPlayerTimeoutErrors(result.errors)
            log(`FAILED secondPlayerTimeout`, result.errors)
            return;
        }
        log(`SUCCESS secondPlayerTimeout`)
        setSecondPlayerTimeoutErrors(['success'])
    }

    return (
        <div className='section timeout2'>
            <h3>user 1 : timeout2</h3>
            <form onSubmit={handleSubmitTimeout2(onSubmitTimeout2)}>
                <input type='text' {...registerTimeout2('game')} placeholder='game address' required />
                <input type='submit' value='go' />
            </form>
            {secondPlayerTimeoutErrors.map((item, index) => { return <div key={index}>{item}</div>})}
        </div>
    );
}

export default Timeout2;
