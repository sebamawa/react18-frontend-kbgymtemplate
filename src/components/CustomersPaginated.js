import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import './CustomersPaginated.css';

import { Link } from "react-router-dom";

function DisplayItems({ currentItems }) {
  return (
    <>
        {/* <h3>Customers List</h3>  */}
        <table className='table table-dark table-striped'>
            <thead>
                <tr>
                    <th scope='col'>Fullname</th>
                    <th scope='col'>Image</th>
                    <th scope='col'>Phone</th>
                    <th scope='col'>Details</th>
                </tr>
            </thead>
            <tbody>
                {currentItems && currentItems.map((d)=> 
                    <tr key={d.cust_id}>
                        <td>{d.cust_fullname}</td>
                        <td><img src={d.cust_image} alt={"img"} width="60px" height="60px"/></td>
                        <td>{d.cust_phone}</td>
                        <td>
                          <Link 
                              to={`/customer-details/${d.cust_id}`} 
                              state={{customer: d}}
                          > 
                                <i className="bi bi-list-task"></i>
                          </Link>
                        
                        </td>
                    </tr>
                  
                )}
            </tbody>
        </table>
    </>
  );
}

function CustomersPaginated({ itemsPerPage }) {

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  // to select active/inactive customers
  const [activeCustomersBool, setActiveCustomersBool] = useState(true); 

  // to filter customers by name
  const [customerNameFilter, setCustomerNameFilter] = useState(""); 

  // to inform if a error occurs
  const [errorMsg, setErrorMsg] = useState("");

  const [currentCustomers, setCurrentCustomers] = useState([]); // from API
  const [totalPages, setTotalPages] = useState(0); // from API

  useEffect(() => {
    // fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/CustomersAPI/List?cust_active=${activeCustomersBool}&page_number=${currentPage}&page_size=${itemsPerPage}`)
    //   .then(response => response.json())
    //   .then(json => {
    //       setCurrentCustomers(json.SDTCustomers); 
    //       setTotalPages(json.TotalPages);
    //       setLoading(false);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     setErrorMsg(`Un error ha ocurrido, recargue la página.\nDescripción:\n${error.message}`);
    //   });

    // try {
      //const fetchCustomers = async () => {
     (async() => {   
      try {
        setLoading(true);

        let response = null;
        if (customerNameFilter !== "") { // filter to search by name not empty
          response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/CustomersAPI/GetByName?cust_fullname=${customerNameFilter}&cust_active=${activeCustomersBool}&page_number=${currentPage}&page_size=${itemsPerPage}`);
        } else {
          response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/CustomersAPI/List?cust_active=${activeCustomersBool}&page_number=${currentPage}&page_size=${itemsPerPage}`);
        }
        const json = await response.json();
        // console.log(json.SDTCustomers);
        setCurrentCustomers(json.SDTCustomers); 
        setTotalPages(json.TotalPages);
        setLoading(false);
        setErrorMsg("");
      } catch (error) {
        console.log(error);
        setErrorMsg(`Un error ha ocurrido, pruebe recargar la página. 
                     Descripción: ${error.message}`);
      }  
      })(); 
      //}
    // try {
    //   //fetchCustomers();
    // } catch (error) {
    //       setErrorMsg(`Un error ha ocurrido, recargue la página.\nDescripción:\n${error.message}`);
    //       console.log(error);
    // }    
        

    // NO ENTRA EN EL CATCH DE ESTA FORMA
    // try {
    //   const fetchCustomers = async () => {
    //     setLoading(true);

    //     let response = null;
    //     if (customerNameFilter !== "") { // filter to search by name not empty
    //       response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/CustomersAPI/GetByName?cust_fullname=${customerNameFilter}&cust_active=${activeCustomersBool}&page_number=${currentPage}&page_size=${itemsPerPage}`);
    //     } else {
    //       response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/CustomersAPI/List?cust_active=${activeCustomersBool}&page_number=${currentPage}&page_size=${itemsPerPage}`);
    //     }
    //     const json = await response.json();
    //     // console.log(json);
    //     setCurrentCustomers(json.SDTCustomers); 
    //     setTotalPages(json.TotalPages);
    //     setLoading(false);
    //   }
    //   fetchCustomers();
    // } catch (error) {
    //       setErrorMsg(`Un error ha ocurrido, recargue la página.\nDescripción:\n${error.message}`);
    //       // console.log(error);
    // }
  }, [currentPage, activeCustomersBool, customerNameFilter, errorMsg]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  return (
    <>
        <div className="row">
          <div className="col-4">
            {errorMsg !=="" ? 
              <div className="alert alert-danger mt-3" role="alert">
                {errorMsg}
              </div> 
              : <p>Messages</p>
            } 
          </div>
          <div className="col-6">
            <input 
              type="text" 
              className="form-control mt-3"
              placeholder="Buscar por nombre"
              value={customerNameFilter}
              onChange={event => {
                // mejorar el filtro para que no se ejecute cada vez que se escribe una letra
                  setCustomerNameFilter(event.target.value);
                  setCurrentPage(1);
              }}
            />
          </div>
          <div className="col-2">
              <select className="form-select mt-3 mb-3" value={activeCustomersBool} onChange={event => {
                setActiveCustomersBool(event.target.value);
                setCurrentPage(1); // to avoid pagination errors
                }}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
            </select>
          </div>          
        </div> 
        <div className="row">   
          { loading ? <h1>{'Loading Customers'}</h1> :
              <>
                  <DisplayItems 
                    currentItems={currentCustomers}  
                  /> 
              </>
          }
        </div>

        {/* Pagination */}
        <div className="row">
            <ReactPaginate
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                // pageCount={pageCount}
                pageCount={totalPages}
                previousLabel="< previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
            />  
      </div>    
    </>
  );
}

export default CustomersPaginated;