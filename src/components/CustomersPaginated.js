import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import './CustomersPaginated.css';

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function DisplayItems({ currentItems, thereAreCustomersWithDebt }) {

  const navigate = useNavigate();

  // to get the date 'days' days before the due date of the monthly payment
  const substractDaysFromDate = (dateString, days) => {
    const result = new Date(dateString);
    result.setDate(result.getDate() - days);
    const ret = result.toISOString().substring(0, 10);
    return ret; 
  } 
  
  return (
    <>
        {/* <h3>Customers List</h3>  */}
        <table className={'table table-dark table-striped table-hover'}>
            <thead>
                <tr>
                    <th scope='col'>Fullname</th>
                    <th scope='col'>Image</th>
                    <th scope='col'>Phone</th>
                    <th scope='col'>Payday limit</th>
                    <th scope='col'>Details</th>
                </tr>
            </thead>
            <tbody>
                {currentItems && currentItems.map((d)=> 

                    <tr key={d.cust_id} className={d.cust_has_debt ? "table-danger" : (d.cust_monthly_serv_pending || (d.cust_pay_out_of_period && substractDaysFromDate(d.cust_payday_limit, 3) < (new Date()).toISOString().substring(0, 10)) ? "table-warning" : "")}
                        role="button" onClick={() => navigate(`/customer-details/${d.cust_id}`, {state: {customer: d}})}
                    >
                       
                        <td>{d.cust_fullname}</td>
                        <td><img src={d.cust_image} alt={d.cust_fullname} width="60px" height="60px"/><i className={d.cust_has_debt ? "bi bi-exclamation-triangle text-danger" : ""}></i></td>
                        <td>{d.cust_phone}</td>
                        <td>{d.cust_pay_out_of_period ? d.cust_payday_limit : "before 10"}</td>
                        <td>
                          <Link 
                              // to={`/customer-details/${d.cust_id}`} 
                              // state={{customer: d}}
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

function CustomersPaginated({ itemsPerPage, thereAreCustomersWithDebt }) {

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

     (async() => {   
      try {
        setLoading(true);

        let response = null;
        if (customerNameFilter !== "") { // filter to search by name not empty
          response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/CustomersAPI/GetByName?cust_fullname=${customerNameFilter}&cust_active=${activeCustomersBool}&cust_has_debt=${thereAreCustomersWithDebt}&page_number=${currentPage}&page_size=${itemsPerPage}`);
        } else {
          response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/CustomersAPI/List?cust_active=${activeCustomersBool}&cust_has_debt=${thereAreCustomersWithDebt}&page_number=${currentPage}&page_size=${itemsPerPage}`);
        }
        const json = await response.json();
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
  }, [currentPage, activeCustomersBool, customerNameFilter, thereAreCustomersWithDebt, errorMsg]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  return (
    <>
        <div className="row">
          <div className="col-3">
            {errorMsg !=="" ? 
              <div className="alert alert-danger mt-3" role="alert">
                {errorMsg}customerNameFilter
              </div> 
              : <p>Messages</p>
            } 
          </div>
          <div className="col-3">

          </div>
          <div className="col-4">
            <input 
              type="text" 
              className="form-control mt-3"
              placeholder="Search by name"
              value={customerNameFilter}
              onChange={event => {
                // mejorar el filtro para que no se ejecute cada vez que se escribe una letra
                  setCustomerNameFilter(event.target.value);
                  setCurrentPage(1); // to avoid pagination errors
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
                {/* <option value="false">With debts</option> */}
            </select>
          </div>          
        </div> 
        <div className="row">   
          { loading ? 
                      <div className="row">  
                        <div className="col-6"><h3 className="float-end">Loading customers</h3></div>
                        <div className="col-6">
                          <div className="spinner-border text-warning float-start" role="status">
                            <span className="sr-only"></span>
                          </div>
                        </div>
                      </div> 
                    :
            
                      <DisplayItems 
                        currentItems={currentCustomers}
                        thereAreCustomersWithDebt={thereAreCustomersWithDebt}
                      /> 
              
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