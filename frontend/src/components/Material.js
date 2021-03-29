import { TextField as MTextInput } from '@material-ui/core'
import DialogContent from '@material-ui/core/DialogContent'
import React from 'react'

export const MyTextInput = ({title, variant='filled', fullWidth=true,
    ...props}) => (
    <MTextInput label={title}
                variant={variant}
                fullWidth={fullWidth}
                style={{marginBottom:'0.5em'}}
                {...props}/>
)
