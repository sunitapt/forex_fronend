import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Card } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import GridItem from 'components/Grid/GridItem';
import GridContainer from   'components/Grid/GridContainer'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function CurrencyMenu({showFilter,from,setFrom,to,setTo,filter,setFilter,quantity,setQuantity}) {
  const classes = useStyles();
  

  

  return (
    <Card style={{display:"flex",justifyContent:"space-evenly", marginBottom:"10px"}} elevation="10">
      <GridContainer>
        <GridItem xs={6} md={4}>
      <FormControl className={classes.formControl}>
        <InputLabel shrink id="from">
          From
        </InputLabel>
        <Select
          labelId="from"
          id="from"
          name="from"
          value={from}
          onChange={(e)=>{
            setFrom(e.target.value)
          }}
          
        >
          <MenuItem value={"USD"}>USD</MenuItem>
          <MenuItem value={"EUR"}>EUR</MenuItem>
          <MenuItem value={"INR"}>INR</MenuItem>
        </Select>
        <FormHelperText>You have this currency</FormHelperText>
      </FormControl>
      </GridItem>

      <GridItem xs={6} md={4}>
      <FormControl className={classes.formControl}>
        <InputLabel shrink id="from">
          To
        </InputLabel>
        <Select
          labelId="from"
          id="from"
          name="from"
          value={to}
          onChange={(e)=>{
            setTo(e.target.value)
          }}
          
        >
          <MenuItem value={"USD"}>USD</MenuItem>
          <MenuItem value={"EUR"}>EUR</MenuItem>
          <MenuItem value={"INR"}>INR</MenuItem>
        </Select>
        <FormHelperText>You want this currency</FormHelperText>
      </FormControl>
      </GridItem>
      {showFilter?
      <GridItem xs={6} md={4}>
      <FormControl className={classes.formControl}>
        <InputLabel shrink id="filter">
          Filter By
        </InputLabel>
        <Select
          labelId="filter"
          id="filter"
          name="filter"
          value={filter}
          onChange={(e)=>{
            setFilter(e.target.value)
          }}
        >
          <MenuItem value={"Rating"}>Rating</MenuItem>
          <MenuItem value={"Lowest"}>Lowest</MenuItem>
          <MenuItem value={"Highest"}>Highest</MenuItem>
        </Select>
        <FormHelperText>Filter By</FormHelperText>
      </FormControl></GridItem>:<span/>}


      <GridItem xs={6} md={4}>
      <FormControl className={classes.formControl}>
        <InputLabel shrink id="from">
          Quantity
        </InputLabel>
      <Input value={quantity} type="number" min={1} inputProps={{ 'aria-label': 'description',min: 1 }}  onChange={(e)=>{
        setQuantity(e.target.value)
      }}/>
      <FormHelperText>Number of rates  you want to see</FormHelperText>
      </FormControl>
      </GridItem>
      </GridContainer>
    </Card>
  );
}
