import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { reply } from '../services/rps.service'

const { log } = console

function Reply() {
    const initialEmptyStringArray: string[] = []
    const [ replyErrors, setReplyErrors ] = useState(initialEmptyStringArray)

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

    return (
        <div className='section reply'>
            <h3>user 2 : reply</h3>
            <form onSubmit={handleSubmitReply(onSubmitReply)}>
                <input type='text' {...registerReply('game')} placeholder='game address' required />
                <select {...registerReply('choice')}>
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
    );
}

export default Reply;
