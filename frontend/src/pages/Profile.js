import { useEffect, useState, useRef } from 'react';
import React from 'react';
import '../css/profile.css';
import '@reach/combobox/styles.css';
import styles from '../components/mapStyles';

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
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";

/// Image import
import logoImg from '../svg/foodshare.png'
import manImg from '../svg/man2.png'

import { firebase } from '../Config';
import mapKey from '../ApiKey.json';
import { useHistory } from 'react-router-dom';

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

const auth = firebase.auth();

function Profile() {

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: mapKey.key,
        libraries: ["places"]
    });

    const history = useHistory();

    useEffect(() => {
        if (!isLoaded) return;
        const progress = (value) => {
            document.getElementsByClassName('progress-bar')[0].style.width = `${value}%`;
        }

        let step = document.getElementsByClassName('step');
        let prevBtn = document.getElementById('prev-btn');
        let nextBtn = document.getElementById('next-btn');
        let submitBtn = document.getElementById('submit-btn');

        let current_step = 0;
        let stepCount = 3
        step[current_step].classList.add('d-block');
        if (current_step == 0) {
            prevBtn.classList.add('d-none');
            submitBtn.classList.add('d-none');
            nextBtn.classList.add('d-inline-block');
        }


        nextBtn.addEventListener('click', () => {
            current_step++;
            let previous_step = current_step - 1;
            if ((current_step > 0) && (current_step <= stepCount)) {
                prevBtn.classList.remove('d-none');
                prevBtn.classList.add('d-inline-block');
                step[current_step].classList.remove('d-none');
                step[current_step].classList.add('d-block');
                step[previous_step].classList.remove('d-block');
                step[previous_step].classList.add('d-none');
                if (current_step == stepCount) {
                    submitBtn.classList.remove('d-none');
                    submitBtn.classList.add('d-inline-block');
                    nextBtn.classList.remove('d-inline-block');
                    nextBtn.classList.add('d-none');
                }
            }
            progress((100 / stepCount) * current_step);
        });


        prevBtn.addEventListener('click', () => {
            if (current_step > 0) {
                current_step--;
                let previous_step = current_step + 1;
                prevBtn.classList.add('d-none');
                prevBtn.classList.add('d-inline-block');
                step[current_step].classList.remove('d-none');
                step[current_step].classList.add('d-block')
                step[previous_step].classList.remove('d-block');
                step[previous_step].classList.add('d-none');
                if (current_step < stepCount) {
                    submitBtn.classList.remove('d-inline-block');
                    submitBtn.classList.add('d-none');
                    nextBtn.classList.remove('d-none');
                    nextBtn.classList.add('d-inline-block');
                    prevBtn.classList.remove('d-none');
                    prevBtn.classList.add('d-inline-block');
                }
            }

            if (current_step == 0) {
                prevBtn.classList.remove('d-inline-block');
                prevBtn.classList.add('d-none');
            }
            progress((100 / stepCount) * current_step);
        });
    }, [isLoaded]);

    const [accountType, setAccountType] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');

    const mapRef = useRef();
    const [marker, setMarker] = useState([]);

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

    //if (auth.currentUser == null) history.push('/login');

    const submitForm = () => {
        var body = {}
        if (accountType === 2) {
            body = {
                type: 2,
                email: auth.currentUser.email,
                name: name,
                phone: phone,
                age: age,
                gender: gender
            }
        }
        else
            body = {
                type: accountType,
                email: auth.currentUser.email,
                name: name,
                phone: phone,
                lat: marker[0].lat,
                lng: marker[0].lng
            }
        console.log(body);
        console.log(marker[0]);
        auth.currentUser.getIdToken().then((idToken) => {
            fetch('http://urandom.cloud:3000/apicreateprofile', {
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

        history.push('/');
    }

    if (!isLoaded) return <div>Loading...</div>;

    console.log(auth.currentUser);

    return (
        <div className="Profile">
            <div class="container d-flex align-items-center min-vh-100">
                <div class="row g-0 justify-content-center">
                    <div class="col-lg-4 offset-lg-1 mx-0 px-0">
                        <div id="title-container">
                            <img src={manImg} className="image" />
                            <img src={logoImg} className="logo" />
                            <h3>Profile creation</h3>
                            <p>Setup your account and start your journey with us.</p>
                        </div>
                    </div>
                    <div class="col-lg-7 mx-0 px-0">
                        <div class="progress">
                            <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="50" class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" style={{ width: '0%' }}></div>
                        </div>
                        <div id="qbox-container">
                            <div class="needs-validation" id="form-wrapper">
                                <div id="steps-container">
                                    <div class="step">
                                        <h4>Which of the following represents you best?</h4>
                                        <div class="form-check ps-0 q-box">
                                            <div class="q-box__question">
                                                <input class="form-check-input question__input" id="q_1_provider" name="q_1" type="radio" value="Provider" onClick={() => { setAccountType(1) }} />
                                                <label class="form-check-label question__label" for="q_1_provider">Provider</label>
                                            </div>
                                            <div class="q-box__question">
                                                <input class="form-check-input question__input" id="q_1_volunteer" name="q_1" type="radio" value="Volunteer" onClick={() => { setAccountType(2) }} />
                                                <label class="form-check-label question__label" for="q_1_volunteer">Volunteer</label>
                                            </div>
                                            <div class="q-box__question">
                                                <input class="form-check-input question__input" id="q_1_shelter" name="q_1" type="radio" value="Shelter" onClick={() => { setAccountType(3) }} />
                                                <label class="form-check-label question__label" for="q_1_shelter">Homeless Shelter</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="step">
                                        <h4>Provide us with your personal information</h4>
                                        <div class="mt-1">
                                            <label class="form-label">Complete Name: </label>
                                            <input class="form-control" id="full_name" name="full_name" type="text" value={name} onChange={(e) => { setName(e.target.value) }} />
                                        </div>
                                        <div class="mt-2">
                                            <label class="form-label">Phone / Mobile Number: </label>
                                            <input class="form-control" id="phone" name="phone" type="text" value={phone} onChange={(e) => { setPhone(e.target.value) }} />
                                        </div>
                                        {
                                            accountType === 2 &&
                                            <div class="row mt-2">
                                                <div class="col-lg-2 col-md-2 col-3">
                                                    <label class="form-label">Age: </label>
                                                    <div class="input-container">
                                                        <input class="form-control" id="age" name="age" type="text" value={age} onChange={(e) => { setAge(e.target.value) }} />
                                                    </div>
                                                </div>
                                                <div class="col-lg-8">
                                                    <div id="input-container">
                                                        <input class="form-check-input" name="gender" type="radio" value="male" onChange={() => { setGender('male') }} />
                                                        <label class="form-check-label radio-lb">Male</label>
                                                        <input class="form-check-input" name="gender" type="radio" value="female" onChange={() => { setGender('female') }} />
                                                        <label class="form-check-label radio-lb">Female</label>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div class="step">
                                        <h4>Provide us with your personal information</h4>
                                        <div class="mt-2">
                                            <GoogleMap
                                                id="map"
                                                mapContainerStyle={mapContainerStyle}
                                                zoom={8}
                                                center={center}
                                                options={options}
                                                onLoad={onMapLoad}
                                            >
                                                {marker.map((marker) => (
                                                    <Marker
                                                        key={marker.time.toISOString()}
                                                        position={{ lat: marker.lat, lng: marker.lng }} />
                                                ))}
                                            </GoogleMap>
                                            <label class="form-label">Complete Address: </label>
                                            <Search panTo={panTo} />
                                        </div>
                                    </div>
                                    <div class="step">
                                        <div class="mt-1">
                                            <div class="closing-text">
                                                <h4>That's about it!</h4>
                                                <p>We will assess your information and will let you know soon if you are eligible.</p>
                                                <p>Click on the submit button to continue.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="success">
                                        <div class="mt-5">
                                            <h4>Success!We'll get back to you ASAP!</h4>
                                            <p>Meanwhile, clean your hands often, use soap and water, or an alcohol-based hand rub, maintain a safe distance from anyone who is coughing or sneezing and always wear a mask when physical distancing is not possible.</p>
                                            <a class="back-link" href="">Go back from the beginning ➜</a>
                                        </div>
                                    </div>
                                </div>
                                <div id="q-box__buttons">
                                    <button id="prev-btn" type="button">Previous</button>
                                    <button id="next-btn" type="button">Next</button>
                                    <button id="submit-btn" type="submit" onClick={submitForm}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Search({ panTo }) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 43.6532, lng: () => -79.3832 },
            radius: 100 * 1000,
        },
    });

    // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

    const handleInput = (e) => {
        setValue(e.target.value);
    };

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();
        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            console.log(panTo);
            panTo({ lat, lng });
        } catch (error) {
            console.log("😱 Error: ", error);
        }
    };

    return (
        <div className="search">
            <Combobox onSelect={handleSelect} style={{ background_color: 'white', width: '100%' }}>
                <ComboboxInput
                    value={value}
                    onChange={handleInput}
                    placeholder="Search your location"
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" &&
                            data.map(({ id, description }) => (
                                <ComboboxOption key={id} value={description} />
                            ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    );
}

export default Profile;