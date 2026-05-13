import React from 'react';
import bugLogo from '../assets/bug.svg';

interface BrandLogoProps {
    onClick?: () => void;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ onClick }) => (
    <div className="logo-container" onClick={onClick}>
        <img src={bugLogo} alt="bug logo" className="logo-icon" />
        <span className="logo-text">BYEBUG</span>
    </div>
);

export default BrandLogo;
