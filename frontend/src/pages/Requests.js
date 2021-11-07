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

function Requests()
{
    const [items, setItems] = useState([]);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (auth.currentUser == null) return;
            auth.currentUser.getIdToken()
                .then(idToken => {
                    fetch('http://urandom.cloud:3000/apigetreqs', {
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
                            {items.map(item => <RequestCard title={item.name} id={item.id} />)}
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}

// Function that returns the distance between two geographical points
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function RequestCard(props) {
    console.log(props.img);
    return (
        <div class="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0">
            <div class="icon-box" data-aos="fade-up" data-aos-delay="100">
                <h4 class="title"><a href={"/request/" + props.id}>{props.title}</a></h4>
            </div>
        </div>
    )
}

export default Requests;