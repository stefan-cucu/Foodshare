import Navbar from '../components/navbar';
import '../css/addrequest.css';
import itemTypes from '../components/itemTypes';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { firebase } from '../Config';
import moment from 'moment';

//Image import
import defaultPic from '../svg/foodbag.png';

const regex = /([A-Z])\w+ ([0-9])\d+/g

const auth = firebase.auth();

function Seeitems() {

    const [items, setItems] = useState([]);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (auth.currentUser == null) return;
            auth.currentUser.getIdToken()
                .then(idToken => {
                    fetch('http://urandom.cloud:3000/apigetitems', {
                        method: 'PUT',
                        mode: 'cors',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: 'Bearer ' + idToken
                        },
                        body: JSON.stringify({ provider: auth.currentUser.email })
                    })
                        .then(respone => respone.json())
                        .then(data => {
                            setItems(data);
                            console.log(items);
                        })
                })
        })
    }, [auth.currentUser]);


    return (
        <div className="Seeitems">
            <Navbar />
            <main id="main">
                <section id="breadcrumbs" class="breadcrumbs">
                    <div class="container">

                        <div class="d-flex justify-content-between align-items-center">
                            <h2>View all your items</h2>
                            <ol>
                                <li><a href="index.html">Home</a></li>
                                <li>View items</li>
                            </ol>
                        </div>

                    </div>
                </section>
                <section id="portfolio-details" class="portfolio-details">
                    <div class="container services">
                        <div class="row">
                            {items.map(item => <ItemCard title={item.Name} date={item.Date} quantity={item.Quantity}
                                img={itemTypes.find(itemType => itemType.name == item.Name)} />)}
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}

function ItemCard(props) {
    console.log(props.img);
    return (
        <div class="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0">
            <div class="icon-box" data-aos="fade-up" data-aos-delay="100">
                <img class="icon" src={props.img.img} />
                <h4 class="title"><a href="">{props.title}</a></h4>
                <p>Expiration date: {moment(props.date).format('YYYY/MM/DD')}</p>
                <p>Quantity: {props.quantity}</p>
            </div>
        </div>
    )
}

export default Seeitems;