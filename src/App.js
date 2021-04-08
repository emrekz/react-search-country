import React, { Fragment } from "react";
import './App.css';
import axios from 'axios';
import logo from './logo.png'
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
  Alert,
  Spinner
} from 'react-bootstrap';


function App() {
  const [jsonData, setJsonData] = useState([]);
  const [searchName, setSearchName] = useState('Search');
  const [filterName, setFilterName] = useState('Filter');
  const [filterState, setFilterState] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [numberSearchResult, setNumberSearchResult] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchStatus, setSearchStatus] = useState(false);

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setJsonData(response.data);
        setSearchResults(response.data);
        setNumberSearchResult(response.data.length);
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
  }, [filterState])


  let counter = 0;
  let result = [];
  
  const searchFilter = (e) => {
    setSearchStatus(true);
    setSearchTerm(e.target.value);
    result = [];
    if(filterState !== 'all'){
      jsonData.forEach((i) => {
        if(i[filterState].indexOf(e.target.value) !== -1){
          result.push(i);
          setSearchStatus(false);
        }else{setSearchStatus(false);}
      });
    } else {
      jsonData.forEach((x,tm,arr) => {
        setTimeout(() => {
          x['details'] = [];
          myArr = [];
          Object.keys(x).forEach((f1) => {
            ((typeof x[f1] === 'string' || typeof x[f1] === 'number' || x[f1] === null  || x[f1] === undefined)) ?
              resultPush(String(x[f1]),String(e.target.value),x,String(f1),tm) :
              Object.keys(x[f1]).forEach((f2) => {
                ((typeof x[f1][f2] === 'string' || typeof x[f1][f2] === 'number' || x[f1][f2] === null  || x[f1][f2] === undefined)) ?
                  resultPush(String(x[f1][f2]),String(e.target.value),x,String(f1),tm) :
                  Object.keys(x[f1][f2]).forEach((f3) => {
                    ((typeof x[f1][f2][f3] === 'string' || typeof x[f1][f2][f3] === 'number' || x[f1][f2][f3] === null  || x[f1][f2][f3] === undefined)) ?
                      //console.log('key: '+f1+'>'+f2+'>'+f3+' , value: '+ x[f1][f2][f3]) :
                      resultPush(String(x[f1][f2][f3]),String(e.target.value),x,String(f1),tm) :
                      Object.keys(x[f1][f2][f3]).forEach((f4) => {
                        ((typeof x[f1][f2][f3][f4] === 'string' || typeof x[f1][f2][f3][f4] === 'number' || x[f1][f2][f3][f4] === null  || x[f1][f2][f3][f4] === undefined)) ?
                        resultPush(String(x[f1][f2][f3][f4]),String(e.target.value),x,String(f1),tm) : console.log('I am lost')
                    })
                  })
              })
          })
          counter++;
          if(counter === arr.length){
            setSearchResults(result);
            setNumberSearchResult(result.length);
            counter = 0; 
            setSearchStatus(false);
          }
          if(myArr.length > -1){
            x['details'] = myArr;
          }
        
        }, 1)
      })
    }
    setSearchResults(result);
    setNumberSearchResult(result.length);
  };
  
  let myArr = [];
  let myObj;
  const resultPush = (m,e,x,ff,tm) => {
    if(m.indexOf(e) !== -1){
      myObj = x.name + ' > ' + ff + ' > ' + m;
      myArr.push(myObj);
      if(result.length < 1){
        result.push(x);
      }else {
        for(let c=0;c<result.length;c++){
          if(result[c].name === x.name){
            break;
          }
          if(c === result.length-1){
            result.push(x);
          }
        }
      }
      
    }
  }

  const handleSelectFilter = (e) => {
    counter = 0;
    if(e.target.innerText !== filterName){
      setFilterName(e.target.innerText);
      setSearchName(e.target.innerText);
      setFilterState(e.target.innerText.toLowerCase());
    }
  };

  const detail = (e) => {
    const hiddenElement = e.currentTarget.nextSibling;
    hiddenElement.className.indexOf("collapse show") > -1 ? hiddenElement.classList.remove("show") : hiddenElement.classList.add("show");
  }
  return (
    <div className="App">
      <header className="App-header">
        <Container style={{minHeight:'1000px', marginTop:'10px'}}>
          <Row style={{marginBottom: '-5%'}}>
            <Col xs="5"><img src={logo} style={{height:'55%', width:'auto'}}/></Col>
            <Col xs="7"></Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col></Col>
            <Col xs="10">
              <Alert variant="info" >
                { searchStatus === false ? <>Number of Results : {numberSearchResult}</> : <span style={{fontSize:'25px'}}><Spinner animation="border" variant="primary"></Spinner> Searching...</span> }
              </Alert>
              <Row className="justify-content-md-center">
                <Col xs="10">
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="searchInput" style={{fontWeight:'bold'}}>{searchName}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="Search..."
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
                  {searchResults.map((i) =>{
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
                              <Container>
                              {filterState === 'all' && i.details !== undefined ?
                                <Row style={{marginBottom:'30px'}}>
                                  <Col style={{textAlign: 'left', color:'yellow', fontWeight:'normal'}}>                                    
                                      <>Search results related to '{searchTerm}' : {Object.values(i.details).map((x,n) => <span key={x+n} style={{color:'cyan',display:'list-item',marginLeft: '2%', fontSize:'15px'}}>{x} </span> )}</>
                                  </Col>
                                </Row>
                              : '' }
                                <Row style={{fontSize:'13px'}}>
                                  <Col xs={6} style={{textAlign:'left', display:'grid'}}>
                                    <li>alpha2Code : {i.alpha2Code}</li>
                                    <li>alpha3Code : {i.alpha3Code}</li>
                                    <li>capital : {i.capital}</li>
                                    <li>area : {i.area}</li>
                                    <li>borders : { i.borders.map(j => <Fragment key={j}> {j}, </Fragment>)} </li>
                                    <li>altSpellings : { i.altSpellings.map(j => <Fragment key={j}> {j}, </Fragment>)} </li> 
                                    <li>callingCodes : { i.callingCodes.map(j => <Fragment key={j}> {j}, </Fragment>)} </li>   
                                    <li>cioc : {i.cioc} </li>   
                                    <li>demonym : {i.demonym} </li>
                                    <li>languages : { i.languages.map((j,n) => <Fragment key={n}> {j.name}, </Fragment>)} </li> 
                                  </Col>
                                  <Col xs={6} style={{textAlign:'left', display:'grid'}}>
                                    <li>subregion : {i.subregion} </li>
                                    <li>timezones : { i.timezones.map(j => <Fragment key={j}> {j}, </Fragment>)} </li>
                                    <li>topLevelDomain : { i.topLevelDomain.map(j => <Fragment key={j}> {j}, </Fragment>)} </li> 
                                    <li>population : {i.population} </li> 
                                    <li>nativeName : {i.nativeName} </li>  
                                    <li>gini : {i.gini} </li>
                                    <li>latlng : {i.latlng} </li>
                                    <li>currencies : { i.currencies.map((j,n) => <Fragment key={n}> {j.code}, </Fragment>)} </li> 
                                    <li>latlng : { i.latlng.map((j,n) => <Fragment key={n}> {j}, </Fragment>)} </li> 
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
