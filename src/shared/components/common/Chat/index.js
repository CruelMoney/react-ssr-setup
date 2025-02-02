import React, { useRef, useEffect } from 'react';
import './index.css';
import moment from 'moment';
import SendIcon from 'react-ionicons/lib/MdSend';
import TextareaAutosize from 'react-autosize-textarea';
import LoadingPlaceholder from '../LoadingPlaceholder';
import { Avatar } from '../../Blocks';
import useChat from './useChat';

const Chat = ({
    sender,
    showPersonalInformation,
    receiver,
    placeholder,
    hideComposer,
    chat,
    systemMessage,
}) => {
    const messagesContainer = useRef();

    const { typing, messages, ready, onNewContent } = chat;

    const scrollToBottom = () => {
        if (messagesContainer.current) {
            console.log('Scrolling to bottom');
            setTimeout(() => (messagesContainer.current.scrollTop = 99999999), 100);
        }
    };

    useEffect(() => {
        onNewContent.current = scrollToBottom;
        return () => (onNewContent.current = null);
    }, [onNewContent]);

    const dateSorter = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
    const allMessages = systemMessage ? [...messages, systemMessage].sort(dateSorter) : messages;
    const datedMessages = toDateGroups(allMessages);

    return (
        <div className="chat">
            <div ref={messagesContainer} className="messages">
                <div style={{ flex: 1 }}> </div>

                {!ready ? (
                    <>
                        <LoadingPlaceholder />
                        <LoadingPlaceholder />
                    </>
                ) : messages.length > 0 ? null : (
                    placeholder
                )}
                {Object.entries(datedMessages).map(([time, messages]) => (
                    <DateGroup
                        key={time}
                        messages={messages}
                        time={time}
                        sender={sender}
                        receiver={receiver}
                        showPersonalInformation={showPersonalInformation}
                    />
                ))}

                {typing ? (
                    <div className="message received">
                        <Avatar className="avatar" alt={'receiver'} src={receiver.image} />
                        <div className="speech-bubble typing-indicator">
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                ) : null}
            </div>
            {!hideComposer && (
                <MessageComposer
                    autoFocus
                    chat={chat}
                    placeholder={'Send a message to ' + receiver.name + '...'}
                />
            )}
        </div>
    );
};

export const MessageComposer = ({ chat, placeholder, autoFocus }) => (
    <form onSubmit={chat.sendMessage} className="message-composer">
        <div className="input-wrapper">
            <TextareaAutosize
                rows={1}
                maxRows={5}
                placeholder={placeholder}
                className="message-input"
                value={chat.newMessage}
                onChange={(e) => {
                    chat.handleChange(e.target.value);
                }}
                onKeyPress={(event) => {
                    if (event.which === 13 && !event.shiftKey) {
                        event.preventDefault();
                        chat.sendMessage();
                    }
                }}
            />
        </div>
        <button
            onClick={(event) => {
                event.preventDefault();
                chat.sendMessage();
            }}
            disabled={chat.sending}
            type="submit"
        >
            <SendIcon fontSize="28px" color="#03d1ff" />
        </button>
    </form>
);

const enrichMessages = ({ sender, receiver, messages }) => {
    return messages.map((msg, idx) => ({
        ...msg,
        isOwn: msg.from === sender.id,
        isLast: idx + 1 === messages.length,
        isFirst: idx === 0,
        image: msg.from === sender.id ? sender.image : receiver.image,
    }));
};

const toDateGroups = (messages) => {
    let prevDate = new Date(0);
    let currentKey = null;

    return messages.reduce((dateGroups, msg) => {
        const msgDate = new Date(msg.createdAt);
        const insertDate = Math.floor((msgDate - prevDate) / 1000 / 60) > 60;

        prevDate = msgDate;

        if (insertDate) {
            currentKey = msgDate.getTime();
            return {
                ...dateGroups,
                [currentKey]: [msg],
            };
        }
        return {
            ...dateGroups,
            [currentKey]: [...dateGroups[currentKey], msg],
        };
    }, {});
};

const toSenderGroup = (messages) => {
    let currentSender = null;
    let currentGroupKey = 0;

    return messages.reduce((senderGroups, msg) => {
        const isNewGroup = currentSender !== msg.from;
        currentSender = msg.from;

        if (isNewGroup) {
            currentGroupKey += 1;
            return {
                ...senderGroups,
                [currentGroupKey]: [msg],
            };
        }
        return {
            ...senderGroups,
            [currentGroupKey]: [...senderGroups[currentGroupKey], msg],
        };
    }, {});
};

const DateGroup = ({ messages, time, sender, receiver, showPersonalInformation }) => {
    const date = moment.unix(time / 1000);
    const isToday = moment().diff(date, 'days') === 0;
    const formatted = isToday ? date.format('LT') : date.format('LL');

    const groupedMessages = toSenderGroup(messages);
    return (
        <div>
            <p className="messages-date">{formatted}</p>

            {Object.entries(groupedMessages).map(([senderId, messages], idx) => (
                <SenderGroup
                    key={time + '-' + idx}
                    messages={messages}
                    receiver={receiver}
                    sender={sender}
                    showPersonalInformation={showPersonalInformation}
                />
            ))}
        </div>
    );
};

const SenderGroup = ({ messages, sender, receiver, showPersonalInformation }) => {
    const enrichedMessages = enrichMessages({ sender, receiver, messages });

    return (
        <div className={'sender-group '}>
            {enrichedMessages.map((m, idx) => (
                <Message
                    key={m._id || 'new-message' + idx}
                    {...m}
                    showPersonalInformation={showPersonalInformation}
                />
            ))}
        </div>
    );
};

const Message = (props) => {
    const {
        content,
        isOwn,
        isFirst,
        isLast,
        actions,
        containsNumber,
        containsURL,
        containsEmail,
        showPersonalInformation,
        sending,
        image,
        systemMessage,
    } = props;
    const showNotice = containsEmail || containsNumber || containsURL;

    const cornerStyle = isOwn
        ? {
              borderTopLeftRadius: '20px',
              borderBottomLeftRadius: '20px',
              borderBottomRightRadius: isLast ? '20px' : '2px',
              borderTopRightRadius: isFirst ? '20px' : '2px',
          }
        : {
              borderTopRightRadius: '20px',
              borderBottomRightRadius: '20px',
              borderBottomLeftRadius: isLast ? '20px' : '2px',
              borderTopLeftRadius: isFirst ? '20px' : '2px',
          };

    return (
        <>
            <div className={`message-wrapper ${isOwn ? 'send' : 'received'}`}>
                <div className={`message ${isOwn ? 'send' : 'received'}`}>
                    {isLast && (
                        <Avatar
                            className="avatar"
                            alt={isOwn ? 'your picture' : 'receiver picture'}
                            src={systemMessage ? '/apple-touch-icon.png' : image}
                        />
                    )}
                    <div className={'speech-bubble'} style={cornerStyle}>
                        <div className="content">{content}</div>
                        {systemMessage && actions && (
                            <div className="message-actions">
                                {actions.map((a, idx) => (
                                    <button key={idx} onClick={a.action}>
                                        {a.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {!showPersonalInformation && showNotice && (
                <div className="message-info">Information visible after payment</div>
            )}
            {isLast && isOwn && <Status sending={sending} message={props} />}
            {systemMessage && (
                <div className="message-info service-message">
                    This is a service message from Cueup, and cannot be replied to.
                </div>
            )}
        </>
    );
};

const Status = ({ sending, message }) => {
    const status = sending ? 'Sending' : message.read ? 'Seen' : 'Delivered';

    return (
        <div className="message-info">
            <span>
                {!sending ? (
                    <svg
                        width="12px"
                        height="11px"
                        viewBox="0 0 12 11"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g
                                id="checkmark"
                                transform="translate(0.000000, -1.000000)"
                                fill="#cad2dc"
                            >
                                <path
                                    d="M10.767,1.243 L3.65,8.53 L1.72,6.267 C0.878,5.537 -0.45,6.389 0.154,7.482 L2.444,11.447 C2.807,11.933 3.651,12.419 4.494,11.447 C4.857,10.961 11.731,2.337 11.731,2.337 C12.577,1.364 11.491,0.515 10.769,1.243 L10.767,1.243 Z"
                                    id="Shape"
                                />
                            </g>
                        </g>
                    </svg>
                ) : null}
                {status}
            </span>
        </div>
    );
};

const WithChat = (props) => {
    const { sender, receiver, chatId, showPersonalInformation, eventId } = props;
    const chat = useChat({
        sender,
        receiver,
        id: chatId,
        showPersonalInformation,
        data: {
            eventId,
        },
    });

    return <Chat {...props} chat={chat} />;
};

const Wrapper = (props) => {
    const { chat } = props;

    if (!chat) {
        return <WithChat {...props} />;
    }

    return <Chat {...props} />;
};

export default Wrapper;
