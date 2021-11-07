import Navbar from '../components/navbar';
import '../css/additem.css';
import '@reach/combobox/styles.css';
import { useEffect, useState } from 'react';
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

//Image import
import defaultPic from '../svg/foodbag.png';
import itemTypes from '../components/itemTypes';
import { useHistory } from 'react-router';

const regex = /([A-Z])\w+ ([0-9])\d+/g
const auth = firebase.auth();

function Additem() {
    const [title, setTitle] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [Type, setType] = useState('Fish');
    const [htmlImage, setImage] = useState(defaultPic);

    const image = document.getElementById('profilePic');
    const history = useHistory();

    useEffect(() => {

        ml5.imageClassifier('../model/model.json')
            .then(classifier => classifier.classify(image))
            .then(results => {
                console.log(results);
                setType(results[0].label);
            });

        Tesseract.recognize(image, 'eng')
            .then(({ data: { text } }) => {
                console.log(text);
                console.log(text.slice(text.search(regex), text.search(regex) + 6));
                const date = Date.parse(text.slice(text.search(regex), text.search(regex) + 6));
                setExpirationDate(moment(date).format('yyyy-MM-DD'));
            })
    }, [htmlImage])

    const updatePic = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImage(reader.result);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    const submitItem = () => {
        let body = {
            type: Type,
            date: expirationDate,
            quantity: quantity,
            provider: auth.currentUser.email
        }
        auth.currentUser.getIdToken()
            .then(idToken => {
                fetch('http://urandom.cloud:3000/apiadditem', {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + idToken
                    },
                    body: JSON.stringify(body)
                })
            })
        history.push('/seeitems');
    }

    const handleChange = async (e) => {
        setType(e.target.value);
        console.log(Type);
    }

    return (
        <div className="Additem">
            <Navbar />
            <main id="main">
                <section id="breadcrumbs" class="breadcrumbs">
                    <div class="container">

                        <div class="d-flex justify-content-between align-items-center">
                            <h2>Add an item</h2>
                            <ol>
                                <li><a href="index.html">Home</a></li>
                                <li>Add item</li>
                            </ol>
                        </div>

                    </div>
                </section>
                <section id="portfolio-details" class="portfolio-details">
                    <div class="container">

                        <div class="row gy-4">

                            <div class="col-lg-5">
                                <div class="profile-pic-wrapper">
                                    <div class="pic-holder">
                                        <img id="profilePic" crossorigin='anonymous' class="pic" src={htmlImage} />

                                        <label for="newProfilePhoto" class="upload-file-block">
                                            <div class="text-center">
                                                <div class="mb-2">
                                                    <i class="fa fa-camera fa-2x"></i>
                                                </div>
                                                <div class="text-uppercase">
                                                    Upload <br /> Item Photo
                                                </div>
                                            </div>
                                        </label>
                                        <input class="uploadProfileInput" onChange={updatePic} type="file" name="profile_pic" id="newProfilePhoto" accept="image/*" style={{ display: 'none' }} />
                                    </div>
                                </div>
                                <p class="text-center">Upload a photo of the item and we will autocomplete the fields for you</p>
                            </div>

                            <div class="col-lg-7">
                                <div class="portfolio-info">
                                    <ul>
                                        <li>
                                            <strong>Type</strong>:
                                            <Combobox>
                                                <ComboboxInput
                                                    onChange={handleChange}
                                                    value={Type}
                                                />
                                                <ComboboxPopover>
                                                    <ComboboxList>
                                                        {itemTypes.map(({ id, name }) => (
                                                            <ComboboxOption key={id} value={name} />
                                                        ))}
                                                    </ComboboxList>
                                                </ComboboxPopover>
                                            </Combobox>
                                        </li>
                                    </ul>
                                    <h3></h3>
                                    <ul>
                                        <li><strong>Expiration date</strong>: <input onChange={(e) => { setExpirationDate(e.target.value) }} type="date" value={expirationDate} /></li>
                                        <li><strong>Quantity</strong>: <input onChange={(e) => { setQuantity(e.target.value) }} value={quantity} type="text" /></li>
                                    </ul>
                                    <button class="btn btn-outline-primary mx-auto" onClick={submitItem}>Submit</button>
                                </div>
                            </div>

                        </div>

                    </div>
                </section>

            </main>
        </div>
    );
}

export default Additem;