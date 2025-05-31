import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

SelectGenres.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SelectGenres({ field, data }) {
  return (
    <>
      <>
        <InputLabel id="genre">Genero</InputLabel>
        <Select
          {...field}
          labelId="genre"
          label="genre"
          multiple
          defaultValue={[]}
          value={field.value}
        >
          {data &&
            data.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.title}
              </MenuItem>
            ))}
        </Select>
      </>
    </>
  );
}
