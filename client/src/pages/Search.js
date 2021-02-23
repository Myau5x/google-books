import React, { useState, useEffect } from "react";
import DeleteBtn from "../components/DeleteBtn";
import AddBtn from "../components/AddBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";
import { set } from "mongoose";

function Search() {
  // Setting our component's initial state
  const [books, setBooks] = useState([])
  const [formObject, setFormObject] = useState({})

  

  function addBook(title, authors, description, image, link){
    API.saveBook({
      title:title,
      authors: authors,
      description: description,
      image: image,
      link: link
    })
  }
  // Handles updating component state when the user types into the input field
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormObject({...formObject, [name]: value})
  };

  // When the form is submitted, use the API.saveBook method to save the book data
  // Then reload books from the database
  function handleFormSubmit(event) {
    event.preventDefault();
    let title = formObject.title;
    API.googleBook(title)
    .then(res => {setBooks(res.data.items)})
    .catch(err => console.log(err))
    
  };

    return (
      <Container fluid>
        <Row>
          <Col size="md-8 sm12">
          <Jumbotron>
              <h1>What Books Should I Read?</h1>
            </Jumbotron>
            <form>
              <Input
                onChange={handleInputChange}
                name="title"
                placeholder="Title (required)"
              />
              
              <FormBtn
                disabled={!(formObject.title)}
                onClick={handleFormSubmit}
              >
                Search Book
              </FormBtn>
            </form>
          </Col>
        </Row>
        <Row>
          
          <Col size="md-8 sm-12">
            <Jumbotron>
              <h1>Books found</h1>
            </Jumbotron>
            {books.length ? (
              <List>
                {books.map(book => {
                  let title = (book.volumeInfo.title === undefined) ? "" : book.volumeInfo.title;
                  let authors = (book.volumeInfo.authors === undefined) ? [""] :book.volumeInfo.authors ;
                  let description = (book.volumeInfo.description === undefined) ? "": book.volumeInfo.description;
                  let image = (book.volumeInfo.imageLinks === undefined)? "https://placehold.it/128x128": book.volumeInfo.imageLinks.thumbnail;
                  let link = (book.volumeInfo.previewLink ===undefined) ? "": book.volumeInfo.previewLink;

                  return (
                  <ListItem key={book.id}>
                    <Row>
                    <img src={image} alt={title}/>
                    <Col size="md-10">
                      <h2>{title}</h2>
                      <h3>By {authors}</h3>
                      <p>{description}</p>
                    </Col>
                    <a href={link} target="_blank">
                      <strong>
                        {title} by {authors}
                      </strong>
                    </a>
                    <AddBtn onClick={() => addBook(title, authors,description,image,link)} />
                    </Row>
                  </ListItem>
                )}
                )}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }


export default Search;
