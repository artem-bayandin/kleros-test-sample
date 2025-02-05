import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { firstPlayerTimeout } from '../services/rps.service'

const { log } = console

function Timeout1() {
    const initialEmptyStringArray: string[] = []
    const [ firstPlayerTimeoutErrors, setFirstPlayerTimeoutErrors ] = useState(initialEmptyStringArray)

    const { register: registerTimeout1, handleSubmit: handleSubmitTimeout1, setValue: setValueSubmitTimeout1 } = useForm()
    const onSubmitTimeout1 = async (e: any) => {
        setFirstPlayerTimeoutErrors([])
        log('[GAME]', JSON.stringify({ ...e, name: 'onSubmitTimeout1' }))
        const { game } = e
        const result = await firstPlayerTimeout(game)
        if (result.errors) {
            // show errors
            setFirstPlayerTimeoutErrors(result.errors)
            log(`FAILED firstPlayerTimeout`, result.errors)
            return;
        }
        log(`SUCCESS firstPlayerTimeout`)
        setFirstPlayerTimeoutErrors(['success'])
    }

    return (
        <div className='section timeout1'>
            <h3>user 2 : timeout1</h3>
            <form onSubmit={handleSubmitTimeout1(onSubmitTimeout1)}>
                <input type='text' {...registerTimeout1('game')} placeholder='game address' required />
                <input type='submit' value='go' />
            </form>
            {firstPlayerTimeoutErrors.map((item, index) => { return <div key={index}>{item}</div>})}
        </div>
    );
}

export default Timeout1;
