import React, { Component } from 'react';
import connectToForm from '../higher-order/connectToForm';
import ToggleButton from './ToggleButton';
import ToggleButtonInput from './ToggleButtonInput';

class ToggleButtonHandler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addedGenres: [],
            selectedValues: [...this.parseValues(props.value)],
            potentialValues: [...new Set(this.parseValues(props.potentialValues))],
        };
    }

    parseValues = (vals) => {
        return vals
            .filter((v) => !!v)
            .map((v) => {
                const name = typeof v === 'string' ? v : v.name;
                return name.toLowerCase();
            });
    };

    static defaultProps = {
        rounded: true,
        columns: 3,
        potentialValues: [],
        value: [],
        errorAbove: false,
        required: true,
    };

    spliceHelper(list, index) {
        list.splice(index, 1);
        return list;
    }

    getFilteredAddedGenres = () => {
        return this.state.addedGenres.filter((g) => !this.state.selectedValues.includes(g));
    };

    updateContext = () => {
        const concatList = [
            ...new Set([
                ...this.state.addedGenres.map((g) => g.toLowerCase()).filter((g) => !!g.trim()),
                ...this.state.selectedValues.map((g) => g.toLowerCase()),
            ]),
        ];

        this.props.onChange(concatList);
    };

    handleButtonPress = (value) => {
        const toggledButtons = this.state.selectedValues;
        const valueIndex = toggledButtons.indexOf(value);

        const newList =
            valueIndex === -1
                ? [...toggledButtons, value]
                : this.spliceHelper(toggledButtons, valueIndex);

        this.setState(
            {
                selectedValues: newList,
            },
            this.updateContext
        );
    };

    handleAddNew = () => {
        this.setState((state) => ({
            addedGenres: [...state.addedGenres, ' '],
        }));
    };

    inputUpdate = (val, id) => {
        if (!val.trim()) {
            return;
        }
        this.setState((state) => {
            const addedGenres = state.addedGenres.map((g, idx) => {
                if (idx === id) {
                    return val;
                }
                return g;
            });
            return {
                addedGenres,
            };
        }, this.updateContext);
    };

    getButton = (genre, type, idx) => {
        let name = typeof genre === 'string' ? genre : genre.name;
        name = name.toLowerCase();

        switch (type) {
            case 'add-button':
                return (
                    <td key={genre} data-key={genre}>
                        <ToggleButton
                            color={this.props.color}
                            rounded={this.props.rounded}
                            label={'Add new +'}
                            active={false}
                            disabled={this.props.disabled}
                            onClick={this.handleAddNew}
                        />
                    </td>
                );
            case 'edit-button':
                return (
                    <td key={'edit-genre-' + idx} data-key={'edit-genre-' + idx}>
                        <ToggleButtonInput
                            color={this.props.color}
                            onChange={(value) => this.inputUpdate(value, idx)}
                            active={true}
                            rounded={this.props.rounded}
                        />
                    </td>
                );
            default:
                return (
                    <td key={genre} data-key={genre}>
                        <ToggleButton
                            color={this.props.color}
                            rounded={this.props.rounded}
                            label={name}
                            active={this.state.selectedValues.includes(name)}
                            disabled={this.props.disabled}
                            onClick={this.handleButtonPress}
                        />
                    </td>
                );
        }
    };

    render() {
        const { addedGenres, potentialValues } = this.state;

        const rows = [];
        let buttons = [];
        let currentRow = 0;
        let idx = 0;
        let itemCount = potentialValues.length + addedGenres.length;
        itemCount = !this.props.disabled && this.props.enableAdditions ? itemCount + 1 : itemCount;

        const rowLogic = (_) => {
            if (++idx % this.props.columns === 0 || idx === itemCount) {
                currentRow++;
                rows.push(<tr key={currentRow}>{buttons}</tr>);
                buttons = [];
            }
        };

        potentialValues.forEach((genre) => {
            buttons.push(this.getButton(genre, 'normal-button'));
            rowLogic();
        });
        addedGenres.forEach((genre, _idx) => {
            buttons.push(this.getButton(genre, 'edit-button', _idx));
            rowLogic();
        });

        if (!this.props.disabled && this.props.enableAdditions) {
            buttons.push(this.getButton('add', 'add-button'));
            rowLogic();
        }

        return (
            <div>
                <div className="toggle-button-handler">
                    {this.props.errors.length && this.props.errorAbove ? (
                        <div className="errors">
                            {this.props.errors.map((error, i) => (
                                <p key={i}>{error}</p>
                            ))}
                        </div>
                    ) : null}

                    <table>
                        <tbody>{rows}</tbody>
                    </table>
                </div>
                {this.props.errors.length && !this.props.errorAbove ? (
                    <div style={{ marginTop: '10px' }} className="errors">
                        {this.props.errors.map((error, i) => (
                            <p className="error" key={i}>
                                {error}
                            </p>
                        ))}
                    </div>
                ) : null}
            </div>
        );
    }
}

export default connectToForm(ToggleButtonHandler);

export { ToggleButtonHandler };
