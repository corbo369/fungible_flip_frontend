import React, { useState, useEffect } from 'react';
import './styles/fungibleFlip.css';

interface AlertProps {
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose();
        }, 5000);

        const interval = setInterval(() => {
            setProgress((prevProgress) => prevProgress - (100 / 5000) * 50);
        }, 50);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [onClose]);

    return (
        <React.Fragment>
            {visible && (
                <button className={`alert-mobile alert-${type} ${visible ? 'show' : ''}`}>
                    <div className="progress-bar-mobile" style={{width: `${progress}%`}}/>
                    {message}
                </button>
            )}
        </React.Fragment>
    );
};

export default Alert;