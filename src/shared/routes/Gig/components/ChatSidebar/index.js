import React, { useRef, useEffect, useCallback, useLayoutEffect, memo } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Sidebar, { SidebarContent } from '../../../../components/Sidebar';
import { Title, Body } from '../../../../components/Text';
import { Col, RowWrap } from '../../../../components/Blocks';
import Chat, { MessageComposer } from '../../../../components/common/Chat';
import ContactPills from '../blocks/ContactPills';
import { gigStates } from '../../../../constants/constants';
import useChat from '../../../../components/common/Chat/useChat';

const ChatSidebar = (props) => {
    const { organizer, gig, theEvent, me, systemMessage, loading } = props;

    const messageWrapper = useRef();

    const sender = me
        ? {
              id: me.id,
              name: me.userMetadata.firstName,
              image: me.picture.path,
          }
        : {};

    const receiver = organizer
        ? {
              id: organizer.id,
              name: organizer.userMetadata.firstName,
              image: organizer.picture && organizer.picture.path,
          }
        : {};

    const chat = useChat({
        sender,
        receiver,
        id: gig && gig.id,
        showPersonalInformation: gig && gig.showInfo,
        data: {
            eventId: theEvent && theEvent.id,
        },
    });

    const adjustPadding = useCallback(() => {
        const { bottom } = messageWrapper.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const dy = bottom - windowHeight;
        if (dy > 0) {
            messageWrapper.current.style.paddingBottom = dy + 'px';
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', adjustPadding);
        return () => {
            window.removeEventListener('scroll', adjustPadding);
        };
    }, [adjustPadding]);

    useLayoutEffect(adjustPadding);

    return (
        <Content>
            <InnerContent>
                <Header>
                    <SidebarContent>
                        <RowWrap between>
                            <Title>Messages</Title>
                            <PillsCol>
                                {theEvent && (
                                    <ContactPills
                                        email={theEvent.contactEmail}
                                        phone={theEvent.contactPhone}
                                        showInfo={gig.showInfo}
                                    />
                                )}
                            </PillsCol>
                        </RowWrap>
                    </SidebarContent>
                </Header>
                {gig && gig.isActionable && (
                    <MessageComposerContainer style={{ zIndex: 1 }}>
                        {chat && organizer && (
                            <MessageComposer
                                chat={chat}
                                placeholder={`Message ${receiver.name}...`}
                            />
                        )}
                        {!organizer && !loading && <Body>Organizer not found</Body>}
                    </MessageComposerContainer>
                )}
            </InnerContent>
            <InnerContent
                style={{
                    zIndex: 0,
                    justifyContent: 'flex-end',
                }}
            >
                <MessagesWrapper ref={messageWrapper}>
                    {gig && me && (
                        <Chat
                            hideComposer
                            showPersonalInformation={gig.showInfo}
                            eventId={theEvent.id}
                            sender={sender}
                            receiver={receiver}
                            chatId={gig.id}
                            chat={chat}
                            systemMessage={systemMessage}
                        />
                    )}
                </MessagesWrapper>
            </InnerContent>
        </Content>
    );
};

const PillsCol = styled(Col)`
    align-items: flex-end;
    margin-left: 24px;
    flex: 1;
    margin-bottom: -6px;
    > span {
        margin: 0;
        margin-bottom: 6px;
        margin-left: 6px;
    }
`;

const getSystemMessage = ({ gig, showDecline, navigateToOffer }) => {
    if (!gig) {
        return null;
    }
    const { expires, status, directBooking } = gig;
    const within = moment(expires).fromNow();

    if (directBooking && status === gigStates.REQUESTED) {
        return {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'The organizer is waiting on your offer. \nThis is a direct booking from your profile and the Cueup fee is discarded.',
            actions: [
                {
                    label: 'Decline gig',
                    action: showDecline,
                },
                {
                    label: 'Make offer',
                    action: navigateToOffer,
                },
            ],
        };
    }

    const messages = {
        [gigStates.REQUESTED]: {
            systemMessage: true,
            createdAt: new Date(),
            content: `The organizer is waiting on your offer. \nMake an offer within ${within} or the gig will automatically be declined.`,
            actions: [
                {
                    label: 'Decline gig',
                    action: showDecline,
                },
                {
                    label: 'Make offer',
                    action: navigateToOffer,
                },
            ],
        },
        [gigStates.ACCEPTED]: {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'Waiting on confirmation from the organizer. \nYou can still update the offer if necessary.',
            actions: [
                {
                    label: 'Update offer',
                    action: navigateToOffer,
                },
            ],
        },
        [gigStates.CONFIRMED]: {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'Whoop! The gig has been confirmed. \nMake sure that everything is agreed upon with the organizer, and get ready to play.',
        },
        [gigStates.EVENT_CANCELLED]: {
            systemMessage: true,
            createdAt: new Date(),
            content: 'The event has been cancelled.',
        },
        [gigStates.FINISHED]: {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'The gig is finished, we hope you had a good time. \nAsk the organizer to leave a review.',
        },
        [gigStates.LOST]: {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'Another DJ will play this gig. \nTo increase your chances of getting gigs, make sure that your profile is complete.',
        },
        [gigStates.DECLINED]: {
            systemMessage: true,
            createdAt: new Date(),
            content: 'You have declined this gig',
        },
        [gigStates.CANCELLED]: {
            systemMessage: true,
            createdAt: new Date(),
            content: 'You have cancelled this gig',
        },
    };

    return messages[status];
};

const Glass = styled.div`
    background: #fff;
    @supports (backdrop-filter: none) {
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: saturate(180%) blur(20px);
    }
`;

const Header = styled(Glass)`
    border-bottom: 1px solid rgb(233, 236, 240, 0.5);
    z-index: 2;
    position: sticky;
    top: 0;
`;

const MessageComposerContainer = styled(Glass)`
    padding: 15px 24px;
    position: sticky;
    bottom: 0;
    border-top: 1px solid rgb(233, 236, 240, 0.5);
`;

const Content = styled(Col)`
    max-height: 100vh;
    min-height: 100vh;
    width: 100%;
`;
const InnerContent = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const MessagesWrapper = styled.div`
    height: 100%;
    position: sticky;
    bottom: 0px;
    .chat {
        width: 100%;
        height: 100%;
        display: flex;
    }
    .messages {
        padding-top: 100px;
        display: flex;
        width: 100%;
        flex-direction: column;
        padding-bottom: 69px;
    }
`;

const Wrapper = memo((props) => {
    const { gig, navigateToOffer, showDecline } = props;

    let systemMessage = null;
    if (gig) {
        systemMessage = getSystemMessage({ gig, navigateToOffer, showDecline });
    }

    return (
        <Sidebar large stickyTop={'0px'}>
            <ChatSidebar {...props} systemMessage={systemMessage} />
        </Sidebar>
    );
});

export const ChatNaked = memo((props) => {
    const { gig, navigateToOffer, showDecline } = props;

    let systemMessage = null;
    if (gig) {
        systemMessage = getSystemMessage({ gig, navigateToOffer, showDecline });
    }

    return <ChatSidebar {...props} systemMessage={systemMessage} />;
});

export default Wrapper;
