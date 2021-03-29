import React from 'react';
import { SimpleShowLayout } from 'react-admin';
import { TextField } from 'react-admin';
import { BooleanField } from 'react-admin';
import { Show } from 'react-admin';

export const UserShow = (props) => (
  <Show title="User Show" {...props}>
    <SimpleShowLayout>
      <TextField  disabled source="id" />
      <TextField  source="email" />
      <TextField  source="first_name" />
      <TextField  source="last_name" />
      <BooleanField source="is_active" />
      <BooleanField source="is_superuser" />
    </SimpleShowLayout>
  </Show>
);
