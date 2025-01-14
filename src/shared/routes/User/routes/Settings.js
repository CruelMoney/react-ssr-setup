import React, { useState } from 'react';
import emailValidator from 'email-validator';
import { Mutation } from 'react-apollo';
import {
    SettingsSection,
    Input,
    DeleteFileButton,
    LabelHalf,
} from '../../../components/FormComponents';
import constants from '../../../constants/constants';
import ImageUploader from '../../../components/ImageInput';
import PasswordChanger from '../components/PasswordChanger';
import DatePickerPopup from '../../../components/DatePicker';
import LocationPicker from '../components/LocationPicker';
import NotificationPreferences from '../components/NotificationPreferences';
import GenreSelector from '../../../components/GenreSelector';
import CancelationPolicyPopup from '../components/CancelationPolicyPopup';
import PayoutForm from '../../../components/common/PayoutForm';
import Popup from '../../../components/common/Popup';
import { DELETE_USER } from '../gql';
import { PhoneInputNew } from '../../../components/common/PhoneInput';
import TextAreaPopup from '../../../components/TextAreaPopup';
import { useConnectInstagram } from '../../../utils/Hooks';
import VerifyIdentity from '../components/VerifyIdentity';
import ConnectSoundCloud from '../components/ConnectSoundCloud';
import CurrencySelector from '../../../components/CurrencySelector';

const hasChanges = (o1, o2) => {
    const keys = Object.keys(o1);
    return keys.some((key) => o2[key] !== o1[key]);
};

const Settings = ({ user, loading, updateUser, translate, history, location }) => {
    const params = new URLSearchParams(location.search);
    const modal = params.get('modal');
    const verifyIdentity = modal === 'verifyIdentity';
    if (modal) {
        history.push(location.pathname);
    }

    const [connectInstagram, { loading: instaLoading, disconnect }] = useConnectInstagram();

    const saveData = async (data) => {
        const flatUser = {
            ...user,
            ...user.userMetadata,
        };
        if (hasChanges(data, flatUser)) {
            await updateUser({
                variables: {
                    id: user.id,
                    redirectLink: constants.Environment.CALLBACK_DOMAIN,
                    ...data,
                },
            });
        }
    };

    const saveFullName = async (value) => {
        const [firstName, ...lastName] = value.split(' ');
        const data = {
            firstName,
            lastName: lastName.join(' '),
        };

        await saveData(data);
    };

    const updateKey = (key) => async (value) => {
        await updateUser({
            variables: {
                id: user.id,
                [key]: value,
            },
        });
    };

    const toggleAvailability = () => {
        if (!userSettings.standby) {
            const r = window.confirm(
                'You will not receive any gigs while being on standby. Are you sure?'
            );
            if (r !== true) {
                return;
            }
        }
        updateKey('standby')(!userSettings.standby);
    };

    if (loading) {
        return null;
    }
    const {
        userMetadata,
        appMetadata,
        genres,
        playingLocation,
        userSettings,
        email,
        artistName,
        picture,
        permalink,
        isDj,
    } = user;
    const { firstName, lastName, phone, birthday, bankAccount, bio } = userMetadata;
    const { cancelationPolicy, currency, notifications } = userSettings;
    const { roles, instagramConnected, identityVerified, soundCloudConnected } = appMetadata;

    return (
        <>
            <SettingsSection
                id="basics"
                title={'Basics'}
                description={
                    'Edit your basic information. We might require some of this information for verification purposes.'
                }
            >
                <Input
                    label="Full name"
                    defaultValue={`${firstName} ${lastName}`}
                    disabled={identityVerified}
                    placeholder="First Last"
                    type="text"
                    autoComplete="name"
                    name="name"
                    onSave={saveFullName}
                    validation={(v) => {
                        const [firstName, ...lastName] = v.split(' ');
                        if (!firstName || !lastName.some((s) => !!s.trim())) {
                            return 'Please enter both first and last name';
                        }
                    }}
                />
                <Input
                    half
                    label="Email"
                    defaultValue={email}
                    placeholder="mail@email.com"
                    type="email"
                    autoComplete="email"
                    name="email"
                    onSave={(email) => saveData({ email: email.trim() })}
                    validation={(v) => (emailValidator.validate(v) ? null : 'Not a valid email')}
                />
                <PhoneInputNew
                    half
                    label="Phone"
                    attention={!phone}
                    defaultValue={phone}
                    placeholder="+123456789"
                    type="tel"
                    autoComplete="tel"
                    name="phone"
                    onSave={(phone) => saveData({ phone: phone.trim() })}
                />
                <PasswordChanger half onSave={saveData} />

                <DatePickerPopup
                    half
                    maxDate={new Date()}
                    minDate={false}
                    label={'Birthday'}
                    disabled={identityVerified}
                    onSave={(date) => saveData({ birthday: date })}
                    initialDate={birthday}
                />
                <ImageUploader
                    half
                    label="Profile picture"
                    buttonText="change picture"
                    attention={!picture}
                    onSave={updateKey('picture')}
                />
            </SettingsSection>

            {isDj && (
                <SettingsSection
                    id="profile"
                    title={'Profile'}
                    description={
                        'Edit your profile to make it look good and get more bookings. Make the organizers feel good about booking you!'
                    }
                >
                    <Input
                        label="Artist name"
                        attention={!artistName}
                        defaultValue={artistName}
                        placeholder="Dj Khaled"
                        type="text"
                        onSave={(artistName) => saveData({ artistName: artistName.trim() })}
                    />
                    <Input
                        label="URL"
                        placeholder="https://cueup.io/"
                        type="formatted-text"
                        defaultValue={permalink}
                        onSave={async (permalink) => {
                            saveData({ permalink: permalink.trim() });
                        }}
                    />
                    <LocationPicker
                        initialLocation={playingLocation}
                        save={(playingLocation) => saveData({ playingLocation })}
                    />

                    <GenreSelector initialGenres={genres} save={(genres) => saveData({ genres })} />
                    <CancelationPolicyPopup
                        initialValue={cancelationPolicy}
                        save={(p) =>
                            saveData({
                                refundPercentage: p.percentage,
                                cancelationDays: p.days,
                            })
                        }
                        translate={translate}
                    />
                    <TextAreaPopup
                        initialValue={bio || ''}
                        label="Bio"
                        save={(bio) =>
                            saveData({
                                bio,
                            })
                        }
                    />

                    <ImageUploader
                        half
                        label="Cover photo"
                        buttonText="change photo"
                        onSave={updateKey('coverPhoto')}
                        options={{ maxWidth: 1440, maxHeight: 400 }}
                    >
                        {user.coverPhoto && (
                            <DeleteFileButton onClick={(_) => updateKey('coverPhoto')(null)}>
                                x
                            </DeleteFileButton>
                        )}
                    </ImageUploader>

                    <Input
                        half
                        type="button"
                        attention={userSettings.standby}
                        label="Standby"
                        onClick={toggleAvailability}
                        buttonText={userSettings.standby ? 'unavailable' : 'available'}
                    />
                </SettingsSection>
            )}

            <SettingsSection
                id="preferences"
                title={'Preferences'}
                description={'Change your preferences for getting paid and notifications.'}
            >
                {isDj && <PayoutPopup user={user} hasPayout={bankAccount} />}

                <CurrencySelector
                    half
                    label="Preferred currency"
                    initialValue={currency || ''}
                    onSave={(currency) => saveData({ currency })}
                />

                <NotificationPreferences
                    notifications={notifications}
                    onSave={(notificationSettings) => saveData({ notificationSettings })}
                    roles={roles}
                />
            </SettingsSection>

            <SettingsSection
                id="system"
                title={'System'}
                description={
                    'If you delete your user, all data will be deleted and unrecoverable. If you have any unfinished gigs, they will all be declined and cancelled.'
                }
            >
                <Mutation
                    mutation={DELETE_USER}
                    variables={{
                        id: user.id,
                    }}
                    onCompleted={() => {
                        history.push('/');
                    }}
                >
                    {(deleteUser) => {
                        const doMutate = () => {
                            const confirmed = window.confirm(
                                translate('user.preferences.delete-warning')
                            );
                            if (!confirmed) {
                                return;
                            }
                            deleteUser();
                        };

                        return (
                            <Input
                                half
                                type="button"
                                label="Delete user"
                                warning={true}
                                onClick={() => doMutate()}
                                buttonText="delete"
                            />
                        );
                    }}
                </Mutation>
                <Input
                    half
                    type="button"
                    label="Export all data"
                    buttonText="export"
                    onClick={(_) =>
                        window.alert("We'll send you an email when your data is ready.")
                    }
                />

                <Input
                    half
                    loading={instaLoading}
                    type="button"
                    warning={instagramConnected ? 'Are you sure?' : false}
                    label={'Connect Instagram'}
                    onClick={() => (instagramConnected ? disconnect() : connectInstagram())}
                    buttonText={instagramConnected ? 'disconnect' : 'connect'}
                />
                {isDj && (
                    <LabelHalf>
                        Connect SoundCloud
                        <ConnectSoundCloud
                            soundCloudConnected={soundCloudConnected}
                            userId={user.id}
                        />
                    </LabelHalf>
                )}
                <VerifyIdentityPopup
                    user={user}
                    identityVerified={identityVerified}
                    initialShowing={verifyIdentity}
                />
                <LabelHalf />
            </SettingsSection>
        </>
    );
};

const PayoutPopup = ({ user, hasPayout }) => {
    const [showing, setShowing] = useState(false);

    return (
        <>
            <Input
                half
                type="button"
                attention={!hasPayout}
                onClick={(s) => setShowing(true)}
                label="Payout information"
                buttonText={'update'}
            />
            <Popup showing={showing} onClickOutside={(_) => setShowing(false)} width={'450px'}>
                <PayoutForm color={'#31daff'} isUpdate={hasPayout} user={user} />
            </Popup>
        </>
    );
};

const VerifyIdentityPopup = ({ user, identityVerified, initialShowing = false }) => {
    const [showing, setShowing] = useState(initialShowing);

    return (
        <>
            <Input
                half
                type="button"
                attention={!identityVerified}
                onClick={(s) => setShowing(true)}
                label="Verify identity"
                buttonText={identityVerified ? 'verified' : 'get verified'}
                success={identityVerified}
                disabled={identityVerified}
            />
            <Popup showing={showing} onClickOutside={(_) => setShowing(false)} width={'550px'}>
                <VerifyIdentity
                    isUpdate={identityVerified}
                    user={user}
                    onCancel={(_) => setShowing(false)}
                />
            </Popup>
        </>
    );
};

export default Settings;
