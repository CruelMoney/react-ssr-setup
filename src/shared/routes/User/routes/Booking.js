import React, { useState } from 'react';
import emailValidator from 'email-validator';
import styled from 'styled-components';
import moment from 'moment-timezone';
import wNumb from 'wnumb';
import { Mutation } from 'react-apollo';
import * as Sentry from '@sentry/browser';
import ReactPixel from 'react-facebook-pixel';
import { SettingsSection, Input, Label, useForm } from '../../../components/FormComponents';
import DatePickerPopup from '../../../components/DatePicker';
import { Row, Container, Col, GradientBg } from '../../../components/Blocks';
import Sidebar, { SidebarContent, CTAButton } from '../../../components/Sidebar';
import ScrollToTop from '../../../components/common/ScrollToTop';
import { LoadingPlaceholder2 } from '../../../components/common/LoadingPlaceholder';
import { SmallHeader } from '../../../components/Text';
import RiderOptions from '../components/RiderOptions';
import TimeSlider from '../../../components/common/TimeSlider';
import Slider from '../../../components/common/Slider';
import { CREATE_EVENT } from '../../../components/common/RequestForm/gql';
import Popup from '../../../components/common/Popup';
import Login from '../../../components/common/Login';
import ErrorMessageApollo from '../../../components/common/ErrorMessageApollo';
import GeoCoder from '../../../utils/GeoCoder';
import * as tracker from '../../../utils/analytics/autotrack';
import { MobileBookingButton } from '../components/Common';

const Booking = ({ user, loading, translate }) => {
    const [eventCreated, setEventCreated] = useState(false);

    const [form, setForm] = useState({
        guestsCount: 80,
        speakers: false,
        lights: false,
    });
    const [loginPopup, setloginPopup] = useState(false);

    const { registerValidation, unregisterValidation, runValidations } = useForm(form);

    const setValue = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

    const requestBooking = (mutate) => async () => {
        const refs = runValidations();
        if (refs[0] && refs[0].current) {
            window.scrollTo({
                behavior: 'smooth',
                top: refs[0].current.offsetTop,
            });
            return;
        }
        try {
            const { timeZoneId } = await GeoCoder.getTimeZone({
                lat: user.playingLocation.latitude,
                lng: user.playingLocation.longitude,
            });

            await mutate({
                variables: {
                    ...form,
                    timeZoneId,
                    djId: user.id,
                    genres: user.genres,
                    location: {
                        latitude: user.playingLocation.latitude,
                        longitude: user.playingLocation.longitude,
                        name: user.playingLocation.name,
                    },
                },
            });
            setEventCreated(true);
            tracker.trackEventPosted();
            ReactPixel.track('Lead');
        } catch (error) {
            Sentry.captureException(error);
        }
    };

    return (
        <div>
            <ScrollToTop top={0} />

            <GradientBg style={{ height: '80px', minHeight: '80px' }} />

            <Popup width="380px" showing={loginPopup} onClickOutside={() => setloginPopup(false)}>
                <div>
                    <p style={{ marginBottom: '20px' }}>
                        {translate('request-form.email-exists-message')}
                    </p>
                    <Login
                        redirect={false}
                        onLogin={() => {
                            setloginPopup(false);
                        }}
                    />
                </div>
            </Popup>

            <Container>
                {eventCreated ? (
                    <SuccessMessage translate={translate} />
                ) : (
                    <EventForm
                        setValue={setValue}
                        registerValidation={registerValidation}
                        unregisterValidation={unregisterValidation}
                        form={form}
                        translate={translate}
                        user={user}
                        loading={loading}
                        requestBooking={requestBooking}
                        setloginPopup={setloginPopup}
                        loginPopup={loginPopup}
                    />
                )}
            </Container>
        </div>
    );
};

const EventFormWrapper = styled(Row)`
    .sidebar {
        margin-left: 60px;
        margin-top: 42px;
        @media only screen and (max-width: 768px) {
            margin-left: 30px;
            margin-top: 0px;
        }
    }
`;

const EventForm = ({
    setValue,
    registerValidation,
    unregisterValidation,
    form,
    translate,
    user,
    loading,
    requestBooking,
    setloginPopup,
    loginPopup,
}) => (
    <EventFormWrapper>
        <Col
            style={{
                marginTop: '42px',
                width: '100%',
                marginBottom: '60px',
                zIndex: 0,
                position: 'relative',
            }}
        >
            <SettingsSection
                stickyTop={'24px'}
                title={'Event Details'}
                description={'Tell us about your event to help the dj decide on a fair price.'}
            >
                <Input
                    half
                    type="text"
                    label="Event Name"
                    placeholder="Add a short, clear name"
                    onSave={setValue('name')}
                    validation={(v) => (v ? null : 'Please enter a name')}
                    registerValidation={registerValidation('name')}
                    unregisterValidation={unregisterValidation('name')}
                />
                <DatePickerPopup
                    half
                    label={'Date'}
                    minDate={new Date()}
                    initialDate={form.date ? moment(form.date) : null}
                    showMonthDropdown={false}
                    showYearDropdown={false}
                    maxDate={false}
                    onSave={setValue('date')}
                    validation={(v) => (v ? null : 'Please select a date')}
                    registerValidation={registerValidation('date')}
                    unregisterValidation={unregisterValidation('date')}
                />
                <Label
                    style={{
                        width: '100%',
                        marginRight: '36px',
                        marginBottom: '30px',
                    }}
                >
                    <span style={{ marginBottom: '12px', display: 'block' }}>Duration</span>
                    <TimeSlider
                        color={'#50e3c2'}
                        hoursLabel={translate('hours')}
                        startLabel={translate('start')}
                        endLabel={translate('end')}
                        date={moment(form.date)}
                        onChange={([start, end]) => {
                            setValue('startMinute')(start);
                            setValue('endMinute')(end);
                        }}
                    />
                </Label>

                <Label
                    style={{
                        width: '100%',
                        marginRight: '36px',
                        marginBottom: '30px',
                    }}
                >
                    <span style={{ marginBottom: '12px', display: 'block' }}>Guests</span>

                    <Slider
                        color={'#50e3c2'}
                        name="guestsCount"
                        range={{
                            'min': 1,
                            '50%': 100,
                            '80%': 500,
                            'max': 1000,
                        }}
                        step={1}
                        connect="lower"
                        value={[80]}
                        onChange={(values) => {
                            setValue('guestsCount')(values[0]);
                        }}
                        format={wNumb({
                            decimals: 0,
                        })}
                    />
                    <span
                        style={{ marginTop: '15px', display: 'block' }}
                    >{`${form.guestsCount} people`}</span>
                </Label>
                <RiderOptions
                    onSave={({ speakers, lights }) => {
                        setValue('speakers')(speakers);
                        setValue('lights')(lights);
                    }}
                />

                <Input
                    type="text-area"
                    label={'Description'}
                    placeholder={translate('request-form.step-3.event-description-description')}
                    style={{
                        height: '200px',
                    }}
                    onSave={setValue('description')}
                    validation={(v) => (v ? null : 'Please enter a description')}
                    registerValidation={registerValidation('description')}
                    unregisterValidation={unregisterValidation('description')}
                />
            </SettingsSection>

            <SettingsSection
                stickyTop={'24px'}
                title={'Contact Details'}
                description={
                    'How should we get back to you with updates from the dj? Your information is only shared with the dj.'
                }
            >
                <Input
                    type="text"
                    label="Contact Name"
                    autoComplete="name"
                    placeholder="First Last"
                    validation={(v) => {
                        if (!v) {
                            return 'Please enter name';
                        }
                        const [firstName, ...lastName] = v.split(' ');
                        if (!firstName || !lastName.some((s) => !!s.trim())) {
                            return 'Please enter both first and last name';
                        }
                    }}
                    required
                    onSave={setValue('contactName')}
                    registerValidation={registerValidation('contactName')}
                    unregisterValidation={unregisterValidation('contactName')}
                />

                <Input
                    placeholder="mail@email.com"
                    type="email"
                    autoComplete="email"
                    label="Contact Email"
                    validation={(v) => (emailValidator.validate(v) ? null : 'Not a valid email')}
                    onSave={setValue('contactEmail')}
                    registerValidation={registerValidation('contactEmail')}
                    unregisterValidation={unregisterValidation('contactEmail')}
                />
                <Input
                    label="Contact Phone"
                    placeholder="+123456789"
                    type="tel"
                    autoComplete="tel"
                    onSave={setValue('contactPhone')}
                />
            </SettingsSection>
        </Col>
        <BookingSidebar
            key={loginPopup}
            loading={loading}
            user={user}
            values={form}
            requestBooking={requestBooking}
            showLogin={() => setloginPopup(true)}
        />
    </EventFormWrapper>
);

const BookingSidebar = ({ loading, values, requestBooking, showLogin, ...props }) => {
    return (
        <Mutation mutation={CREATE_EVENT}>
            {(mutate, { error, loading: createLoading }) => (
                <>
                    <Sidebar
                        showCTAShadow
                        stickyTop={'0px'}
                        enableSharing={false}
                        childrenBelow={
                            <ErrorMessageApollo
                                error={error}
                                style={{ marginTop: '30px' }}
                                onFoundCode={(code) => {
                                    if (code === 'UNAUTHENTICATED') {
                                        showLogin();
                                    }
                                }}
                            />
                        }
                    >
                        <SidebarContent>
                            {loading ? (
                                <LoadingPlaceholder2 />
                            ) : (
                                <Content values={values} {...props} />
                            )}
                        </SidebarContent>

                        <CTAButton
                            disabled={createLoading}
                            loading={createLoading}
                            onClick={requestBooking(mutate)}
                        >
                            BOOK NOW
                        </CTAButton>
                    </Sidebar>

                    <MobileBookingButton>
                        <CTAButton
                            disabled={createLoading}
                            loading={createLoading}
                            onClick={requestBooking(mutate)}
                        >
                            BOOK NOW
                        </CTAButton>
                    </MobileBookingButton>
                </>
            )}
        </Mutation>
    );
};

const SidebarRow = styled(Row)`
    font-family: 'AvenirNext-DemiBold', Arial, Helvetica, sans-serif;
    font-size: 15px;
    color: #98a4b3;
    align-items: center;
    margin-bottom: 12px;
`;

const SimpleTableItem = styled(SidebarRow)`
    border-bottom: 1px solid #e2e8f0;
    padding: 15px 0;
    margin: 0;
    justify-content: space-between;
    &:first-child {
        border-top: 1px solid #e2e8f0;
        margin-top: 24px;
    }

    > *:first-child {
        color: #122b48;
    }
`;

const Content = ({ user, values }) => {
    const { artistName, userMetadata } = user;
    const { firstName } = userMetadata;

    const { guestsCount, date, speakers, lights, startMinute, endMinute, name } = values;

    return (
        <>
            <SmallHeader style={{ marginBottom: '15px' }}>{`Booking of ${artistName ||
                firstName}`}</SmallHeader>
            {name && <SidebarRow>{name}</SidebarRow>}
            <SidebarRow>{moment(date).format('dddd Do MMMM, YYYY')}</SidebarRow>
            <SidebarRow>
                From{' '}
                {moment(date)
                    .startOf('day')
                    .add(startMinute, 'minutes')
                    .format('HH:mm')}{' '}
                to{' '}
                {moment(date)
                    .startOf('day')
                    .add(endMinute, 'minutes')
                    .format('HH:mm')}
            </SidebarRow>
            <SidebarRow>{guestsCount} guests</SidebarRow>
            {speakers && <SidebarRow>Including speakers</SidebarRow>}
            {lights && <SidebarRow>Including lights</SidebarRow>}
            <div>
                <SimpleTableItem>
                    <span>Dj price</span>
                    <span>00.00</span>
                </SimpleTableItem>
                <SimpleTableItem>
                    <span>Service fee</span>
                    <span>00.00</span>
                </SimpleTableItem>
                <SimpleTableItem>
                    <span>Total</span>
                    <span>dj will respond with price</span>
                </SimpleTableItem>
            </div>
        </>
    );
};

const SuccessMessage = ({ translate }) => (
    <Row middle center>
        <div className="col-md-8 thank-you-text">
            <p
                className="center"
                style={{
                    fontSize: '32px',
                    textAlign: 'center',
                    lineHeight: '45px',
                }}
            >
                {translate('request-form.succes-message')}
            </p>
        </div>
    </Row>
);

export default Booking;
