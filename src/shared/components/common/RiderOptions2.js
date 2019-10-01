import React from 'react';
import connectToForm from '../higher-order/connectToForm';
import ToggleButton from './ToggleButton';

class RiderOptions extends React.Component {
    render() {
        const { speakersLabel, lightsLabel } = this.props;
        return (
            <div className="toggle-options">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <ConnectedToggle name="speakers" label={speakersLabel} />
                            </td>

                            <td>
                                <ConnectedToggle name="lights" label={lightsLabel} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

const MyToggleButton = ({ onChange, label }) => {
    const onClick = (val) => () => {
        onChange(val);
    };

    return (
        <ToggleButton onClick={onClick(true)} onClickToggled={onClick(false)} label={label} rounded>
            {label}
        </ToggleButton>
    );
};
const ConnectedToggle = connectToForm(MyToggleButton);
export default RiderOptions;
export { RiderOptions as DisconnectedRiderOptions };
