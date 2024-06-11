import React from "react";

const Aboutus = ({ onClose }) => {
    return (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", maxWidth: "80%", maxHeight: "80%", overflow: "auto" }}>
                <div className="about-section">
                    <h1 style={{ textAlign: "center", color: "#004080", margin: "10px 0" }}>About Us</h1>
                </div>
                <div className="row">
                    <div className="column" style={{ display: "flex", justifyContent: "center" }}>
                        <div className="card" style={{ margin: "20px", padding: "20px", borderRadius: "8px", border: "2px solid #004080" }}>
                            <div className="container" style={{ textAlign: "center" }}>
                                <h2>Macha.Vivek</h2>
                                <p className="title">Student</p>
                                <p>I am currently studying in Keshav Memorial Institute of Technology.</p>
                                <p>machavivek2003@gmail.com</p>
                                <br></br>
                                <div>
                                <span><button className="button" style={{ backgroundColor: "#004080", color: "white" }}>Contact</button></span>
                                <span>  </span>
                                <span><button onClick={onClose} style={{ backgroundColor: "#004080", color: "white" }}>Close</button></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Aboutus;
