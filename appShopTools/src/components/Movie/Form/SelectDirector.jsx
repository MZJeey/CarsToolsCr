import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

SelectDirector.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SelectDirector({ field, data }) {
  return (
    <>
      <>
        <InputLabel id="director">Director</InputLabel>
        <Select
          {...field}
          labelId="director"
          label="director"
          defaultValue=""
          value={field.value}
        >
          {data &&
            data.map((director) => (
              <MenuItem key={director.id} value={director.id}>
                {director.fname} {director.lname}
              </MenuItem>
            ))}
        </Select>
      </>
    </>
  );
}
