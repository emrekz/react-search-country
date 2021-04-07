import React, { Fragment } from "react";
import './App.css';
import axios from 'axios';
import {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Button, 
  Table,
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Dropdown,
  Alert
} from 'react-bootstrap';


function App() {
  const [jsonData, setJsonData] = useState([]);
  const [searchName, setSearchName] = useState('Search');
  const [filterName, setFilterName] = useState('Filter');
  const [filterState, setFilterState] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [numberSearchResults, setNumberSearchResult] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setJsonData(response.data);
        setSearchResults(response.data);
        console.log(response.data)
      });
  }, []);

  useEffect(() => {
    result = [];
    if(filterState !== 'all'){
      jsonData.forEach((i) => {
        if(i[filterState].indexOf('') !== -1){
          result.push(i)
        }
      })
    }
    setSearchResults(result);
    setNumberSearchResult(result.length);
    //console.log(result);
  }, [filterState])
  
  let counter = 0;
  let result = [];
  
  const searchFilter = (e) => {
    setSearchTerm(e.target.value);
    result = [];
    if(filterState !== 'all'){
      jsonData.forEach((i) => {
        if(i[filterState].indexOf(e.target.value) !== -1){
          result.push(i);
        }
      });
    } else {
      jsonData.forEach((x,tm,arr) => {
          x['details'] = [];
          myArr = [];
          Object.keys(x).forEach((f1) => {
            ((typeof x[f1] === 'string' || typeof x[f1] === 'number' || x[f1] === null  || x[f1] === undefined)) ?
              resultPush(String(x[f1]),String(e.target.value),x,String(f1)) :
              Object.keys(x[f1]).forEach((f2) => {
                ((typeof x[f1][f2] === 'string' || typeof x[f1][f2] === 'number' || x[f1][f2] === null  || x[f1][f2] === undefined)) ?
                  resultPush(String(x[f1][f2]),String(e.target.value),x,String(f1)) :
                  Object.keys(x[f1][f2]).forEach((f3) => {
                    ((typeof x[f1][f2][f3] === 'string' || typeof x[f1][f2][f3] === 'number' || x[f1][f2][f3] === null  || x[f1][f2][f3] === undefined)) ?
                      //console.log('key: '+f1+'>'+f2+'>'+f3+' , value: '+ x[f1][f2][f3]) :
                      resultPush(String(x[f1][f2][f3]),String(e.target.value),x,String(f1)) :
                      Object.keys(x[f1][f2][f3]).forEach((f4) => {
                        ((typeof x[f1][f2][f3][f4] === 'string' || typeof x[f1][f2][f3][f4] === 'number' || x[f1][f2][f3][f4] === null  || x[f1][f2][f3][f4] === undefined)) ?
                        resultPush(String(x[f1][f2][f3][f4]),String(e.target.value),x,String(f1)) : console.log('I am lost')
                    })
                  })
              })
          })
          counter++;
          if(counter === arr.length){
            console.log('done');
            setSearchResults(result);
            setNumberSearchResult(result.length);
            //console.log(result)
          }
          if(myArr.length > -1){
            //console.log(myArr);
            x['details'] = myArr;
          }
        })
    }
    counter = 0;  
    setSearchResults(result);
    setNumberSearchResult(result.length);
    
  };
  
  let myArr = [];
  const resultPush = (m,e,x,ff) => {
    if(m.indexOf(e) !== -1){
      myArr.push(String(ff));
      if(result.length < 1){
        result.push(x);
      }else {
        for(let c=0;c<result.length;c++){
          if(result[c].name === x.name){
            break;
          }
          if(c === result.length-1){
            //x['details'].push(myArr);
            result.push(x);
            //console.log(result)
          }
        }
      }
      
    }
  }

  const handleSelectFilter = (e) => {
    counter = 0;
    console.log('timer cleared');
    setFilterName(e.target.innerText);
    setSearchName(e.target.innerText);
    setFilterState(e.target.innerText.toLowerCase());
  };

  const detail = (e) => {
    const hiddenElement = e.currentTarget.nextSibling;
    hiddenElement.className.indexOf("collapse show") > -1 ? hiddenElement.classList.remove("show") : hiddenElement.classList.add("show");
  }
  return (
    <div className="App">
      <header className="App-header">
        <Container style={{minHeight:'1000px', marginTop:'20px'}}>
          <Row className="justify-content-md-center">
            <Col></Col>
            <Col xs="10">
              <Alert variant="info" >
                Number of Results : {numberSearchResults}
              </Alert>
              <Row className="justify-content-md-center">
                <Col xs="10">
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="searchInput" style={{fontWeight:'bold'}}>{searchName}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      aria-label="Default"
                      aria-describedby="inputGroup-sizing-default"
                      onChange ={(e) => searchFilter(e)}
                    />
                  </InputGroup>
                </Col>
                <Col xs="2">
                  <Dropdown style={{float:'right', marginBottom: '20px', width: '100%'}}>
                    <Dropdown.Toggle style={{width: '100%'}} variant="success" id="filterButton">
                      {filterName}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Header>Filters : </Dropdown.Header>
                      <Dropdown.Item onClick={(e) => handleSelectFilter(e)}>All</Dropdown.Item>
                      <Dropdown.Item onClick={(e) => handleSelectFilter(e)}>Capital</Dropdown.Item>
                      <Dropdown.Item onClick={(e) => handleSelectFilter(e)}>Name</Dropdown.Item>
                      <Dropdown.Item onClick={(e) => handleSelectFilter(e)}>Region</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>

              <Table striped bordered hover variant="dark" responsive>
                <thead>
                  <tr>
                    <th>Flag</th>
                    <th>Name</th>
                    <th>Capital</th>
                    <th>Region</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map(i=>{
                    return(
                      <Fragment key={i.name}>
                        <tr key={i.numericCode} onClick={(e) => detail(e)}>
                          <th title='Flag'>
                            <img src={i.flag} style={{width: '3vw', height: 'auto'}} alt={i.name} />
                          </th>
                          <th title='Name'>{i.name}</th>
                          <th title='Capital'>{i.capital}</th>
                          <th title='Region'>{i.region}</th>
                          <th><Button onClick={() => {}}>Details</Button> </th>
                        </tr>
                        <tr className="collapse">
                          <td colSpan="12">
                              {/* { testArray.map(j => {
                                return(
                                  // i[j].length > 10 ? <p>{i[j]}</p> : <p></p>
                                  <p>{j}</p>
                                )
                              })} */}
                              <Container>
                                <Row style={{marginBottom:'50px'}}>
                                  <Col style={{textAlign: 'left', color:'yellow', fontWeight:'normal'}}>
                                    *keys which include to search term of '{searchTerm}'  : { i.details !== undefined ? <>{Object.values(i.details).map((x,n) => <span key={x+n} style={{color:'cyan'}}>{x}, </span> )}</> : ''} 
                                  </Col>
                                </Row>
                                <Row>
                                  <Col xs={6} style={{textAlign:'left'}}>
                                    <p>alpha2Code : {i.alpha2Code}</p>
                                    <p>alpha3Code : {i.alpha3Code}</p>
                                    <p>capital : {i.capital}</p>
                                    <p>area : {i.area}</p>
                                    <p>borders : { i.borders.map(j => <Fragment key={j}> {j}, </Fragment>)} </p>
                                    <p>altSpellings : { i.altSpellings.map(j => <Fragment key={j}> {j}, </Fragment>)} </p> 
                                    <p>callingCodes : { i.callingCodes.map(j => <Fragment key={j}> {j}, </Fragment>)} </p>   
                                    <p>cioc : {i.cioc} </p>   
                                    <p>demonym : {i.demonym} </p>
                                  </Col>
                                  <Col xs={6} style={{textAlign:'left'}}>
                                    <p>subregion : {i.subregion} </p>
                                    <p>timezones : { i.timezones.map(j => <Fragment key={j}> {j}, </Fragment>)} </p>
                                    <p>topLevelDomain : { i.topLevelDomain.map(j => <Fragment key={j}> {j}, </Fragment>)} </p> 
                                    <p>population : {i.population} </p> 
                                    <p>nativeName : {i.nativeName} </p>  
                                    <p>gini : {i.gini} </p>
                                    <p>latlng : {i.latlng} </p>
                                    <p>currencies : { i.currencies.map((j,n) => <Fragment key={n}> {j.code}, </Fragment>)} </p> 



                                  </Col>
                                </Row>
                              </Container>
                              
                          </td>
                        </tr>
                      </Fragment>
                    )
                  })}
                </tbody>
              </Table>
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </header>
    </div>
  );
}

export default App;
