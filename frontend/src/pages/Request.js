import Navbar from '../components/navbar';
import '../css/additem.css';
import '@reach/combobox/styles.css';
import styles from '../components/mapStyles';
import { useEffect, useState, useRef } from 'react';
import React from 'react';
import ml5 from 'ml5';
import Tesseract from 'tesseract.js';
import moment from 'moment';
import { firebase } from '../Config';
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";

import model from '../model/model.json';

import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
    MarkerClusterer,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";

//Image import
import defaultPic from '../svg/foodbag.png';
import itemTypes from '../components/itemTypes';
import { useParams } from 'react-router';

const regex = /([A-Z])\w+ ([0-9])\d+/g
const auth = firebase.auth();

const mapContainerStyle = {
    height: "30vh",
    width: "100%",
    margin: '20px'
};
const options = {
    styles: styles,
    disableDefaultUI: true,
    zoomControl: true,
};
const center = {
    lat: 43.6532,
    lng: -79.3832,
};

function Request() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyAk9CsNJLV3EYznHBhxuQt21PCw60uK_0U",
        libraries: ["places"]
    });

    const mapRef = useRef();
    const [marker, setMarker] = useState([]);
    const [center1, setCenter1] = useState({ lat: 43.6532, lng: -79.3832 });
    const [center2, setCenter2] = useState({ lat: 43.6532, lng: -79.3832 });
    const [Data, setData] = useState({});

    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
        console.log(mapRef);
    }, []);
    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
        setMarker([{
            lat: lat,
            lng: lng,
            time: new Date()
        }]);
    }, []);

    const { reqID } = useParams();

    useEffect(() => {
        fetch('http://urandom.cloud:3000/apigetreq', {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reqID: reqID })
        })
            .then(respone => respone.json())
            .then(data => {
                setData(data)
                // console.log(data);
                console.log(data);
                setCenter1({ lat: data.lat, lng: data.lng });
                setCenter2({ lat: data.plat, lng: data.plng });
            })

    }, []);

    const takeOn = () => {
        fetch('http://urandom.cloud:3000/apiupdatereq', {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: auth.currentUser.email, id: reqID })
        })
        alert('Request taken!');
    }

    return (
        <div className="Request">
            <Navbar />
            <main id="main">
                <section id="breadcrumbs" class="breadcrumbs">
                    <div class="container">

                        <div class="d-flex justify-content-between align-items-center">
                            <h2>Request</h2>
                            <ol>
                                <li><a href="index.html">Home</a></li>
                                <li><a href="index.html">Requests</a></li>
                                <li>Request</li>
                            </ol>
                        </div>
                    </div>
                </section>
                <section id="portfolio-details" class="portfolio-details">
                    <div class="container">

                        <div class="row gy-4">

                            <div class="col-lg-7 services">
                                <div class="row">
                                    {itemTypes.map(item => <ItemTypeStatic title={item.name} img={item.img}
                                        quantity={Data[item.id]} />)}
                                </div>
                            </div>

                            <div class="col-lg-5">
                                <div class="portfolio-info">
                                    <ul>
                                        <li>
                                            <strong>Shelter</strong>: {Data.name}
                                        </li>
                                    </ul>
                                    <h3></h3>
                                    <ul>
                                        <GoogleMap
                                            id="map"
                                            mapContainerStyle={mapContainerStyle}
                                            zoom={8}
                                            center={center1}
                                            options={options}
                                            onLoad={onMapLoad}
                                        >
                                            <Marker
                                                key={1}
                                                position={{ lat: Data.lat, lng: Data.lng }} />
                                        </GoogleMap>
                                    </ul>
                                    <ul>
                                        <li>
                                            <strong>Provider</strong>: {Data.pname}
                                        </li>
                                    </ul>
                                    <h3></h3>
                                    <ul>
                                        <GoogleMap
                                            id="map"
                                            mapContainerStyle={mapContainerStyle}
                                            zoom={8}
                                            center={center2}
                                            options={options}
                                            onLoad={onMapLoad}
                                        >
                                            <Marker
                                                key={1}
                                                position={{ lat: Data.plat, lng: Data.plng }} />
                                        </GoogleMap>
                                    </ul>
                                    <button class="btn btn-outline-primary mx-auto" onClick={takeOn}>Take on!</button>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function ItemTypeStatic(props) {
    return (
        <div class="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0">
            <div class="icon-box" data-aos="fade-up" data-aos-delay="100">
                <img class="icon" src={props.img} />
                <h4 class="title"><a href="">{props.title}</a></h4>
                <p>Quantity: {props.quantity} </p>
            </div>
        </div>
    )
}

export default Request;