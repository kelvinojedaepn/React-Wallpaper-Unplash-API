import {useRef, useState, useEffect, useCallback} from "react"
import "./App.css"
import "./index.css"
import "bootstrap/dist/css/bootstrap.min.css"
import {Button, Form} from "react-bootstrap"
import axios from "axios"

const API_URL = "https://api.unsplash.com/search/photos"
const IMAGE_PER_PAGE = 20

function App() {
  const searchInput = useRef(null)
  const [images, setImages] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [errorMsg, setErrorMsg] = useState("")

  const getImagesFromAPI = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setErrorMsg("")
        const consult = `${API_URL}?query=${
          searchInput.current.value
        }&page=${currentPage}&per_page=${IMAGE_PER_PAGE}&client_id=${
          import.meta.env.VITE_API_KEY
        }`
        const result = await axios.get(consult)
        setImages(result.data.results)
        setTotalPages(result.data.total_pages)
      }
    } catch (e) {
      setErrorMsg("Error during search process. Please try later.")
      console.log(e)
    }
  }, [currentPage])

  useEffect(() => {
    getImagesFromAPI()
  }, [getImagesFromAPI])

  const onHandleSubmit = (e) => {
    e.preventDefault()
    getImagesFromNewSearch()
  }

  const handleSectionFilter = (section) => {
    searchInput.current.value = section
    getImagesFromNewSearch()
  }
  const getImagesFromNewSearch = () => {
    setCurrentPage(1)
    getImagesFromAPI()
  }

  return (
    <>
      <div className="container">
        <h1 className="title">Image search</h1>
        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        <div className="search-section">
          <Form onSubmit={onHandleSubmit}>
            <Form.Control
              type="text"
              placeholder="Search for images"
              ref={searchInput}
              className="search-input"
            />
          </Form>
        </div>
        <div className="filters">
          <div
            onClick={() => {
              handleSectionFilter("Computer")
            }}
          >
            Computer
          </div>
          <div
            onClick={() => {
              handleSectionFilter("AI")
            }}
          >
            AI
          </div>
          <div
            onClick={() => {
              handleSectionFilter("Data Analysis")
            }}
          >
            Data Analysis
          </div>
          <div
            onClick={() => {
              handleSectionFilter("Computer Science")
            }}
          >
            Computer Science
          </div>
        </div>
        <div className="images">
          {images.map((image) => {
            return (
              <img
                src={image.urls.small}
                alt={image.alt_description}
                key={image.id}
                className="image"
              />
            )
          })}
        </div>
        <div className="buttons">
          {currentPage > 1 && (
            <Button
              onClick={() => {
                setCurrentPage(currentPage - 1)
              }}
            >
              Previous
            </Button>
          )}
          {currentPage < totalPages && (
            <Button
              onClick={() => {
                setCurrentPage(currentPage + 1)
              }}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

export default App
