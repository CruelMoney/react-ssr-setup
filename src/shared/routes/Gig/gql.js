import gql from 'graphql-tag';

const GIG = gql`
    query($id: ID!, $locale: String) {
        gig(id: $id) {
            id
            status
            statusHumanized
            expires
            directBooking
            isActionable
            offer {
                offer {
                    amount
                    currency
                    formatted(locale: $locale)
                }
                serviceFee {
                    amount
                    formatted(locale: $locale)
                }
                djFee {
                    amount
                    formatted(locale: $locale)
                }
                totalPayment {
                    amount
                    formatted(locale: $locale)
                }
                totalPayout {
                    amount
                    formatted(locale: $locale)
                }
                discount
                cancelationPolicy {
                    percentage
                    days
                }
            }
            event {
                id
                name
                guestsCount
                contactEmail
                contactName
                contactPhone
                address
                start {
                    localDate
                    formattedDate
                    formattedTime
                }
                end {
                    localDate
                    formattedDate
                    formattedTime
                }
                genres
                description
                location {
                    latitude
                    longitude
                    name
                }
                rider {
                    speakers
                    lights
                    formatted
                }
                organizer {
                    id
                    picture {
                        path
                    }
                    userMetadata {
                        firstName
                    }
                }
                duration {
                    formatted
                }
            }
            review {
                id
                rating
                title
                content
                isTestimonial
                citation
                createdAt
                author {
                    picture {
                        path
                    }
                    userMetadata {
                        firstName
                    }
                }
            }
        }
    }
`;

const DECLINE_GIG = gql`
    mutation declineGig($id: ID!, $reason: String!) {
        declineGig(id: $id, reason: $reason) {
            id
            statusHumanized
            status
            isActionable
        }
    }
`;

const CANCEL_GIG = gql`
    mutation cancelGig($id: ID!, $reason: String!) {
        cancelGig(id: $id, reason: $reason) {
            id
            statusHumanized
            status
            isActionable
        }
    }
`;

const GET_OFFER = gql`
    mutation GetOffer($gigId: ID!, $amount: Int!, $currency: Currency!, $locale: String) {
        getOffer(gigId: $gigId, amount: $amount, currency: $currency) {
            offer {
                amount
                formatted(locale: $locale)
            }
            serviceFee {
                amount
                formatted(locale: $locale)
            }
            djFee {
                amount
                formatted(locale: $locale)
            }
            totalPayment {
                amount
                formatted(locale: $locale)
            }
            totalPayout {
                amount
                formatted(locale: $locale)
            }
        }
    }
`;

const MAKE_OFFER = gql`
    mutation MakeOffer($gigId: ID!, $amount: Int!, $currency: Currency!, $locale: String) {
        makeOffer(gigId: $gigId, amount: $amount, currency: $currency) {
            offer {
                amount
                formatted(locale: $locale)
            }
            serviceFee {
                amount
                formatted(locale: $locale)
            }
            djFee {
                amount
                formatted(locale: $locale)
            }
            totalPayment {
                amount
                formatted(locale: $locale)
            }
            totalPayout {
                amount
                formatted(locale: $locale)
            }
        }
    }
`;

export { GIG, CANCEL_GIG, DECLINE_GIG, MAKE_OFFER, GET_OFFER };
