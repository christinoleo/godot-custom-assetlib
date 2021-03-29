import React, {useEffect, useState} from "react";
import {TextInput} from "react-admin";


export const EmptyTextInput = ({...props}) => {
    return (
        <TextInput
            parse={(v) => {
                return (!v ? '' : v);
            }}
            {...props}
        />
    );
};