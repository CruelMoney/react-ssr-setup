import React, { useState } from 'react';

const sizes = {
    normal: {
        width: '21px',
        height: '20px',
    },
    large: {
        width: '42px',
        height: '40px',
    },
};

const Star = ({ active, size, onHover, ...props }) => {
    return (
        <svg
            {...sizes[size]}
            className={'ratingStar ' + (active ? 'active' : '')}
            viewBox="0 0 22 20"
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            {...props}
        >
            <path
                d="M9 14.65l-5.562 2.904 1.062-6.15L0 7.046l6.219-.897L9 .554l2.781 5.596L18 7.047l-4.5 4.356 1.062 6.15z"
                fill="#50E3C2"
                stroke="#50E3C2"
                fillRule="evenodd"
                opacity={active ? 1 : 0.5}
            />
        </svg>
    );
};

const Rating = ({ onChange, size, style, ...props }) => {
    const [original, setOriginal] = useState(props.rating || 0);
    const [rating, setRating] = useState(props.rating || 0);

    const onClick = (idx) => {
        setOriginal(idx + 1);
        setRating(idx + 1);
        onChange && onChange(idx + 1);
    };

    const onHover = (idx) => (hovering) => {
        if (hovering) {
            setRating(idx + 1);
        } else {
            setRating(original);
        }
    };

    const stars = Array.from({ length: 5 }, (_, idx) => (
        <Star
            key={idx}
            active={idx < rating}
            size={size}
            onClick={() => onClick(idx)}
            onHover={onHover(idx)}
        />
    ));

    return (
        <div className="rating" style={style}>
            {stars}
        </div>
    );
};

export default Rating;
