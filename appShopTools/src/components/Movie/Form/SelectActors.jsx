import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';

SelectActors.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SelectActors({ field, data }) {
  return (
    <>
      <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
        <InputLabel id="actor">Actor</InputLabel>
        <Select
          {...field}
          labelId="actor"
          label="actor"
          defaultValue=""
          value={field.value}
        >
          {data &&
            data.map((actor) => (
              <MenuItem key={actor.id} value={actor.id}>
                {actor.fname} {actor.lname}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </>
  );
}
