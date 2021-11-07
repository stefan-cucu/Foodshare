import '../css/home.css';
import Navbar from '../components/navbar';

/// Image import
import heroimg from '../assets/img/hero-img.png';
import logoImg from '../svg/foodshare.png';
import homepageImg from '../svg/homepage_img.png';

import {firebase} from '../Config';

const auth = firebase.auth();

function Home() {
  
  return (
    <div className="Home">
      <Navbar />

      <section id="hero" class="d-flex align-items-center">
        <div class="container">
          <div class="row">
            <div class="col-lg-6 pt-5 pt-lg-0 order-2 order-lg-1 d-flex flex-column justify-content-center">
              <h1 data-aos="fade-up">Save food, save lives</h1>
              <h2 data-aos="fade-up" data-aos-delay="400">Improve the lives of homeless people with Foodshare.</h2>
              <div data-aos="fade-up" data-aos-delay="800">
                <a href="#about" class="btn-get-started scrollto">Find Out More</a>
              </div>
            </div>
            <div class="col-lg-6 order-1 order-lg-2 hero-img" data-aos="fade-left" data-aos-delay="200">
              <img src={homepageImg} class="img-fluid animated" alt=""/>
            </div>
          </div>
        </div>

      </section>

      <main id="main">
        <section id="clients" class="clients clients">
          <div class="container">

            <div class="row">

              <div class="col-lg-2 col-md-4 col-6">
                <img src={"assets/img/clients/client-1.png"} class="img-fluid" alt="" data-aos="zoom-in"/>
              </div>

              <div class="col-lg-2 col-md-4 col-6">
                <img src={"assets/img/clients/client-2.png"} class="img-fluid" alt="" data-aos="zoom-in" data-aos-delay="100"/>
              </div>

              <div class="col-lg-2 col-md-4 col-6">
                <img src={"assets/img/clients/client-3.png"} class="img-fluid" alt="" data-aos="zoom-in" data-aos-delay="200"/>
              </div>

              <div class="col-lg-2 col-md-4 col-6">
                <img src={"assets/img/clients/client-4.png"} class="img-fluid" alt="" data-aos="zoom-in" data-aos-delay="300"/>
              </div>

              <div class="col-lg-2 col-md-4 col-6">
                <img src={"assets/img/clients/client-5.png"} class="img-fluid" alt="" data-aos="zoom-in" data-aos-delay="400"/>
              </div>

              <div class="col-lg-2 col-md-4 col-6">
                <img src={"assets/img/clients/client-6.png"} class="img-fluid" alt="" data-aos="zoom-in" data-aos-delay="500"/>
              </div>

            </div>

          </div>
        </section>
        <section id="about" class="about">
          <div class="container">

            <div class="section-title" data-aos="fade-up">
              <h2>About Our Project</h2>
            </div>

            <div class="row content">
              <div class="col-lg-6" data-aos="fade-up" data-aos-delay="150">
                <p>
                  Our primary goal with Foodshare is to make a few steps towards fighting a major problem of our times, poverty and homelessness.
                  This is done by taking over goods nearing their expiration date from stores and sending them to homeless shelters, all this through the help of
                  various volunteers.
                </p>
              </div>
              <div class="col-lg-6 pt-4 pt-lg-0" data-aos="fade-up" data-aos-delay="300">
                <p>
                  The process works as such:
                </p>
                <ul>
                  <li><i class="ri-check-double-line"></i> A homeless shelter can send a request made up of different product categories and quantities for each. </li>
                  <li><i class="ri-check-double-line"></i> Volunteers receive the above-mentioned requests and attempt to gather the goods from
                    shops. </li>
                </ul>
                {/* <a href="#" class="btn-learn-more">Learn More</a> */}
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
