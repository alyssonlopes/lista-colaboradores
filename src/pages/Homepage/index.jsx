import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import EmployeeList from "../../components/EmployeeList";
import EmployeeListItem from "../../components/EmployeeListItem";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import { getEmployeeFromJson } from "../../adapters/employee";
import { EmployeeContext } from "../../providers/Employee";
import { get } from "../../api";

const InnerHomepage = ({ setEmployee }) => {
  const [employeesData, setEmployeesData] = useState(null);
  const [employeesList, setEmployeesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const employees = await get("/api/employees");

        const list = employees.results.map(getEmployeeFromJson);
        setEmployeesData(list);
      } catch (error) {
        console.error(error);
      }
    }
    return fetchData();
  }, []);

  useEffect(() => {
    if (employeesData) {
      setEmployeesList(employeesData);
      setIsLoading(false);
    }
  }, [employeesData]);

  const onSearch = (event) => {
    const { value } = event.target;
    const list = employeesData.filter((employee) => {
      return employee.name.toLowerCase().includes(value.toLowerCase());
    });
    setEmployeesList(list);
  };

  return (
    <>
      <Header title={"Employee Directory"} addPath={"/register"} />
      <SearchBar onSearch={onSearch} />

      {isLoading && <Loading />}
      {!isLoading && (
        <EmployeeList>
          {employeesList.map((employee, index) => {
            return (
              <Link
                key={index}
                to="/employee"
                style={{ color: "inherit", textDecoration: "inherit" }}
                onClick={() => setEmployee(employee)}
              >
                <EmployeeListItem {...employee} />
              </Link>
            );
          })}
        </EmployeeList>
      )}
    </>
  );
};

const Homepage = ({ children, ...rest }) => {
  return (
    <EmployeeContext.Consumer>
      {(value) => {
        return (
          <InnerHomepage {...rest} {...value}>
            {children}
          </InnerHomepage>
        );
      }}
    </EmployeeContext.Consumer>
  );
};

export default Homepage;
