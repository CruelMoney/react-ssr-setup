import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Spinner } from 'react-activity';
import 'react-activity/lib/Spinner/Spinner.css';

const Notification = ({
    overlay,
    loading,
    children,
    active,
    bottom,
    message = 'You have no new notifications',
}) => {
    const [show, setShow] = useState(false);
    const portal = useRef();

    useEffect(() => {
        portal.current = document.querySelector('#notification-portal');
        setShow(true);
    }, []);

    if (!show || !portal.current) {
        return null;
    }

    return createPortal(
        <div
            className={`center ${overlay ? 'notification-overlay' : ''} ${active ? 'active' : ''} ${
                bottom ? 'bottom' : ''
            }`}
        >
            <div className="notification">
                <div>
                    {loading && <Spinner color="#fff" />}
                    {children || <p style={{ marginLeft: '8px' }}>{message}</p>}
                </div>
            </div>
        </div>,
        portal.current
    );
};

export default Notification;
