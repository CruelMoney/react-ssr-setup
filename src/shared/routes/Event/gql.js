import gql from 'graphql-tag';

const EVENT = gql`
    query Event($id: ID!, $hash: String!, $locale: String, $currency: Currency) {
        event(id: $id, hash: $hash) {
            id
            name
            description
            start {
                localDate
                formattedTime(locale: $locale)
                formattedDate(locale: $locale)
            }
            end {
                localDate
                formattedTime(locale: $locale)
            }
            timeZone
            genres
            guestsCount
            status
            contactName
            contactPhone
            contactEmail
            address
            rider {
                lights
                speakers
            }
            location {
                name
                latitude
                longitude
            }
            organizer {
                id
                userMetadata {
                    firstName
                }
                picture {
                    path
                }
            }

            review {
                id
            }
            chosenGig {
                id
                status
                offer {
                    canBePaid
                    daysUntilPaymentPossible
                    totalPayment(currency: $currency) {
                        amount
                        currency
                        formatted(locale: $locale)
                    }
                    serviceFee(currency: $currency) {
                        amount
                        currency
                        formatted(locale: $locale)
                    }
                    offer(currency: $currency) {
                        amount
                        currency
                        formatted(locale: $locale)
                    }
                    cancelationPolicy {
                        days
                        percentage
                    }
                }
                dj {
                    id
                    permalink
                    artistName
                    picture {
                        path
                    }
                    email
                    playingLocation {
                        name
                    }
                    userMetadata {
                        firstName
                        phone
                        bio
                    }
                    appMetadata {
                        averageRating
                    }
                }
            }
        }
    }
`;

const EVENT_GIGS = gql`
    query EventGigs($id: ID!, $hash: String!, $currency: Currency, $locale: String) {
        event(id: $id, hash: $hash) {
            id
            gigs {
                id
                status
                offer {
                    canBePaid
                    daysUntilPaymentPossible
                    totalPayment(currency: $currency) {
                        amount
                        currency
                        formatted(locale: $locale)
                    }
                    serviceFee(currency: $currency) {
                        amount
                        currency
                        formatted(locale: $locale)
                    }
                    offer(currency: $currency) {
                        amount
                        currency
                        formatted(locale: $locale)
                    }
                    cancelationPolicy {
                        days
                        percentage
                    }
                }
                dj {
                    id
                    permalink
                    artistName
                    picture {
                        path
                    }
                    email
                    playingLocation {
                        name
                    }
                    userMetadata {
                        firstName
                        phone
                        bio
                    }
                    appMetadata {
                        averageRating
                    }
                }
            }
        }
    }
`;

const EVENT_REVIEW = gql`
    query EventReview($id: ID!, $hash: String!) {
        event(id: $id, hash: $hash) {
            id
            status
            review {
                id
                content
                rating
            }
            chosenGig {
                id
                dj {
                    artistName
                    userMetadata {
                        firstName
                    }
                }
            }
        }
    }
`;

const REQUEST_PAYMENT_INTENT = gql`
    query RequestPaymentintent($id: ID!, $currency: Currency, $locale: String) {
        requestPaymentIntent(gigId: $id, currency: $currency) {
            __typename
            gigId
            recommendedCurrency
            paymentProvider
            token {
                token
            }
            offer {
                totalPayment(currency: $currency) {
                    amount
                    formatted(locale: $locale)
                    currency
                }
                serviceFee(currency: $currency) {
                    amount
                    formatted(locale: $locale)
                    currency
                }
                offer(currency: $currency) {
                    amount
                    formatted(locale: $locale)
                    currency
                }
            }
        }
    }
`;

const PAYMENT_CONFIRMED = gql`
    mutation($gigId: ID!, $eventId: ID!) {
        paymentConfirmed(gigId: $gigId, eventId: $eventId) @client
    }
`;

const DECLINE_DJ = gql`
    mutation($gigId: ID!, $hash: String!) {
        declineDJ(gigId: $gigId, hash: $hash) {
            id
            statusHumanized
            status
        }
    }
`;

const CANCEL_EVENT = gql`
    mutation CancelEvent($id: ID!, $hash: String!, $reason: String) {
        cancelEvent(id: $id, hash: $hash, reason: $reason) {
            id
            status
        }
    }
`;

const UPDATE_EVENT = gql`
    mutation UpdateEvent(
        $id: ID!
        $hash: String!
        $name: String
        $description: String
        $contactEmail: String
        $contactName: String
        $contactPhone: String
        $speakers: Boolean
        $lights: Boolean
        $genres: [String!]
        $guestsCount: Int
        $locale: String
        $address: String
    ) {
        updateEvent(
            id: $id
            hash: $hash
            name: $name
            description: $description
            contactEmail: $contactEmail
            contactName: $contactName
            contactPhone: $contactPhone
            speakers: $speakers
            lights: $lights
            genres: $genres
            guestsCount: $guestsCount
            address: $address
        ) {
            id
            name
            description
            start {
                localDate
                formattedTime(locale: $locale)
                formattedDate(locale: $locale)
            }
            end {
                localDate
                formattedTime(locale: $locale)
            }
            timeZone
            genres
            guestsCount
            status
            contactName
            contactPhone
            contactEmail
            address
            rider {
                lights
                speakers
            }
            location {
                name
                latitude
                longitude
            }
        }
    }
`;

const WRITE_REVIEW = gql`
    mutation WriteReview($id: ID, $gigId: ID!, $content: String, $rating: Float!) {
        writeReview(id: $id, gigId: $gigId, rating: $rating, content: $content) {
            id
            rating
            content
        }
    }
`;

const EVENT_REFUND = gql`
    query Event($id: ID!, $hash: String!, $locale: String, $currency: Currency) {
        event(id: $id, hash: $hash) {
            id
            chosenGig {
                id
                offer {
                    cancelationPolicy {
                        days
                        percentage
                    }
                    isWithinCancelationPolicy
                    daysLeftInCancelationPolicy
                    worstCaseRefund(currency: $currency) {
                        amount
                        currency
                        formatted(locale: $locale)
                    }
                    bestCaseRefund(currency: $currency) {
                        amount
                        currency
                        formatted(locale: $locale)
                    }
                }
            }
        }
    }
`;

export {
    UPDATE_EVENT,
    EVENT,
    REQUEST_PAYMENT_INTENT,
    PAYMENT_CONFIRMED,
    EVENT_GIGS,
    DECLINE_DJ,
    CANCEL_EVENT,
    WRITE_REVIEW,
    EVENT_REVIEW,
    EVENT_REFUND,
};
