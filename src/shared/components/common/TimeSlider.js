import React, { useState, useEffect, useContext } from 'react';
import wNumb from 'wnumb';
import moment from 'moment-timezone';
import Slider from './Slider';
import { FormContext } from './Form-v2';

const TimeSlider = ({
    onChange,
    startTime,
    endTime,
    hoursLabel,
    startLabel,
    endLabel,
    color,
    disabled,
}) => {
    const [values, setValues] = useState([21 * 60, 27 * 60]);
    const { updateValue } = useContext(FormContext);

    useEffect(() => {
        if (startTime && endTime) {
            // parse and keep utc offset to get original hour and minute
            const date = moment.parseZone(startTime).startOf('day');
            const newStartTime = moment.parseZone(startTime);
            const newEndTime = moment.parseZone(endTime);

            setValues([newStartTime.diff(date, 'minutes'), newEndTime.diff(date, 'minutes')]);
        }
    }, [startTime, endTime]);

    const handleChange = (values) => {
        setValues(values);
        if (onChange) {
            onChange(values);
        }
    };

    useEffect(() => {
        if (updateValue) {
            updateValue('startMinute', values[0]);
            updateValue('endMinute', values[1]);
        }
    }, [updateValue, values]);

    const getValues = (values) => {
        return {
            startHour: Math.floor((values[0] / 60) % 24),
            endHour: Math.floor((values[1] / 60) % 24),
            startMinute: Math.floor(values[0] % 60),
            endMinute: Math.floor(values[1] % 60),
            difHours: (values[1] - values[0]) / 60,
        };
    };
    const { startHour, startMinute, difHours, endHour, endMinute } = getValues(values);
    const formatNumber = (num) => {
        return num < 10 ? '0' + num : String(num);
    };
    return (
        <div>
            <div>
                <Slider
                    disabled={disabled}
                    name="time"
                    range={{
                        min: 7 * 60,
                        max: 32 * 60,
                    }}
                    color={color}
                    step={30} //Steps of half hour
                    value={values}
                    onChange={handleChange}
                    format={wNumb({
                        decimals: 0,
                    })}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                }}
            >
                <p>{`${startLabel}: ${formatNumber(startHour)}:${formatNumber(startMinute)}`}</p>
                <p>
                    <span>{`${difHours} ${hoursLabel}`}</span>
                </p>
                <p>{`${endLabel}: ${formatNumber(endHour)}:${formatNumber(endMinute)}`}</p>
            </div>
        </div>
    );
};

export default TimeSlider;
