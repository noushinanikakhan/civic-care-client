import React from "react";
import Banner from "./Banner/Banner";
import Features from "./Features/Features";
import HowItWorks from "./HowItWorks/HowItWorks";
import Reviews from "./Reviews/Reviews";
import Impact from "./Impact/Impact";

const Home = () => {
    return (
        <div>
            <Banner></Banner>
                 this is home

            <Features></Features>
            <HowItWorks></HowItWorks>
            <Reviews></Reviews>
            <Impact></Impact>
        </div>
    )
}

export default Home