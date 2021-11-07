import '../css/login.css';
import { firebase } from '../Config';
import { useHistory } from 'react-router-dom';
import Navbar from '../components/navbar';
import React from 'react'
import axios from 'axios';
const { useState, useRef } = require("react");

const auth = firebase.auth();
const db = firebase.firestore();

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function Login() {
    const [rightPanelActive, setRightPanel] = useState();
    const [resetActive, setResetActive] = useState();
    const [alertActive, setAlertActive] = useState();
    const [passwordResetText, setPasswordText] = useState();
    const [alertText, setAlertText] = useState();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [pass, setPass] = useState();

    const history = useHistory();

    const signInContainer = useRef();
    const signUpContainer = useRef();
    const overlayContainer = useRef();
    const passwordResetContainer = useRef();

    const signUpPanel = () => {
        setRightPanel('right-panel-active');
        setUsername('');
        setEmail('');
        setPass('');
        auth.signOut();
    }
    const signInPanel = () => {
        setRightPanel('');
        setUsername('');
        setEmail('');
        setPass('');
        auth.signOut();
    }
    const activateAlert = (text) => {
        setAlertText(text);
        setAlertActive('alertActive');
        setTimeout(() => setAlertActive(''), 5000);
    }
    const activateReset = () => {
        signInContainer.current.hidden = !signInContainer.current.hidden;
        signUpContainer.current.hidden = !signUpContainer.current.hidden;
        overlayContainer.current.hidden = !overlayContainer.current.hidden;
        if (resetActive != 'resetActive')
            setResetActive('resetActive');
        else
            setResetActive('');
    }

    const signUp = (e) => {
        e.preventDefault();

        if (!validateEmail(email))
            activateAlert('The inserted email is not valid!');
        else if (pass.length < 6)
            activateAlert('The password must have atleast 6 characters!');
        else if (username.length < 1)
            activateAlert('The username field cannot be empty!');
        else {
            auth.createUserWithEmailAndPassword(email, pass)
                .then((userCredential) => {
                    auth.currentUser.updateProfile({
                        displayName: username
                    })
                        .then(auth.currentUser.sendEmailVerification());;
                    setUsername('');
                    setEmail('');
                    setPass('');
                    fetch('http://urandom.cloud:3000/apiemail', {
                        method: 'PUT',
                        mode: 'cors',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email: auth.currentUser.email })
                    })
                    history.push('/profile');
                })
                .catch((error) => {
                    if (error.code == 'auth/email-already-in-use')
                        activateAlert('This email is already in use! Please specify another.');
                    else
                        alert(error.code + "/n" + error.message);
                    //activateAlert('Internal Server Error!');
                });
        }
    }
    const signInGoogle = (e) => {
        e.preventDefault();
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(async () => {
                fetch('http://urandom.cloud:3000/check', {
                    method: 'PUT',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: auth.currentUser.email })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.check == 0) {
                            fetch('http://urandom.cloud:3000/apiemail', {
                                method: 'PUT',
                                mode: 'cors',
                                cache: 'no-cache',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ email: auth.currentUser.email })
                            })
                            history.push('/profile');
                        }
                        else
                            history.push('/profile');
                    });
            })
            .catch(() => {
                console.log("aia e");
            });
    }
    const signInEmail = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, pass)
            .then((userCredential) => {
                history.push('/');
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const resetPassword = (e) => {
        e.preventDefault();
        auth.sendPasswordResetEmail(email)
            .then(console.log('yay'))
            .catch((error) => {
                console.log('ceva')
            });
        setEmail('');
        setPasswordText('The email has been sent!');
    }

    return (
        <div className="Login" id="Login">
            <div className={"container " + rightPanelActive} id="container">
                <div ref={signInContainer} className={"form-container sign-up-container "}>
                    <form>
                        <h1>Create Account</h1>
                        <div className="social-container">
                            <a class="social"><i class="fab fa-facebook-f"></i></a>
                            <a class="social" onClick={signInGoogle}><i class="fab fa-google"></i></a>
                            <a class="social"><i class="fab fa-twitter"></i></a>
                        </div>
                        <span>or use your email for registration</span>
                        <input type="text" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value) }} />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        <input type="password" placeholder="Password" onChange={(e) => { setPass(e.target.value) }} />
                        <button onClick={signUp}>Sign Up</button>
                        <div className={"alert " + alertActive}><p>{alertText}</p></div>
                    </form>
                </div>
                <div ref={signUpContainer} class={"form-container sign-in-container "}>
                    <form>
                        <h1>Sign in</h1>
                        <div class="social-container">
                            <a class="social"><i class="fab fa-facebook-f"></i></a>
                            <a class="social" onClick={signInGoogle}><i class="fab fa-google"></i></a>
                            <a class="social"><i class="fab fa-twitter"></i></a>
                        </div>
                        <span>or use your account</span>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        <input type="password" placeholder="Password" onChange={(e) => { setPass(e.target.value) }} />
                        <a href={null} style={{ cursor: "pointer" }} class="pass-btn" onClick={activateReset}>Forgot your password?</a>
                        <button onClick={signInEmail}>Sign In</button>
                    </form>
                </div>
                <div ref={overlayContainer} class="overlay-container">
                    <div class="overlay">
                        <div class="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>
                                To keep connected with us please login with your personal info
                            </p>
                            <button class="ghost" id="signIn" onClick={signInPanel}>Sign In</button>
                        </div>
                        <div class="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start your journey with us</p>
                            <button class="ghost" id="signUp" onClick={signUpPanel}>Sign Up</button>
                        </div>
                    </div>
                </div>
                <div ref={passwordResetContainer} class={"pass-reset-container " + resetActive}>
                    <form>
                        <h1>Password reset</h1>
                        <p>Tell us the email address associated with your account, and we’ll send you an email with a link to reset your password.</p>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        <button onClick={resetPassword}>Reset password</button>
                        <p>{passwordResetText}</p>
                        <p href={null} style={{ cursor: "pointer" }} onClick={activateReset}>Return to login</p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;