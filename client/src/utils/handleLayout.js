import {
    DiscoverHero,
    Footer, 
    Hero, 
    Navbar, 
    SupportFooter, 
    SupportHero, 
    SupportNavbar, 
    CareerHero, 
    CareerNavbar
} from "../components";

export const handleHero = (pathName) => {
    if (pathName === "") {
        return <Hero />;
    } else if (pathName === "discover") {
        return <DiscoverHero />;
    } else if (pathName === "support") {
        return <SupportHero />;
    } else if (pathName === "careers") {
        return <CareerHero />;
    }
};

export const handleNavbar = (pathName) => {
    if (pathName === "support") {
        return <SupportNavbar />;
    } else if (pathName === "careers") {
        return <CareerNavbar />
    } else {
        return <Navbar />;
    }
};

export const handleFooter = (pathName) => {
    if (pathName === "support") {
        return <SupportFooter />
    } else {
        return <Footer />
    }
};