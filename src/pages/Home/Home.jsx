import React from "react";
import Banner from "./Banner/Banner";
import Features from "./Features/Features";
import HowItWorks from "./HowItWorks/HowItWorks";
import Reviews from "./Reviews/Reviews";
import Impact from "./Impact/Impact";
import LatestResolvedIssues from "./LatestResolvedIssues/LatestResolvedIssues";

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <LatestResolvedIssues></LatestResolvedIssues>

            <Features></Features>
            <HowItWorks></HowItWorks>
            <Reviews></Reviews>
            <Impact></Impact>
        </div>
    )
}

export default Home