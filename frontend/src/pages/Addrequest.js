import Navbar from '../components/navbar';
import '../css/addrequest.css';
import itemTypes from '../components/itemTypes';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { firebase } from '../Config';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
//Image import
import defaultPic from '../svg/foodbag.png';

const regex = /([A-Z])\w+ ([0-9])\d+/g

const auth = firebase.auth();

function Addrequest() {
    const history = useHistory();

    const [request, setRequest] = useState({
        meat: 0,
        dairy: 0,
        fish: 0,
        vegetables: 0,
        fruits: 0,
        bread: 0,
        chocolate: 0,
        eggs: 0
    });

    const submitRequest = () => {
        setRequest({
            ...request,
            name: uuidv4(),
            shelter: auth.currentUser.email
        });
        console.log(request);
        auth.currentUser.getIdToken()
        .then(idToken => {
            fetch('http://urandom.cloud:3000/apiaddreq', {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + idToken
                },
                body: JSON.stringify(request)
            })
        })
        history.push('/shelterrequests');
    }

    return (
        <div className="Addrequest">
            <Navbar />
            <main id="main">
                <section id="breadcrumbs" class="breadcrumbs">
                    <div class="container">

                        <div class="d-flex justify-content-between align-items-center">
                            <h2>Add a request</h2>
                            <ol>
                                <li><a href="index.html">Home</a></li>
                                <li>Add request</li>
                            </ol>
                        </div>

                    </div>
                </section>
                <section id="portfolio-details" class="portfolio-details">
                    <div class="container services">
                        <div class="row">
                            {itemTypes.map(item => <ItemType title={item.name} img={item.img} id={item.id} setRequest={setRequest} request={request}/>)}
                        </div>
                        <button className="btn btn-primary" onClick={submitRequest}>Submit</button>
                    </div>
                </section>

            </main>
        </div>
    );
}

function ItemType(props) {
    
    return (
        <div class="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0">
            <div class="icon-box" data-aos="fade-up" data-aos-delay="100">
                <img class="icon" src={props.img}/>
                <h4 class="title"><a href="">{props.title}</a></h4>
                <input type="number" placeholder="Item quantity" value={props.request[props.id]} 
                onChange={(e)=>{
                    if(e.target.value > 0){
                        props.setRequest({
                            ...props.request,
                            [props.id]: parseInt(e.target.value)
                        })
                        console.log(props.request);
                    }
                }}/>
            </div>
        </div>
    )
}

export default Addrequest;