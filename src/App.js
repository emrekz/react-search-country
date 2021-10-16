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
  Spinner,
  Card,
  Badge,
  Modal
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
  const [detailsBadge, setDetailsBadge] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [errorCode, setErrorCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const modalHandleClose = () => {setModalShow(false)}

  const modalHandleShow = () => {setModalShow(true)}

  useEffect(() => {
    setSearchStatus(true);
    axios.get('https://restcountries.com/v2/all')
      .then(response => {
        setJsonData(response.data);
        setSearchResults(response.data);
        setNumberSearchResult(response.data.length);
        setSearchStatus(false);
      })
      .catch(err => {
        setErrorCode(err.response.data.status);
        setErrorMessage(err.response.data.message);
        setSearchResults([]);
        setNumberSearchResult(0);
        setSearchStatus(false);
        modalHandleShow();
      })
  }, []);

  useEffect(() => {
    result = [];
    if(filterState !== 'all'){
      jsonData.forEach((i) => {
        if(i[filterState] !== undefined && i[filterState].indexOf('') !== -1){
          result.push(i);
        }
      })
    }
    setSearchResults(result);
    setNumberSearchResult(result.length);
  }, [filterState])

  let counter = 0;
  let result = [];
  let searchTimer;
  const searchFilter = (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      setSearchStatus(true);
      setSearchTerm(e.target.value);
      result = [];
      if(filterState === 'region'){
        jsonData.forEach((i, ind) => {
          if(i[filterState].indexOf(e.target.value) !== -1){
            result.push(i);
            setSearchStatus(false);
          }
        });
        if(result.length < 1) {
          setSearchStatus(false);
          modalHandleShow();
        }
      } 
      else if(filterState === 'name' || filterState === 'capital') {
        axios.get('https://restcountries.com/v2/'+filterState+'/'+e.target.value)
          .then(res => {
            result = res.data;
            if(result.status !== undefined && result.status === 404){
              setErrorCode(result.status);
              setErrorMessage(result.message);
              setSearchResults([]);
              setNumberSearchResult(0);
              setSearchStatus(false);
              modalHandleShow();
            } else {
              setSearchResults(result);
              setNumberSearchResult(result.length);
              setSearchStatus(false);
            }
            
          })
          .catch(err => {
            result = [];
            console.log(err.response)
            setErrorCode(err.response.data.status);
            setErrorMessage(err.response.data.message);
            setSearchResults(result);
            setNumberSearchResult(result.length);
            setSearchStatus(false);
            modalHandleShow();
          })
      }
      
      else {
        setDetailsBadge(true);
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
              if(result.length === 0){
                setErrorCode(404);
                setErrorMessage('Not Found');
                modalHandleShow();
              }
            }
            if(myArr.length > -1){
              x['details'] = myArr;
            }
          }, 1)
        })
      }
      setSearchResults(result);
      setNumberSearchResult(result.length);
    },300)
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
    setDetailsBadge(false);
    document.getElementById('formControl').value = '';
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
            <Col xs="5"><img src={logo} style={{height:'55%', width:'auto'}} alt='Country Search'/></Col>
            <Col xs="7"></Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col></Col>
            <Col xs="10">
              <Alert variant="primary">
                { searchStatus === false ? <>Count of found countries : <Badge variant="primary">{numberSearchResult}</Badge></> : <><Spinner animation="border" variant="primary"></Spinner><span style={{fontSize:'25px', textAlign:'center'}}> Searching...</span></> }
              </Alert>
              <Row className="justify-content-md-center">
                <Col xs="10">
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="searchInput" style={{fontWeight:'bold'}}>{searchName}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      id = "formControl"
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
                  {searchResults !== [] ? searchResults.map((i, ind) =>{
                    return(
                      <Fragment key={i.name}>
                        <tr key={i.numericCode} onClick = {(e) => detail(e)}>
                          <th title='Flag'>
                            <img src={i.flag} style={{width: '5vw', height: 'auto'}} alt={i.name} />
                          </th>
                          <th title='Name'>{i.name}</th>
                          <th title='Capital'>{i.capital}</th>
                          <th title='Region'>{i.region}</th>
                          <th><><Fragment><Button onClick={() => {}}>Details</Button></Fragment>
                            { i.details !== undefined && detailsBadge ? <Badge variant="warning" style={{marginLeft:'5px'}}>{i.details.length}</Badge> : ''}</>
                          </th>
                        </tr>
                        <tr className="collapse">
                          <td colSpan="12">
                              <Container>
                                {filterState === 'all' && i.details !== undefined ?
                                  <Row style={{marginBottom:'30px'}}>                                 
                                    <Col xs={12} style={{textAlign: 'left', color:'yellow', fontWeight:'normal'}}>
                                      <Card bg="dark" className="text-left" style={{fontSize:'15px'}}>
                                        <Card.Header as="h6">Search results related to <b>'{searchTerm}'</b> :</Card.Header>
                                        <Card.Body>
                                            <span style={{fontSize:'13px',marginBottom:'5px'}}>Total result : <Badge variant="warning">{i.details.length}</Badge></span>
                                            <>{Object.values(i.details).map((x,n) => <span key={x+n} style={{color:'cyan',display:'list-item',marginLeft: '2%', fontSize:'13px'}}>{x} </span> )}</>
                                        </Card.Body>
                                      </Card>
                                    </Col>
                                  </Row>
                                : '' }
                                <Row>
                                  <Col>
                                  <Card bg="dark" className="text-left" style={{fontSize:'13px'}}>
                                    <Card.Header as="h6">Details</Card.Header>
                                    <Card.Body>
                                        <Row>
                                        <Col xs={6} style={{textAlign:'left', display:'grid', fontSize: '12px'}}>
                                          <li><b>alpha2Code : </b>{i.alpha2Code}</li>
                                          <li><b>alpha3Code : </b>{i.alpha3Code}</li>
                                          <li><b>capital : </b>{i.capital}</li>
                                          <li><b>area : </b>{i.area} km²</li>
                                          <li><b>borders : </b>{ i.borders !== undefined ? i.borders.map(j => <Fragment key={j}> {j} , </Fragment>) : null } </li>
                                          <li><b>altSpellings : </b>{ i.altSpellings !== undefined ? i.altSpellings.map(j => <Fragment key={j}> {j} , </Fragment>) : null } </li> 
                                          <li><b>callingCodes : </b>{ i.callingCodes !== undefined ? i.callingCodes.map(j => <Fragment key={j}> {j} , </Fragment>) : null } </li>   
                                          <li><b>cioc : </b>{i.cioc} </li>   
                                          <li><b>demonym : </b>{i.demonym} </li>
                                          <li><b>languages : </b>{ i.languages !== undefined ? i.languages.map((j,n) => <Fragment key={n}> {j.name} , </Fragment>) : null } </li> 
                                          <li><b>numericCode : </b>{i.numericCode} </li>                                 
                                        </Col>
                                        <Col xs={6} style={{textAlign:'left', display:'grid', fontSize: '12px'}}>
                                          <li><b>subregion : </b>{i.subregion} </li>
                                          <li><b>timezones : </b>{ i.timezones !== undefined ? i.timezones.map(j => <Fragment key={j}> {j} , </Fragment>) : null} </li>
                                          <li><b>topLevelDomain : </b>{ i.topLevelDomain !== undefined ? i.topLevelDomain.map(j => <Fragment key={j}> {j} , </Fragment>) : null } </li> 
                                          <li><b>population : </b>{i.population} </li> 
                                          <li><b>nativeName : </b>{i.nativeName} </li>  
                                          <li><b>gini : </b>{i.gini} </li>
                                          <li><b>latlng : </b>{i.latlng} </li>
                                          <li><b>currencies : </b>{ i.currencies !== undefined ? i.currencies.map((j,n) => <Fragment key={n}> {j.code} , </Fragment>) : null } </li> 
                                          <li><b>latlng : </b>{ i.latlng !== undefined ? i.latlng.map((j,n) => <Fragment key={n}> {j} , </Fragment>) : null } </li>
                                          <li><b>regionalBlocs : </b>{ i.regionalBlocs !== undefined ? i.regionalBlocs.map((j,n) => <Fragment key={n}> {j.acronym} , </Fragment>) : null } </li> 
                                        </Col>
                                        </Row>
                                    </Card.Body>
                                  </Card>
                                  </Col>
                                </Row>
                              </Container>
                          </td>
                        </tr>
                      </Fragment>
                    )
                  }): null}
                </tbody>
              </Table>
            </Col>
            <Col></Col>
          </Row>
        </Container>

        <Modal show={modalShow} onHide={modalHandleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body><b>{errorCode} - {errorMessage}</b></Modal.Body>
          <Modal.Body><b>'{searchTerm}'</b> was not found.</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={modalHandleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </header>
    </div>
  );
}

export default App;
