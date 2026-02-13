import React from 'react'
import '../scss/Footer.scss'

const Footer = () => {
    const handleDonateClick = async () => {
        try {
            if (typeof window !== 'undefined' && window.electronAPI) {
                console.log('Opening Ko-fi link via Electron shell...');
                await window.electronAPI.openExternal('https://ko-fi.com/wenzdev');
            } else {
                console.log('Opening Ko-fi link via browser fallback...');
                window.open('https://ko-fi.com/wenzdev', '_blank', 'noopener,noreferrer');
            }
        } catch (error) {
            console.error('Error opening donation link:', error);
            window.open('https://ko-fi.com/wenzdev', '_blank', 'noopener,noreferrer');
        }
    };

    const handleWenzClick = async () => {
        try {
            if (typeof window !== 'undefined' && window.electronAPI) {
                console.log('Opening WENZ website via Electron shell...');
                await window.electronAPI.openExternal('https://wenz-taupe.vercel.app/');
            } else {
                console.log('Opening WENZ website via browser fallback...');
                window.open('https://wenz-taupe.vercel.app/', '_blank', 'noopener,noreferrer');
            }
        } catch (error) {
            console.error('Error opening WENZ website:', error);
            window.open('https://wenz-taupe.vercel.app/', '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-left">
                        <div className="copyright">
                            <span>Made with </span>
                            <span className="heart">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </span>
                            <span> by </span>
                            <span 
                                className="wenz-link" 
                                onClick={handleWenzClick}
                                title="Visit WENZ website"
                                style={{ cursor: 'pointer' }}
                            >
                                WENZ
                            </span>
                        </div>
                    </div>

                    <div className="footer-right">
                        <button
                            className="donate-btn"
                            onClick={handleDonateClick}
                            title="Support the developer on Ko-fi"
                        >
                            <img
                                src="./images/kofiLogo.png"
                                alt="Ko-fi"
                                className="kofi-icon"
                            />
                            <span className="donate-text">Donate</span>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer