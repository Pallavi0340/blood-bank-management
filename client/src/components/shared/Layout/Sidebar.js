import React from 'react'
// import { userMenu } from './Menus/userMenu'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from "react-redux"
import "../../../styles/Layout.css";

const Sidebar = () => {
    //GET USER STATE
    const { user } = useSelector(state => state.auth)
    const location = useLocation()

    console.log("SIDEBAR USER:", user);
    console.log("SIDEBAR ROLE:", user?.role);

    return (
        <div>
            <div className="sidebar">
                <div className="menu">
                    {user?.role === 'organisation' && (
                        <>
                            <div className={`menu-item ${location.pathname === "/home" && 'active'}`}>
                                <i className="fa-solid fa-warehouse"></i>
                                <Link to="/">Inventory</Link>
                            </div>
                            <div className={`menu-item ${location.pathname === "/donor" && 'active'}`}>
                                <i className="fa-solid fa-hand-holding-droplet"></i>
                                <Link to="/donor">Donor</Link>
                            </div>
                            <div className={`menu-item ${location.pathname === "/hospital" && 'active'}`}>
                                <i className="fa-solid fa-hospital"></i>
                                <Link to="/hospital">Hospital</Link>
                            </div>
                            <div className={`menu-item ${location.pathname === "/analytics" && 'active'}`}>
                                <i className="fa-solid fa-chart-line"></i>
                                <Link to="/analytics">Analytics</Link>
                            </div>
                        </>

                    )}

                    {user?.role === 'admin' && (
                        <>
                            <div className={`menu-item ${location.pathname === "/donor-list" && 'active'}`}>
                                <i className="fa-solid fa-warehouse"></i>
                                <Link to="/donor-list">Donor List</Link>
                            </div>
                            <div className={`menu-item ${location.pathname === "/hospital-list" && 'active'}`}>
                                <i className="fa-solid fa-hand-holding-droplet"></i>
                                <Link to="/hospital-list">Hospital List</Link>
                            </div>
                            <div className={`menu-item ${location.pathname === "/org-list" && 'active'}`}>
                                <i className="fa-solid fa-hospital"></i>
                                <Link to="/org-list">Organisation List</Link>
                            </div>
                        </>

                    )}

                    {user?.role === 'hospital' && (
                        <div className={`menu-item ${location.pathname === "/consumer" && 'active'}`}>
                            <i className="fa-solid fa-layer-group"></i>
                            <Link to="/consumer">Consumer</Link>
                        </div>
                    )}
                    {user?.role === 'donor' && (
                        <div className={`menu-item ${location.pathname === "/donation" && 'active'}`}>
                            <i className="fa-solid fa-layer-group"></i>
                            <Link to="/donation">Donation</Link>
                        </div>
                    )}







                    {/* {userMenu.map((menu) => {
                        const isActive = location.pathname === menu.path
                        return (
                            <div className={`menu-item ${isActive && 'active'}`}
                                key={menu.name}
                            >
                                <i className={menu.icon}></i>
                                <Link to={menu.path}>{menu.name}</Link>
                            </div>
                        );
                    })} */}
                </div>
            </div>
        </div>
    )
}

export default Sidebar
