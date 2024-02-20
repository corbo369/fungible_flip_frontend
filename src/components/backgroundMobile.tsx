import React from 'react';
import Cherry from '../assets/images/cherry.png';
import './styles/background.css';

// @ts-ignore
const Subcomponent = ({ hasTopWall, hasBottomWall, hasLeftWall, hasRightWall, hasDot, hasPowerup, hasCherry }) => {
    const subcomponentClasses = `subcomponent-mobile ${(hasDot || hasPowerup || hasCherry) ? 'with-item' : ''} ${
        hasTopWall ? 'has-top-wall' : ''
    } ${hasBottomWall ? 'has-bottom-wall' : ''} ${hasLeftWall ? 'has-left-wall' : ''} ${
        hasRightWall ? 'has-right-wall' : ''
    }`;

    return (
        <div className={subcomponentClasses}>
            {hasDot && <div className="dot-mobile"/>}
            {hasPowerup && <div className="powerup-mobile"/>}
            {hasCherry && <img className="cherry-mobile" src={Cherry} alt="cherry"/>}
        </div>
    );
};

const BackgroundMobile = () => {
    const grid = [
        [
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
        ],
        [
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
        ],
        [
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
        ],
        [
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
        ],
        [
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
        ],
        [
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
        ],
        [
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
        ],
        [
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
        ],
        [
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
        ],
        [
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
        ],
        [
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: true, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
        ],
        [
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
        ],
        [
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
        ],
        [
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
        ],
        [
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
            { hasTopWall: false, hasBottomWall: false, hasLeftWall: false, hasRightWall: false, hasDot: false, hasPowerup: false, hasCherry: false },
        ],
    ];

    return (
        <div className="pacman-background-mobile">
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((subcomponentProps, columnIndex) => (
                        <Subcomponent
                            key={columnIndex}
                            {...subcomponentProps}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default BackgroundMobile;