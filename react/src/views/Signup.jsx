import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useStateContext } from '../contexts/ContextProvider';

export default function Signup() {
		const nameRef = useRef();
		const emailRef = useRef();
		const passwordRef = useRef();
		const passwordConfirmationRef = useRef();

		const {setUser, setToken} = useStateContext();
		const [errors, setErrors] = useState(null);
	const onSubmit = (ev) => {
		ev.preventDefault();
		const payload = {
			name: nameRef.current.value,
			email: emailRef.current.value,
			password: passwordRef.current.value,
			password_confirmation: passwordConfirmationRef.current.value
		}


		axiosClient.post('/signup', payload)
		.then(({data}) => {
			setUser(data.user)
			setToken(data.token)

		})
		.catch(err => {
			const response = err.response;
			if(response && response.status === 422) {
				console.error(err.response.data);
				setErrors(response.data.errors);
			}
		})
	}
	return (
		<div className='login-signup-form animated fadeInDown'>
			<div className="form">
				<form action="" onSubmit={onSubmit}>
					<h1 className='title'>Sign Up</h1>
					{
						errors && <div className='alert'>
							{Object.keys(errors).map(key => (
								<p key={key}>{errors[key][0]}</p>
							))}
						</div>
					}
					<input type="text" ref={nameRef} placeholder='Name' />
					<input type="email" ref={emailRef} placeholder='Email' />
					<input type="password" ref={passwordRef} placeholder='Password' />
					<input type="password" ref={passwordConfirmationRef} placeholder='Password Confirmation' />
					<button className='btn btn-block'>Sign Up</button>
					<p className='message'>
						Already an user? <Link to='/login'>Sign in</Link>
					</p>
				</form>
			</div>
		</div>
	)
}
