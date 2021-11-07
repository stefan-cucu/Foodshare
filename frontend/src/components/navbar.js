import '../css/navbar.css';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { firebase } from '../Config';

///Image import
import logoImg from '../svg/foodshare.png';
import { useEffect } from 'react';

const auth = firebase.auth();

function Navbar() {

    const history = useHistory();
    const [type, setType] = useState('');

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (auth.currentUser == null) return;
                    fetch('http://urandom.cloud:3000/apigettype', {
                        method: 'PUT',
                        mode: 'cors',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email: auth.currentUser.email })
                    })
                        .then(respone => respone.json())
                        .then(data => {
                            console.log(data);
                            setType(data[0].type);
                        })
        })
    }, [])

    return (
        <header id="header" class="fixed-top d-flex align-items-center">
            <div class="container d-flex align-items-center justify-content-between">
                <div class="logo btn">
                    <img src={logoImg} alt="logo" onClick={() => {history.push('/')}}/>
                </div>

                <nav id="navbar" class="navbar">
                    <ul>
                        <li><a class="nav-link scrollto active" href="/">Home</a></li>
                       {
                           type == 1 && 
                           <>
                                <li><a class="nav-link scrollto" href="/additem">Add item</a></li>
                                <li><a class="nav-link scrollto" href="/seeitems">My items</a></li>
                           </>
                       }
                       {
                           type == 2 && 
                           <>
                                <li><a class="nav-link scrollto" href="/requests">Requests</a></li>
                           </>
                       }
                       {
                           type == 3 && 
                           <>
                                <li><a class="nav-link scrollto" href="/addrequest">Add request</a></li>
                                <li><a class="nav-link scrollto" href="/shelterrequests">My requests</a></li>
                           </>
                       }
                        {/* <li><a class="nav-link scrollto" href="#services">Services</a></li>
                        <li><a class="nav-link scrollto " href="#portfolio">Portfolio</a></li>
                        <li><a class="nav-link scrollto" href="#team">Team</a></li>
                        <li><a class="nav-link scrollto" href="#pricing">Pricing</a></li> */}
                        {/* <li class="dropdown"><a href="#"><span>Drop Down</span> <i class="bi bi-chevron-down"></i></a>
                            <ul>
                                <li><a href="#">Drop Down 1</a></li>
                                <li class="dropdown"><a href="#"><span>Deep Drop Down</span> <i class="bi bi-chevron-right"></i></a>
                                    <ul>
                                        <li><a href="#">Deep Drop Down 1</a></li>
                                        <li><a href="#">Deep Drop Down 2</a></li>
                                        <li><a href="#">Deep Drop Down 3</a></li>
                                        <li><a href="#">Deep Drop Down 4</a></li>
                                        <li><a href="#">Deep Drop Down 5</a></li>
                                    </ul>
                                </li>
                                <li><a href="#">Drop Down 2</a></li>
                                <li><a href="#">Drop Down 3</a></li>
                                <li><a href="#">Drop Down 4</a></li>
                            </ul>
                        </li> */}
                        {/* <li><a class="nav-link scrollto" href="#contact">Contact</a></li> */}
                        {
                            auth.currentUser == null &&
                            <li><a class="getstarted scrollto" onClick={() => history.push('/login')}>Login</a></li>
                        }
                    </ul>
                    <i class="bi bi-list mobile-nav-toggle"></i>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;