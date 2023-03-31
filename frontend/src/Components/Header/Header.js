import React, { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import {
    Home,
    HomeOutlined,
    Add,
    AddOutlined,
    SearchOutlined,
    Search,
    AccountCircle,
    AccountCircleOutlined,
} from "@mui/icons-material";
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';

const Header = () => {
    const [tab, setTab] = useState(window.location.pathname);
    return (
        <div className="header">
            <Link to="/" onClick={() => setTab("/")}>
                {tab === "/" ? <Home style={{ color: "black" }} /> : <HomeOutlined />}
            </Link>

            <Link to="/newpost" onClick={() => setTab("/newpost")}>
                {tab === "/newpost" ? (
                    <Add style={{ color: "black" }} />
                ) : (
                    <AddOutlined />
                )}
            </Link>

            <Link to="/search" onClick={() => setTab("/search")}>
                {tab === "/search" ? (
                    <Search style={{ color: "black" }} />
                ) : (
                    <SearchOutlined />
                )}
            </Link>
            <Link to="/message" onClick={() => setTab("/message")}>
                {tab === "/message" ? (
                    <MapsUgcIcon style={{ color: "black" }} />
                ) : (
                    <MapsUgcOutlinedIcon />
                )}
            </Link>

            <Link to="/account" onClick={() => setTab("/account")}>
                {tab === "/account" ? (
                    <AccountCircle style={{ color: "black" }} />
                ) : (
                    <AccountCircleOutlined />
                )}
            </Link>
        </div>
    );
};

export default Header;