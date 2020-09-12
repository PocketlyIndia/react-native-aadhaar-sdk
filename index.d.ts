import React from 'react';

export interface AadharVerificationViewProps {
    clientId: string;
    onSuccess: (payload: JSON) => any;
    askShareCodeFromUser?: boolean;
};

declare const AadharVerificationView: React.SFC<AadharVerificationViewProps>;

export default AadharVerificationView;
