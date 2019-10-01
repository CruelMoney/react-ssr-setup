import c from '../constants/constants';

const ActionTypes = c.ActionTypes;

export function changeCurrency(currency) {
    return {
        type: ActionTypes.CHANGE_CURRENCY,
        value: currency,
    };
}
