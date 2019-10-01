import React from 'react';

import styled from 'styled-components';
import { LoadingPlaceholder2 } from '../../../../components/common/LoadingPlaceholder';
import { ChatNaked } from '../../components/ChatSidebar';

const MakeFullWidth = styled.div`
    margin-left: -15px;
    margin-right: -15px;
    margin-top: -60px;
    position: relative;
`;

const MobileChat = ({ loading, ...props }) =>
    loading ? (
        <LoadingPlaceholder2 />
    ) : (
        <MakeFullWidth>
            <ChatNaked {...props} />
        </MakeFullWidth>
    );

export default MobileChat;
